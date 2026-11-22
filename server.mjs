import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = '127.0.0.1';
const DEFAULT_PORT = Number(process.env.WORKSHOP_PORT || 4747);
const SESSION_TOKEN = crypto.randomBytes(24).toString('hex');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};
const ALLOWED_STATIC_FILES = new Set(['index.html', 'styles.css', 'app.js']);

/**
 * Normalize OS-specific user home paths so responses never expose the local Windows account name.
 */
function redactHomePath(input) {
  if (typeof input !== 'string') return '';
  const userHome = process.env.USERPROFILE || process.env.HOME || '';
  if (!userHome) return input;
  const variants = [
    userHome,
    userHome.replace(/\\/g, '\\\\'),
    userHome.replace(/\\/g, '/')
  ];
  let out = input;
  for (const variant of variants) {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'gi'), '%USERPROFILE%');
  }
  return out;
}

function getLocalAppData() {
  return process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Local');
}

function getUserHome() {
  return process.env.USERPROFILE || process.env.HOME || '';
}

function getItLocalStateDir() {
  return path.join(getLocalAppData(), 'Packages', 'Microsoft.IntelligentTerminal_8wekyb3d8bbwe', 'LocalState');
}

async function runSafeCommand(file, args = [], timeoutMs = 8000) {
  try {
    const { stdout, stderr } = await execFileAsync(file, args, {
      timeout: timeoutMs,
      windowsHide: true,
      maxBuffer: 512 * 1024
    });
    return { ok: true, stdout: redactHomePath(stdout.trim()), stderr: redactHomePath(stderr.trim()) };
  } catch (err) {
    return {
      ok: false,
      code: err?.code ?? 1,
      stdout: redactHomePath((err?.stdout || '').toString().trim()),
      stderr: redactHomePath((err?.stderr || err?.message || '').toString().trim())
    };
  }
}

async function findExecutable(name) {
  const res = await runSafeCommand('where.exe', [name], 3000);
  if (!res.ok || !res.stdout) return { present: false, path: null };
  const first = res.stdout.split(/\r?\n/)[0]?.trim() || '';
  return { present: Boolean(first), path: redactHomePath(first) };
}

async function resolveWtaExe() {
  const psScript = '(Get-AppxPackage Microsoft.IntelligentTerminal -ErrorAction SilentlyContinue).InstallLocation';
  const res = await runSafeCommand('powershell.exe', ['-NoProfile', '-Command', psScript], 5000);
  if (!res.ok || !res.stdout) return null;
  const wtaPath = path.join(res.stdout.trim(), 'wta.exe');
  return fs.existsSync(wtaPath) ? wtaPath : null;
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

async function probeOverview() {
  const [wtai, agy, claude, codex, gemini, git, nodeBin, adb] = await Promise.all([
    findExecutable('wtai.exe'),
    findExecutable('agy.exe'),
    findExecutable('claude.exe'),
    findExecutable('codex.exe'),
    findExecutable('gemini.cmd'),
    findExecutable('git.exe'),
    findExecutable('node.exe'),
    findExecutable('adb.exe')
  ]);

  const itSettings = readJsonSafe(path.join(getItLocalStateDir(), 'settings.json'));
  const agyCliSettings = readJsonSafe(path.join(getUserHome(), '.gemini', 'antigravity-cli', 'settings.json'));
  const agyConfig = readJsonSafe(path.join(getUserHome(), '.gemini', 'config', 'config.json'));
  const geminiSettings = readJsonSafe(path.join(getUserHome(), '.gemini', 'settings.json'));

  const profiles = Array.isArray(itSettings?.profiles?.list) ? itSettings.profiles.list : [];
  const defaultProfileObj = profiles.find((p) => p.guid === itSettings?.defaultProfile);

  return {
    binaries: { wtai, agy, claude, codex, gemini, git, node: nodeBin, adb },
    intelligentTerminal: itSettings
      ? {
          defaultProfileName: defaultProfileObj?.name || itSettings.defaultProfile,
          acpAgent: itSettings.acpAgent || null,
          acpModel: itSettings.acpModel || null,
          delegateAgent: itSettings.delegateAgent || null,
          delegateModel: itSettings.delegateModel || null,
          autoFixEnabled: Boolean(itSettings.autoFixEnabled),
          yoloMode: Boolean(itSettings['agentPane.yoloMode']),
          renderAgentMarkdown: Boolean(itSettings.renderAgentMarkdown),
          tabLayout: itSettings.tabLayout || null
        }
      : null,
    antigravity: {
      modelProviderOverrideRemoved: agyCliSettings ? !('modelProvider' in agyCliSettings) : null,
      enableTerminalSandbox: agyConfig?.userSettings?.enableTerminalSandbox ?? null,
      permissionPreset: agyConfig?.userSettings?.permissionPreset ?? null,
      autoExecutionPolicy: agyConfig?.userSettings?.autoExecutionPolicy ?? null
    },
    geminiCli: geminiSettings
      ? {
          maxSessionTurns: geminiSettings?.model?.maxSessionTurns ?? null,
          enableAgents: geminiSettings?.experimental?.enableAgents ?? null,
          worktrees: geminiSettings?.experimental?.worktrees ?? null,
          dynamicModelConfiguration: geminiSettings?.experimental?.dynamicModelConfiguration ?? null
        }
      : null
  };
}

async function probeHooks() {
  const wtaExe = await resolveWtaExe();
  if (!wtaExe) {
    return { available: false, error: 'Microsoft Intelligent Terminal wta.exe not located.' };
  }
  const res = await runSafeCommand(wtaExe, ['hooks', 'status', '--json'], 8000);
  if (!res.ok) {
    return { available: true, error: res.stderr || 'wta hooks status failed' };
  }
  try {
    return { available: true, hooks: JSON.parse(res.stdout) };
  } catch {
    return { available: true, raw: res.stdout };
  }
}

async function probeModels() {
  const agyExe = await findExecutable('agy.exe');
  const modelsRes = agyExe.present ? await runSafeCommand('agy', ['models'], 6000) : { ok: false, stdout: '' };
  const models = modelsRes.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Fetching'))
    .map((line) => {
      const [id, label] = line.split('\t');
      return { id: (id || '').trim(), label: (label || id || '').trim() };
    });

  const itSettings = readJsonSafe(path.join(getItLocalStateDir(), 'settings.json'));
  const profiles = Array.isArray(itSettings?.profiles?.list) ? itSettings.profiles.list : [];
  const agentProfiles = profiles
    .filter((p) => p.source === 'IntelligentTerminal.AgentProfiles')
    .map((p) => ({
      name: p.name,
      guid: p.guid,
      model: p['agentProfile.model'] || null,
      permissionMode: p['agentProfile.permissionMode'] || '(inherits native Turbo/Eager)'
    }));

  return {
    acpModel: itSettings?.acpModel || null,
    delegateModel: itSettings?.delegateModel || null,
    agentProfiles,
    agyModels: models
  };
}

async function probePrompts() {
  const promptsDir = path.join(getItLocalStateDir(), 'IntelligentTerminal', 'prompts');
  const results = {};
  for (const file of ['terminal-agent.md', 'auto-fix.md']) {
    const full = path.join(promptsDir, file);
    if (!fs.existsSync(full)) {
      results[file] = { exists: false };
      continue;
    }
    const content = fs.readFileSync(full, 'utf8');
    results[file] = {
      exists: true,
      bytes: Buffer.byteLength(content, 'utf8'),
      hasRuntimeContextMarker: content.trimEnd().endsWith('<!-- WTA_RUNTIME_CONTEXT -->'),
      hasFuzzinessProtocol: content.includes('Fuzziness & Emboldened Autonomy Protocol'),
      hasHandoffToolRef: content.includes('run_command_in_current_shell')
    };
  }
  return results;
}

async function probeAuth() {
  const agyCliSettings = readJsonSafe(path.join(getUserHome(), '.gemini', 'antigravity-cli', 'settings.json'));
  const googleAccounts = readJsonSafe(path.join(getUserHome(), '.gemini', 'google_accounts.json'));
  const codexRes = await runSafeCommand('codex', ['login', 'status'], 5000);
  const wtaExe = await resolveWtaExe();
  let acpStartup = null;
  if (wtaExe) {
    const acpBin = path.join(
      getLocalAppData(),
      'Packages',
      'Microsoft.IntelligentTerminal_8wekyb3d8bbwe',
      'LocalCache',
      'Local',
      'IntelligentTerminal',
      'agents',
      'antigravity-acp',
      '1.4.0',
      'windows-x86_64',
      'agy_acp_server.exe'
    );
    if (fs.existsSync(acpBin)) {
      const acpRes = await runSafeCommand(wtaExe, ['verify-acp', '--agent', acpBin, '--agent-id', 'antigravity'], 8000);
      try {
        acpStartup = JSON.parse(acpRes.stdout);
      } catch {
        acpStartup = { ok: acpRes.ok };
      }
    }
  }

  return {
    antigravityCli: {
      modelProviderConflictRemoved: agyCliSettings ? !('modelProvider' in agyCliSettings) : false,
      acpStartupVerified: Boolean(acpStartup?.startup_verified)
    },
    codex: {
      loggedIn: /Logged in/i.test(`${codexRes.stdout} ${codexRes.stderr}`),
      summary: (codexRes.stdout || codexRes.stderr || 'Unavailable').split(/\r?\n/)[0]
    },
    geminiCli: {
      activeOAuthAccount: googleAccounts?.active || null,
      apiKeyPresent: Boolean(process.env.GEMINI_API_KEY),
      note: googleAccounts?.active
        ? 'OAuth account active'
        : 'OAuth inactive (active: null); check AIza key or /auth if standalone Gemini CLI returns 401.'
    }
  };
}

const PROBE_HANDLERS = {
  overview: probeOverview,
  hooks: probeHooks,
  models: probeModels,
  prompts: probePrompts,
  auth: probeAuth
};

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(payload);
}

function readRequestBody(req, maxBytes = 8192) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export function createWorkshopServer() {
  return http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url || '/', `http://${HOST}`);
    const pathname = reqUrl.pathname;

    if (req.method === 'GET' && pathname === '/health') {
      return sendJson(res, 200, { status: 'ok', service: 'intelligent-terminal-workshop' });
    }

    if (req.method === 'POST' && pathname === '/api/probe') {
      const token = req.headers['x-workshop-token'];
      if (typeof token !== 'string' || token !== SESSION_TOKEN) {
        return sendJson(res, 403, { error: 'Invalid or missing workshop session token.' });
      }
      try {
        const rawBody = await readRequestBody(req);
        const body = rawBody ? JSON.parse(rawBody) : {};
        const target = typeof body.target === 'string' ? body.target : 'overview';
        const handler = PROBE_HANDLERS[target];
        if (!handler) {
          return sendJson(res, 400, { error: `Unknown probe target: ${target}` });
        }
        const result = await handler();
        return sendJson(res, 200, { target, timestamp: new Date().toISOString(), result });
      } catch (err) {
        return sendJson(res, 400, { error: err?.message || 'Malformed probe request.' });
      }
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    const relPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    if (!ALLOWED_STATIC_FILES.has(relPath)) {
      return sendJson(res, 404, { error: 'Not found' });
    }
    const safePath = path.resolve(__dirname, relPath);
    if (!safePath.startsWith(__dirname + path.sep)) {
      return sendJson(res, 403, { error: 'Forbidden' });
    }

    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
      return sendJson(res, 404, { error: 'Not found' });
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (relPath === 'index.html') {
      const html = fs.readFileSync(safePath, 'utf8').replace('__WORKSHOP_TOKEN__', SESSION_TOKEN);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      });
      return res.end(req.method === 'HEAD' ? undefined : html);
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(safePath).pipe(res);
  });
}

if (process.argv[1] === __filename) {
  const server = createWorkshopServer();
  server.listen(DEFAULT_PORT, HOST, () => {
    console.log(`[Intelligent Terminal Workshop] Live at http://${HOST}:${DEFAULT_PORT}/`);
  });
}
