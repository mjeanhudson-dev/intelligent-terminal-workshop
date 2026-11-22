import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWorkshopServer } from '../server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const VERIFIED_URL_SET = new Set([
  'https://antigravity.google',
  'https://antigravity.google/download',
  'https://aistudio.google.com',
  'https://ai.google.dev',
  'https://developers.google.com/program',
  'https://developers.google.com',
  'https://developers.google.com/apis-explorer',
  'https://developers.google.com/innovators',
  'https://developers.google.com/edge',
  'https://developer.android.com/studio/preview',
  'https://developer.chrome.com/',
  'https://cloud.google.com/startup',
  'https://labs.google',
  'https://idx.dev',
  'https://g.co/androidbeta',
  'https://firebase.google.com/docs/app-distribution',
  'https://github.com/google-gemini/gemini-cli/releases',
  'https://github.com/google-gemini/gemini-api-cli/releases',
  'https://github.com/microsoft/terminal/releases',
  'https://github.com/microsoft/terminal/discussions/16121',
  'https://github.com/anthropics/claude-code',
  'https://claude-code.mintlify.site/',
  'https://github.com/openai/codex',
  'https://learn.chatgpt.com/docs/codex/cli',
  'https://play.google.com/store/apps/details?id=com.google.android.apps.bard',
  'https://play.google.com/store/apps/details?id=com.anthropic.claude',
  'https://play.google.com/store/apps/details?id=com.openai.chatgpt',
  'https://github.com/mjeanhudson-dev'
]);

// 1. Check zero OS username leakage across all authored files
const osUser = os.userInfo().username;
const authoredFiles = ['index.html', 'styles.css', 'app.js', 'server.mjs', 'Start-Workshop.ps1', 'README.md', 'package.json'];
for (const file of authoredFiles) {
  const full = path.join(rootDir, file);
  const text = fs.readFileSync(full, 'utf8');
  assert.equal(
    new RegExp(osUser, 'i').test(text),
    false,
    `OS username leaked inside ${file}`
  );
}
console.log('PASS: Zero OS username leakage across all authored files');

// 2. Check every https:// URL in app.js matches the verified URL set
const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
const foundUrls = [...new Set(appJs.match(/https:\/\/[^\s'"`<>]+/g) || [])];
assert(foundUrls.length >= 20, `Expected >=20 verified portal URLs, found ${foundUrls.length}`);
for (const u of foundUrls) {
  assert(VERIFIED_URL_SET.has(u), `Unverified URL found in app.js: ${u}`);
}
console.log(`PASS: All ${foundUrls.length} portal URLs in app.js match verified whitelist`);

// 3. Start ephemeral server & verify HTTP + CSRF + read-only probe endpoints
const server = createWorkshopServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  const healthRes = await fetch(`${baseUrl}/health`);
  assert.equal(healthRes.status, 200);
  const health = await healthRes.json();
  assert.equal(health.status, 'ok');

  const htmlRes = await fetch(`${baseUrl}/`);
  assert.equal(htmlRes.status, 200);
  const html = await htmlRes.text();
  assert(!html.includes('__WORKSHOP_TOKEN__'), 'Placeholder token was not injected');
  const tokenMatch = html.match(/name="workshop-token"\s+content="([a-f0-9]+)"/);
  assert(tokenMatch, 'Missing injected workshop-token meta tag');
  const token = tokenMatch[1];

  const cssRes = await fetch(`${baseUrl}/styles.css`);
  assert.equal(cssRes.status, 200);
  const jsRes = await fetch(`${baseUrl}/app.js`);
  assert.equal(jsRes.status, 200);

  const deniedStatic = await fetch(`${baseUrl}/server.mjs`);
  assert.equal(deniedStatic.status, 404);

  const unauthProbe = await fetch(`${baseUrl}/api/probe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target: 'overview' })
  });
  assert.equal(unauthProbe.status, 403);

  for (const target of ['overview', 'hooks', 'models', 'prompts', 'auth']) {
    const res = await fetch(`${baseUrl}/api/probe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-workshop-token': token
      },
      body: JSON.stringify({ target })
    });
    assert.equal(res.status, 200, `Probe ${target} failed with ${res.status}`);
    const payload = await res.json();
    assert.equal(payload.target, target);
    const rawJson = JSON.stringify(payload);
    assert.equal(
      new RegExp(osUser, 'i').test(rawJson),
      false,
      `OS username leaked inside probe response for ${target}`
    );
  }

  console.log('PASS: HTTP static allowlist, CSRF token guard, and all 5 live /api/probe endpoints verified');
} finally {
  await new Promise((resolve) => server.close(resolve));
}
