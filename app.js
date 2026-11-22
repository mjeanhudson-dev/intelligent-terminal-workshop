/**
 * Sovereign Terminal Workshop — Client Runtime
 * Authored by Eloquent (@mjeanhudson-dev)
 */

const WORKSHOP_TOKEN =
  document.querySelector('meta[name="workshop-token"]')?.getAttribute('content') || '';

const CHAPTERS = [
  {
    id: 0,
    num: 'CH 00',
    name: 'The Opening Payoff',
    tag: 'Why the terminal is unfair leverage',
    labId: 'ch0-unlock'
  },
  {
    id: 1,
    num: 'CH 01',
    name: 'Intelligent Terminal Cockpit',
    tag: 'Keybinding dojo, agent pane & live host probe',
    labId: 'ch1-dojo'
  },
  {
    id: 2,
    num: 'CH 02',
    name: 'The Terminal Way of Doing',
    tag: 'Pipes, Stage-0 slices, SHA-256 & 4 live drills',
    labId: 'ch2-drills'
  },
  {
    id: 3,
    num: 'CH 03',
    name: 'Agentic CLI Mastery',
    tag: 'Unsandboxed agy, model forge & 4-CLI status',
    labId: 'ch3-forge'
  },
  {
    id: 4,
    num: 'CH 04',
    name: 'Parallel Panes & Worktrees',
    tag: 'Split-pane builder, git worktrees & macro hooks',
    labId: 'ch4-panes'
  },
  {
    id: 5,
    num: 'CH 05',
    name: 'Closing Payoff & Sovereign Portals',
    tag: 'PC/Android beta/alpha portals & dev recognition',
    labId: 'ch5-portals'
  }
];

const CHORDS = [
  {
    id: 'open-pane',
    keys: 'Ctrl + Shift + .',
    action: 'Terminal.OpenAgentPane',
    summary: 'Opens or toggles the docked Antigravity Agent Pane right inside your active shell tab.',
    paneOpen: true,
    sidebarOpen: true,
    splitCount: 1,
    autofix: false
  },
  {
    id: 'focus-pane',
    keys: 'Ctrl + Shift + I',
    action: 'Terminal.FocusAgentPane',
    summary: 'Jumps cursor focus straight between your PowerShell prompt and the bottom Agent Pane without touching the mouse.',
    paneOpen: true,
    sidebarOpen: true,
    splitCount: 1,
    autofix: false
  },
  {
    id: 'autofix',
    keys: 'Ctrl + Alt + .',
    action: 'Terminal.TriggerAutofix',
    summary: 'Captures the failing shell buffer and failure summary, then drafts a single-click corrected command via auto-fix.md.',
    paneOpen: true,
    sidebarOpen: true,
    splitCount: 1,
    autofix: true
  },
  {
    id: 'delegate',
    keys: 'Alt + Shift + /',
    action: 'Terminal.OpenAgentDelegation',
    summary: 'Delegates a self-contained task to a configured agent (Antigravity, Codex, Claude, Gemini) in a fresh tab or split.',
    paneOpen: true,
    sidebarOpen: true,
    splitCount: 2,
    autofix: false
  },
  {
    id: 'sidebar',
    keys: 'Ctrl + Shift + S',
    action: 'Terminal.ToggleSidebar',
    summary: 'Shows or hides the vertical session sidebar (pinned with recent agent sessions and active tab agents).',
    paneOpen: false,
    sidebarOpen: true,
    splitCount: 1,
    autofix: false
  },
  {
    id: 'split',
    keys: 'Alt + Shift + D',
    action: 'Terminal.DuplicatePaneAuto',
    summary: 'Splits the active workspace automatically along the wider dimension for side-by-side diffs, logs, and agents.',
    paneOpen: false,
    sidebarOpen: true,
    splitCount: 2,
    autofix: false
  },
  {
    id: 'quake',
    keys: 'Win + `',
    action: 'Terminal.QuakeMode',
    summary: 'Drops down a summonable global terminal overlay over any desktop window and retracts cleanly on second press.',
    paneOpen: true,
    sidebarOpen: false,
    splitCount: 1,
    autofix: false
  }
];

const DRILLS = [
  {
    id: 'drill-1',
    title: 'Drill 1 — Launch Antigravity Unsandboxed',
    prompt: 'Run Antigravity CLI unsandboxed with zero permission prompts using Gemini 4 Neon (XHigh).',
    hint: 'agy --dangerously-skip-permissions --model gemini-4-neon-xhigh',
    validator: (cmd) =>
      /\bagy\b/i.test(cmd) &&
      /--dangerously-skip-permissions\b/i.test(cmd) &&
      /--model\s+gemini-4-neon-xhigh\b/i.test(cmd)
  },
  {
    id: 'drill-2',
    title: 'Drill 2 — Stage-0 Bounded Context Slice',
    prompt: 'Slice only lines 1–160 of a file or diff (never read an unbounded file into frontier context).',
    hint: 'git diff | Select-Object -First 160',
    validator: (cmd) =>
      (/\bSelect-Object\s+-First\s+\d+/i.test(cmd) || /\bhead\s+-n\s*\d+/i.test(cmd)) &&
      /(git\s+diff|Get-Content|rg|Select-String)/i.test(cmd)
  },
  {
    id: 'drill-3',
    title: 'Drill 3 — Verify ACP Handshake & Hooks',
    prompt: 'Inspect the installed Intelligent Terminal agent hook bridge across all CLIs.',
    hint: 'wta hooks status --json',
    validator: (cmd) => /\bwta(\.exe)?\s+hooks\s+status\b/i.test(cmd)
  },
  {
    id: 'drill-4',
    title: 'Drill 4 — Isolate Parallel Agent Worktree',
    prompt: 'Create an isolated git worktree branch so parallel agents never collide on shared files.',
    hint: 'git worktree add ../wt-feature -b feat/terminal-lab',
    validator: (cmd) => /\bgit\s+worktree\s+add\b/i.test(cmd)
  }
];

const PORTALS = [
  {
    id: 'antigravity-pc',
    name: 'Google Antigravity (App, IDE & CLI)',
    platform: 'PC',
    channel: 'Early Access / Preview',
    accessType: 'Direct Public Portal & Download',
    url: 'https://antigravity.google/download',
    secondaryUrl: 'https://antigravity.google',
    description:
      'Flagship standalone desktop agent command center, IDE extensions (VS Code, JetBrains, Zed), and the lightweight agy CLI wired to Gemini 4 Neon/Carbon/Hydrogen/Argon.',
    command: 'agy --dangerously-skip-permissions --model gemini-4-neon-xhigh'
  },
  {
    id: 'windows-terminal-canary',
    name: 'Windows Terminal Canary & Releases',
    platform: 'PC',
    channel: 'Alpha / Canary',
    accessType: 'Direct Nightly AppInstaller / ZIP',
    url: 'https://github.com/microsoft/terminal/discussions/16121',
    secondaryUrl: 'https://github.com/microsoft/terminal/releases',
    description:
      'Bleeding-edge Windows Terminal nightly channel where experimental AI / Terminal Chat integrations land alongside stable MSIX bundles (complementing Microsoft Intelligent Terminal).',
    command: 'wtai.exe new-tab -p "Google Antigravity"'
  },
  {
    id: 'google-aistudio',
    name: 'Google AI Studio & Gemini API',
    platform: 'PC',
    channel: 'Early Access / Labs',
    accessType: 'Direct Developer Portal',
    url: 'https://aistudio.google.com',
    secondaryUrl: 'https://ai.google.dev',
    description:
      'Direct model workbench with free developer prototyping tier, 75% cost-saving Context Caching, massive context testing, and browser-based Android preview.',
    command: 'curl -s https://ai.google.dev | head -n 20'
  },
  {
    id: 'google-labs',
    name: 'Google Labs & Project IDX',
    platform: 'PC',
    channel: 'Early Access / Labs',
    accessType: 'Experimental Opt-In Portal',
    url: 'https://labs.google',
    secondaryUrl: 'https://idx.dev',
    description:
      'Unlisted experimental AI prototypes, autonomous browser agent previews, and Project IDX cloud Nix/Linux workspaces with built-in Android emulators.',
    command: 'start https://labs.google'
  },
  {
    id: 'chrome-epp',
    name: 'Chrome Early Preview Program (Web AI & WebMCP)',
    platform: 'PC',
    channel: 'Alpha / Canary',
    accessType: 'Official Developer Opt-In',
    url: 'https://developer.chrome.com/',
    secondaryUrl: 'https://developer.chrome.com/',
    description:
      'Track and apply for Chrome built-in AI APIs, WebMCP implementations, and Canary diagnostics (chrome://gpu, chrome://tracing, chrome://net-export).',
    command: 'start https://developer.chrome.com/'
  },
  {
    id: 'gemini-cli-releases',
    name: 'Gemini CLI & Gemini API CLI',
    platform: 'PC',
    channel: 'CLI Releases',
    accessType: 'Open-Source GitHub Releases',
    url: 'https://github.com/google-gemini/gemini-cli/releases',
    secondaryUrl: 'https://github.com/google-gemini/gemini-api-cli/releases',
    description:
      'Official GitHub release tracks for @google/gemini-cli (terminal agent with worktrees, subagents, model steering) and stateless Go-based gemini-api-cli.',
    command: 'npm i -g @google/gemini-cli@latest'
  },
  {
    id: 'android-studio-preview',
    name: 'Android Studio Preview (Canary / Beta)',
    platform: 'Android',
    channel: 'Alpha / Canary',
    accessType: 'Direct Canary/Beta Download',
    url: 'https://developer.android.com/studio/preview',
    secondaryUrl: 'https://developers.google.com/edge',
    description:
      'Pre-release Android Studio Canary & Beta builds with integrated Gemini coding agents, Jetpack Compose live previews, and Google AI Edge tooling.',
    command: 'adb devices -l'
  },
  {
    id: 'android-beta-program',
    name: 'Android Beta Program & Gemini Android App',
    platform: 'Android',
    channel: 'Beta / Store',
    accessType: 'Device Opt-In & Play Store',
    url: 'https://g.co/androidbeta',
    secondaryUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.bard',
    description:
      'Official Pixel / Android OS beta enrollment portal plus the Google Play listing for Gemini on Android (scroll listing for Google Play Beta opt-in when open).',
    command: 'adb shell am start -a android.settings.APPLICATION_DEVELOPMENT_SETTINGS'
  },
  {
    id: 'android-ai-edge-aicore',
    name: 'Google AI Edge & AICore Developer Preview',
    platform: 'Android',
    channel: 'Early Access / Labs',
    accessType: 'Device Developer Preview Toggle + SDK',
    url: 'https://developers.google.com/edge',
    secondaryUrl: 'https://firebase.google.com/docs/app-distribution',
    description:
      'On-device Gemini Nano / Gemma testing via AICore Developer Preview (Device Settings -> System -> Developer options -> AICore Settings) plus Firebase App Distribution for pre-release APKs.',
    command: 'adb shell getprop ro.build.version.release'
  },
  {
    id: 'claude-codex-ecosystem',
    name: 'Claude Code & OpenAI Codex (PC + Android)',
    platform: 'PC',
    channel: 'CLI Releases',
    accessType: 'Official CLI & Play Store',
    url: 'https://github.com/anthropics/claude-code',
    secondaryUrl: 'https://github.com/openai/codex',
    description:
      'Official CLI repos and docs for Anthropic Claude Code and OpenAI Codex CLI alongside Android companion apps on Google Play.',
    command: 'codex login status'
  },
  {
    id: 'claude-chatgpt-android',
    name: 'Claude & ChatGPT Android (Google Play)',
    platform: 'Android',
    channel: 'Beta / Store',
    accessType: 'Google Play & Beta Opt-In',
    url: 'https://play.google.com/store/apps/details?id=com.anthropic.claude',
    secondaryUrl: 'https://play.google.com/store/apps/details?id=com.openai.chatgpt',
    description:
      'Official Android apps for Claude and ChatGPT (including Play Store beta testing channels directly on each app listing).',
    command: 'adb shell pm list packages | findstr /i "anthropic openai google.android.apps.bard"'
  },
  {
    id: 'google-dev-recognition',
    name: 'Google Developer Program & Cloud Startups',
    platform: 'PC',
    channel: 'Dev Recognition',
    accessType: 'Official Membership & Application Portal',
    url: 'https://developers.google.com/program',
    secondaryUrl: 'https://cloud.google.com/startup',
    description:
      'Official Google Developer Program membership, early product preview tracks, Google Cloud Startup/Innovators credit applications, and authenticated APIs Explorer.',
    command: 'gcloud auth list'
  }
];

const EXTRA_PORTAL_LINKS = [
  { label: 'Google Cloud Innovators', url: 'https://developers.google.com/innovators' },
  { label: 'Google APIs Explorer', url: 'https://developers.google.com/apis-explorer' },
  { label: 'Google for Developers', url: 'https://developers.google.com' },
  { label: 'Claude Code Docs', url: 'https://claude-code.mintlify.site/' },
  { label: 'OpenAI Codex CLI Docs', url: 'https://learn.chatgpt.com/docs/codex/cli' },
  { label: 'Eloquent GitHub (@mjeanhudson-dev)', url: 'https://github.com/mjeanhudson-dev' }
];

const state = {
  chapter: Number(localStorage.getItem('workshop-chapter') || 0),
  completedChapters: new Set(JSON.parse(localStorage.getItem('workshop-completed') || '[]')),
  solvedDrills: new Set(JSON.parse(localStorage.getItem('workshop-drills') || '[]')),
  viewContrast: 'terminal',
  selectedChordId: 'open-pane',
  pipelineStage: 0,
  forge: {
    agent: 'agy',
    mode: 'unsandboxed',
    model: 'gemini-4-neon-xhigh',
    output: 'interactive',
    promptText: 'Audit local git status and propose a minimal diff'
  },
  panes: [
    { id: 1, title: 'Pane 1 · Main Shell', profile: 'Google Antigravity', branch: 'main', dir: '~/repo' },
    { id: 2, title: 'Pane 2 · Parallel Worker', profile: 'Codex', branch: 'feat/terminal-lab', dir: '~/wt-terminal-lab' }
  ],
  portalPlatform: 'All',
  portalChannel: 'All',
  dossierTrack: 'Google Developer Program & Early Access',
  dossierMilestones: new Set(['acp-orchestration', 'stage0-efficiency', 'android-edge', 'hid-control']),
  hostProbe: null,
  probeStatus: 'idle',
  history: [],
  historyIdx: -1
};

function saveState() {
  localStorage.setItem('workshop-chapter', String(state.chapter));
  localStorage.setItem('workshop-completed', JSON.stringify([...state.completedChapters]));
  localStorage.setItem('workshop-drills', JSON.stringify([...state.solvedDrills]));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

async function copyText(text, label = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    showToast(label);
  }
}

function markChapterDone(chapterId) {
  if (!state.completedChapters.has(chapterId)) {
    state.completedChapters.add(chapterId);
    saveState();
    renderNavAndProgress();
  }
}

async function runHostProbe(target = 'overview') {
  const summaryEl = document.getElementById('rail-host-summary');
  state.probeStatus = 'loading';
  if (summaryEl) summaryEl.textContent = `Probing ${target} on 127.0.0.1...`;

  try {
    const res = await fetch('/api/probe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-workshop-token': WORKSHOP_TOKEN
      },
      body: JSON.stringify({ target })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    if (!state.hostProbe) state.hostProbe = {};
    state.hostProbe[target] = data.result;
    state.probeStatus = 'ready';

    if (summaryEl && target === 'overview' && data.result?.intelligentTerminal) {
      const it = data.result.intelligentTerminal;
      summaryEl.textContent = `Live: ${it.defaultProfileName} · ACP ${it.acpModel} · AutoFix=${it.autoFixEnabled} · Yolo=${it.yoloMode}`;
    } else if (summaryEl) {
      summaryEl.textContent = `Probe "${target}" updated at ${new Date(data.timestamp).toLocaleTimeString()}`;
    }
    renderStage();
    showToast(`Live probe "${target}" succeeded`);
  } catch (err) {
    state.probeStatus = 'error';
    if (summaryEl) summaryEl.textContent = `Probe failed: ${err.message}`;
    showToast(`Probe error: ${err.message}`);
  }
}

/* ==================== Interactive Terminal Sandbox ==================== */

function appendTerminalLine(text, cls = '') {
  const out = document.getElementById('sandbox-output');
  if (!out) return;
  const p = document.createElement('div');
  p.className = `term-line ${cls}`.trim();
  p.textContent = text;
  out.appendChild(p);
  out.scrollTop = out.scrollHeight;
}

function openSandbox(prefill = '') {
  const drawer = document.getElementById('sandbox-drawer');
  const input = document.getElementById('sandbox-input');
  if (!drawer) return;
  drawer.classList.remove('is-collapsed');
  if (prefill && input) {
    input.value = prefill;
  }
  input?.focus();
}

function toggleSandbox(forceOpen) {
  const drawer = document.getElementById('sandbox-drawer');
  if (!drawer) return;
  if (typeof forceOpen === 'boolean') {
    drawer.classList.toggle('is-collapsed', !forceOpen);
  } else {
    drawer.classList.toggle('is-collapsed');
  }
  if (!drawer.classList.contains('is-collapsed')) {
    document.getElementById('sandbox-input')?.focus();
  }
}

function evaluateDrillCommand(cmd) {
  let matchedAny = false;
  for (const drill of DRILLS) {
    if (drill.validator(cmd)) {
      matchedAny = true;
      if (!state.solvedDrills.has(drill.id)) {
        state.solvedDrills.add(drill.id);
        saveState();
        appendTerminalLine(`[PASS] ${drill.title} verified!`, 'term-ok');
        showToast(`Verified: ${drill.title}`);
        if (state.solvedDrills.size >= 2) {
          markChapterDone(2);
        }
        if (state.chapter === 2) renderStage();
      }
    }
  }
  return matchedAny;
}

function executeSandboxCommand(rawCmd) {
  const cmd = rawCmd.trim();
  if (!cmd) return;
  state.history.push(cmd);
  state.historyIdx = state.history.length;
  appendTerminalLine(`PS Eloquent> ${cmd}`, 'term-cmd');

  const lower = cmd.toLowerCase();
  if (lower === 'clear' || lower === 'cls') {
    const out = document.getElementById('sandbox-output');
    if (out) out.innerHTML = '';
    return;
  }

  if (lower === 'help') {
    appendTerminalLine('Built-in Workshop Sandbox Commands:', 'term-ok');
    appendTerminalLine('  agy --dangerously-skip-permissions --model gemini-4-neon-xhigh');
    appendTerminalLine('  git diff | Select-Object -First 160');
    appendTerminalLine('  wta hooks status --json');
    appendTerminalLine('  git worktree add ../wt-feature -b feat/terminal-lab');
    appendTerminalLine('  wtai.exe new-tab -p "Google Antigravity"');
    appendTerminalLine('  probe overview | probe hooks | probe models | probe auth');
    appendTerminalLine('  clear | hint');
    return;
  }

  if (lower === 'hint') {
    const nextDrill = DRILLS.find((d) => !state.solvedDrills.has(d.id)) || DRILLS[0];
    appendTerminalLine(`[HINT] ${nextDrill.title}: ${nextDrill.hint}`, 'term-warn');
    return;
  }

  if (lower.startsWith('probe ')) {
    const target = lower.replace(/^probe\s+/, '').trim();
    appendTerminalLine(`Dispatching live read-only host probe (${target})...`, 'term-muted');
    runHostProbe(target);
    return;
  }

  if (/\bagy\b/i.test(cmd)) {
    const unsandboxed = !/--sandbox\b/i.test(cmd);
    const skipPerm = /--dangerously-skip-permissions\b/i.test(cmd);
    appendTerminalLine(
      `[agy] Launched (${unsandboxed ? 'UNSANDBOXED default' : 'SANDBOXED'}, ${
        skipPerm ? 'zero prompt mode' : 'standard mode'
      }) · Auth: native Antigravity G1 credits (modelProvider override removed).`,
      'term-ok'
    );
    markChapterDone(0);
    markChapterDone(3);
  } else if (/\bwta(\.exe)?\s+hooks\s+status\b/i.test(cmd)) {
    appendTerminalLine(
      '[wta hooks] antigravity: v0.1.2 (ok) | claude: v0.1.9 (ok) | codex: v0.1.9 (ok) | gemini: v0.1.7 (ok)',
      'term-ok'
    );
    markChapterDone(1);
  } else if (/\bgit\s+worktree\s+add\b/i.test(cmd)) {
    appendTerminalLine(
      '[git] Preparing isolated worktree (shared .git object store, separate working directory & index). Zero file collisions across parallel agents.',
      'term-ok'
    );
    markChapterDone(4);
  } else if (/\bwtai(\.exe)?\b/i.test(cmd)) {
    appendTerminalLine(
      '[wtai.exe] Dispatched Microsoft Intelligent Terminal workspace command with acpModel=gemini-4-neon, autoFixEnabled=true, yoloMode=true.',
      'term-ok'
    );
    markChapterDone(1);
    markChapterDone(4);
  } else if (/(Select-Object\s+-First|head\s+-n|Get-FileHash|sha256|rg\b|Select-String)/i.test(cmd)) {
    appendTerminalLine(
      '[Stage-0] Bounded deterministic slice produced (<160 lines, SHA-256 checksum ready). Token drag eliminated before hitting frontier LLM.',
      'term-ok'
    );
  } else if (/\bcodex\b/i.test(cmd)) {
    appendTerminalLine('[codex] Auth: Logged in using ChatGPT · Profile approval: never.', 'term-ok');
  } else {
    appendTerminalLine(
      `Simulated shell receipt for "${cmd}". Try "help", "probe overview", or complete any Chapter 2 drill.`,
      'term-muted'
    );
  }

  evaluateDrillCommand(cmd);
}

/* ==================== Chapter Renderers ==================== */

function renderChapter0() {
  const isTerminal = state.viewContrast === 'terminal';
  return `
    <section class="hero-panel">
      <div class="eyebrow">Chapter 00 · Opening Payoff</div>
      <h1 class="hero-title">What the Terminal Affords You Immediately</h1>
      <p class="hero-lead">
        Before touching a single flag, start with the outcome: in the terminal, you stop clicking through disconnected UI windows and gain composable, scriptable, parallel control over your entire machine, Android devices, and frontier AI models.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" data-action="open-sandbox" data-cmd="agy --dangerously-skip-permissions --model gemini-4-neon-xhigh">Try Unsandboxed Launch in Sandbox</button>
        <button type="button" class="btn" data-action="go-chapter" data-chapter="1">Next: Inside Intelligent Terminal</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Interactive Payoff Contrast: Browser/GUI Clicking vs. Sovereign Terminal</h2>
          <p class="panel-subtitle">Toggle between modes to compare what happens on a real multi-file + Android/PC engineering task.</p>
        </div>
        <div class="pill-row">
          <button type="button" class="pill-btn ${!isTerminal ? 'is-active' : ''}" data-contrast="gui">GUI Point-and-Click</button>
          <button type="button" class="pill-btn ${isTerminal ? 'is-active' : ''}" data-contrast="terminal">Terminal-First Leverage</button>
        </div>
      </div>

      <div class="cards-grid-2">
        ${
          isTerminal
            ? `
          <article class="card">
            <span class="badge badge-verified">1-Keystroke Parallelism</span>
            <h3 class="card-title">4 Isolated Agents Running Simultaneously</h3>
            <p class="card-body">Spawn dedicated <code>git worktree</code> branches in side-by-side Microsoft Intelligent Terminal panes via <code>wtai.exe</code>. Antigravity, Codex, and local tests never overwrite each other.</p>
          </article>
          <article class="card">
            <span class="badge badge-accent">Token &amp; Latency Economics</span>
            <h3 class="card-title">Stage-0 Pre-Compensation Cuts Waste 10x</h3>
            <p class="card-body">Filter logs with <code>Select-String</code> / <code>rg</code>, slice to 160 lines, and hash unchanged artifacts locally before sending a single token to <code>gemini-4-neon-xhigh</code>.</p>
          </article>
          <article class="card">
            <span class="badge badge-verified">Zero-Friction Local &amp; Android Bridge</span>
            <h3 class="card-title">Direct PC + ADB + Cloud Pipeline</h3>
            <p class="card-body">Inspect Windows processes, test <code>adb</code> Android Developer Previews, and query Google Cloud/GitHub from one reproducible pipeline that runs anywhere.</p>
          </article>
          <article class="card">
            <span class="badge badge-amber">Deterministic Receipts</span>
            <h3 class="card-title">Verifiable Proof Over "It Looks Fine"</h3>
            <p class="card-body">Every workflow ends with a real exit code, JSON assertion, or SHA-256 parity check logged straight to your vault.</p>
          </article>`
            : `
          <article class="card">
            <span class="badge badge-coral">Manual Bottleneck</span>
            <h3 class="card-title">One Chat Tab at a Time</h3>
            <p class="card-body">Copy-pasting snippets between a browser window, file explorer, and IDE loses working directory context and burns minutes on every cycle.</p>
          </article>
          <article class="card">
            <span class="badge badge-coral">Context Bloat</span>
            <h3 class="card-title">Uploading Whole Files Repeatedly</h3>
            <p class="card-body">Pasting full 2,000-line logs into web chat forces frontier reasoning to dig through noise you could strip locally in 40 milliseconds.</p>
          </article>
          <article class="card">
            <span class="badge badge-amber">Fragile Memory</span>
            <h3 class="card-title">No Reproducible Command Trail</h3>
            <p class="card-body">UI clicks vanish once a modal closes. Terminal invocations can be saved, chained, bound to hardware keys, and re-run identically.</p>
          </article>
          <article class="card">
            <span class="badge badge-amber">Shallow Device Reach</span>
            <h3 class="card-title">Disconnected PC &amp; Android Workflows</h3>
            <p class="card-body">Checking Android AICore/Beta state or Windows Terminal hooks requires digging through nested Settings menus instead of one query.</p>
          </article>`
        }
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Micro-Lab 00: Run Your First Unsandboxed Command</h2>
          <p class="panel-subtitle">Click below to execute a real-syntax unsandboxed launch inside the Practice Sandbox and earn Chapter 00 mastery.</p>
        </div>
        <button type="button" class="btn btn-verified" data-action="mark-done" data-chapter="0">Mark Chapter Complete</button>
      </div>
      <div class="code-toolbar">
        <span class="code-label">PowerShell · Unsandboxed Default + Zero Permission Prompts</span>
        <button type="button" class="btn btn-xs" data-copy="agy --dangerously-skip-permissions --model gemini-4-neon-xhigh">Copy Command</button>
      </div>
      <pre class="code-box">agy --dangerously-skip-permissions --model gemini-4-neon-xhigh</pre>
    </section>
  `;
}

function renderChapter1() {
  const activeChord = CHORDS.find((c) => c.id === state.selectedChordId) || CHORDS[0];
  const overview = state.hostProbe?.overview;
  const hooks = state.hostProbe?.hooks;
  const prompts = state.hostProbe?.prompts;

  return `
    <section class="hero-panel">
      <div class="eyebrow">Chapter 01 · Your Active Terminal Cockpit</div>
      <h1 class="hero-title">Inside Microsoft Intelligent Terminal (<span class="mono">wtai.exe</span>)</h1>
      <p class="hero-lead">
        Your terminal is already wired with <strong>Google Antigravity</strong> as the default profile (<span class="mono">gemini-4-neon-xhigh</span>), <span class="mono">acpModel: gemini-4-neon</span>, <span class="mono">autoFixEnabled: true</span>, <span class="mono">yoloMode: true</span>, and the <strong>Fuzziness &amp; Emboldened Autonomy Protocol</strong> injected into both agent prompts.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" data-action="probe" data-target="overview">Probe Live Overview</button>
        <button type="button" class="btn" data-action="probe" data-target="hooks">Probe WTA Hooks</button>
        <button type="button" class="btn" data-action="probe" data-target="prompts">Verify Prompt Invariants</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Interactive Keybinding Dojo</h2>
          <p class="panel-subtitle">Click any chord to see how Microsoft Intelligent Terminal morphs your workspace without leaving the keyboard.</p>
        </div>
        <span class="badge badge-accent">${escapeHtml(activeChord.action)}</span>
      </div>

      <div class="dojo-grid">
        <div class="chord-list">
          ${CHORDS.map(
            (c) => `
            <button type="button" class="chord-btn ${c.id === activeChord.id ? 'is-active' : ''}" data-chord="${escapeHtml(c.id)}">
              <span>
                <strong>${escapeHtml(c.action)}</strong><br>
                <span style="font-size:0.76rem;color:var(--text-muted)">${escapeHtml(c.summary)}</span>
              </span>
              <span class="kbd">${escapeHtml(c.keys)}</span>
            </button>`
          ).join('')}
        </div>

        <div class="wt-mockup" aria-label="Intelligent Terminal Pane Simulator">
          <div class="wt-mock-titlebar">
            <span>wtai.exe · Google Antigravity (${escapeHtml(activeChord.keys)})</span>
            <span class="mono" style="color:#30d158">acpModel: gemini-4-neon</span>
          </div>
          <div class="wt-mock-body ${activeChord.sidebarOpen ? '' : 'no-sidebar'}">
            ${
              activeChord.sidebarOpen
                ? `<div class="wt-mock-sidebar">
                    <div style="color:#f8fafc;font-weight:600">Agents</div>
                    <div>• Antigravity</div>
                    <div>• Codex</div>
                    <div>• Claude</div>
                    <div>• Gemini</div>
                    <div style="margin-top:auto;color:#60a5fa">Recent Sessions</div>
                  </div>`
                : ''
            }
            <div class="wt-mock-main">
              <div style="display:grid;grid-template-columns:repeat(${activeChord.splitCount},minmax(0,1fr));gap:8px;flex:1;">
                <div class="wt-pane-box">
                  <div style="color:#60a5fa">PS %USERPROFILE%&gt;</div>
                  <div style="margin-top:6px;color:#cbd5e1">${
                    activeChord.autofix
                      ? 'gti status -> Auto-Fix intercepted failing buffer & proposed: git status'
                      : 'Active Shell Pane (Fuzziness + Emboldened Autonomy Ready)'
                  }</div>
                </div>
                ${
                  activeChord.splitCount > 1
                    ? `<div class="wt-pane-box">
                        <div style="color:#30d158">Delegated Split Workspace</div>
                        <div style="margin-top:6px;color:#cbd5e1">Isolated branch / side-by-side watcher running in parallel.</div>
                      </div>`
                    : ''
                }
              </div>
              ${
                activeChord.paneOpen
                  ? `<div class="wt-agent-pane">
                      <strong style="color:#30d158">Agent Pane (Bottom Dock · yoloMode=true)</strong>
                      <div style="margin-top:4px;color:#cbd5e1">${escapeHtml(activeChord.summary)}</div>
                    </div>`
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Live Machine Probe Output</h2>
          <p class="panel-subtitle">Real read-only diagnostics collected straight from 127.0.0.1 without touching configs.</p>
        </div>
        <button type="button" class="btn btn-verified" data-action="mark-done" data-chapter="1">Mark Chapter Complete</button>
      </div>
      <div class="cards-grid-3">
        <article class="card">
          <h3 class="card-title">Intelligent Terminal State</h3>
          <pre class="code-box">${escapeHtml(
            overview
              ? JSON.stringify(overview.intelligentTerminal, null, 2)
              : 'Click "Probe Live Overview" above to inspect live LocalState/settings.json.'
          )}</pre>
        </article>
        <article class="card">
          <h3 class="card-title">CLI Hook Bridge (<span class="mono">wta hooks</span>)</h3>
          <pre class="code-box">${escapeHtml(
            hooks
              ? JSON.stringify(hooks, null, 2)
              : 'Click "Probe WTA Hooks" above to inspect antigravity/claude/codex/gemini hooks.'
          )}</pre>
        </article>
        <article class="card">
          <h3 class="card-title">Prompt &amp; Marker Integrity</h3>
          <pre class="code-box">${escapeHtml(
            prompts
              ? JSON.stringify(prompts, null, 2)
              : 'Click "Verify Prompt Invariants" above to check terminal-agent.md & auto-fix.md.'
          )}</pre>
        </article>
      </div>
    </section>
  `;
}

function renderChapter2() {
  const stages = [
    {
      name: '1. Discover (rg / Get-ChildItem)',
      cmd: 'rg -n "acpModel|autoFixEnabled" "%LOCALAPPDATA%\\Packages\\Microsoft.IntelligentTerminal_8wekyb3d8bbwe\\LocalState\\settings.json"',
      why: 'Never read an entire 1,000-line file when a 5ms regex jump pinpoints exact line numbers.'
    },
    {
      name: '2. Slice (<=160 Lines)',
      cmd: 'git diff --unified=3 | Select-Object -First 160',
      why: 'Bounds context strictly before sending anything to a reasoning model, keeping cache hit rates high.'
    },
    {
      name: '3. Hash / Verify (SHA-256 Parity)',
      cmd: 'Get-FileHash ".\\LocalState\\settings.json" -Algorithm SHA256',
      why: 'Deterministic proof lets you skip re-reading unchanged files across agent turns.'
    },
    {
      name: '4. Pipe to Frontier Model (agy -p)',
      cmd: 'git diff | Select-Object -First 160 | agy --model gemini-4-neon-high -p "Audit this diff for regressions"',
      why: 'Hands Stage-Apex clean, distilled signal instead of raw terminal bloat.'
    }
  ];
  const activeStage = stages[state.pipelineStage] || stages[0];

  return `
    <section class="hero-panel">
      <div class="eyebrow">Chapter 02 · Mental Model &amp; Hands-On Drills</div>
      <h1 class="hero-title">The Terminal Way of Doing: Compose, Slice, Hash, Pipe</h1>
      <p class="hero-lead">
        GUI apps force you into monolithic exports. The terminal turns every task into a crisp 4-stage pipeline: locate locally, slice deterministically, verify cryptographically, and pipe only signal into your frontier model.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" data-action="open-sandbox" data-cmd="git diff | Select-Object -First 160">Open Sandbox for Drills</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Stage-0 to Stage-Apex Pipeline Explorer</h2>
          <p class="panel-subtitle">Step through the 4 stages of high-leverage terminal composition.</p>
        </div>
        <div class="pill-row">
          ${stages
            .map(
              (s, idx) =>
                `<button type="button" class="pill-btn ${state.pipelineStage === idx ? 'is-active' : ''}" data-stage="${idx}">Stage ${idx + 1}</button>`
            )
            .join('')}
        </div>
      </div>
      <article class="card">
        <h3 class="card-title">${escapeHtml(activeStage.name)}</h3>
        <p class="card-body">${escapeHtml(activeStage.why)}</p>
        <div class="code-toolbar">
          <span class="code-label">PowerShell Pipeline</span>
          <button type="button" class="btn btn-xs" data-copy="${escapeHtml(activeStage.cmd)}">Copy</button>
        </div>
        <pre class="code-box">${escapeHtml(activeStage.cmd)}</pre>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">4 Verified Interactive Drills (${state.solvedDrills.size} / 4 Solved)</h2>
          <p class="panel-subtitle">Click "Load in Sandbox" or type the command directly in the Sandbox Shell below to verify each skill.</p>
        </div>
        <button type="button" class="btn btn-verified" data-action="mark-done" data-chapter="2">Mark Chapter Complete</button>
      </div>

      <div class="cards-grid-2">
        ${DRILLS.map((drill) => {
          const solved = state.solvedDrills.has(drill.id);
          return `
            <article class="drill-card ${solved ? 'is-solved' : ''}">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <h3 class="card-title">${escapeHtml(drill.title)}</h3>
                <span class="badge ${solved ? 'badge-verified' : 'badge-amber'}">${solved ? 'Verified' : 'Pending'}</span>
              </div>
              <p class="card-body">${escapeHtml(drill.prompt)}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
                <button type="button" class="btn btn-sm btn-primary" data-action="open-sandbox" data-cmd="${escapeHtml(drill.hint)}">Load in Sandbox</button>
                <button type="button" class="btn btn-sm" data-copy="${escapeHtml(drill.hint)}">Copy Hint</button>
              </div>
            </article>`;
        }).join('')}
      </div>
    </section>
  `;
}

function buildForgeCommand() {
  const { agent, mode, model, output, promptText } = state.forge;
  const escapedPrompt = (promptText || 'Audit workspace').replace(/"/g, '\\"');
  if (agent === 'agy') {
    const modeFlag =
      mode === 'unsandboxed'
        ? '--dangerously-skip-permissions'
        : mode === 'auto'
        ? '--mode auto'
        : mode === 'plan'
        ? '--mode plan'
        : '--sandbox';
    const outFlag =
      output === 'print'
        ? `-p "${escapedPrompt}"`
        : output === 'stream'
        ? `-p "${escapedPrompt}" --output-format stream-json`
        : '';
    return `agy ${modeFlag} --model ${model} ${outFlag}`.trim().replace(/\s+/g, ' ');
  }
  if (agent === 'codex') {
    const execMode = mode === 'plan' ? '-s read-only' : '--ask-for-approval never';
    return output === 'interactive'
      ? `codex ${execMode}`
      : `codex exec ${execMode} "${escapedPrompt}"`;
  }
  if (agent === 'claude') {
    const perm = mode === 'unsandboxed' || mode === 'auto' ? '--permission-mode bypassPermissions' : '--permission-mode plan';
    return output === 'interactive'
      ? `claude ${perm}`
      : `claude ${perm} -p "${escapedPrompt}" --max-turns 5`;
  }
  const gemMode = mode === 'plan' ? '--approval-mode plan' : '--yolo';
  return output === 'interactive' ? `gemini ${gemMode}` : `gemini ${gemMode} -p "${escapedPrompt}"`;
}

function renderChapter3() {
  const generatedCmd = buildForgeCommand();
  const wtaiCmd = `wtai.exe new-tab -p "Google Antigravity" -- ${generatedCmd}`;
  const authProbe = state.hostProbe?.auth;
  const modelsProbe = state.hostProbe?.models;

  return `
    <section class="hero-panel">
      <div class="eyebrow">Chapter 03 · Agentic CLI Forge &amp; Live Auth Status</div>
      <h1 class="hero-title">Command Every AI CLI on Your Machine</h1>
      <p class="hero-lead">
        Antigravity is already unsandboxed by default. Use the interactive Forge below to assemble exact flags for <code>agy</code>, <code>codex</code>, <code>claude</code>, and <code>gemini</code>—or launch straight into a new Intelligent Terminal tab.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" data-action="probe" data-target="auth">Probe Live Auth Status</button>
        <button type="button" class="btn" data-action="probe" data-target="models">Probe Available Antigravity Models</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Interactive Agentic Command Forge</h2>
          <p class="panel-subtitle">Choose agent, sandbox/permission mode, model tier, and output mode.</p>
        </div>
        <button type="button" class="btn btn-verified" data-action="mark-done" data-chapter="3">Mark Chapter Complete</button>
      </div>

      <div class="control-grid">
        <div class="field">
          <label for="forge-agent">Agent CLI</label>
          <select id="forge-agent">
            <option value="agy" ${state.forge.agent === 'agy' ? 'selected' : ''}>Google Antigravity (agy)</option>
            <option value="codex" ${state.forge.agent === 'codex' ? 'selected' : ''}>OpenAI Codex (codex)</option>
            <option value="claude" ${state.forge.agent === 'claude' ? 'selected' : ''}>Anthropic Claude Code (claude)</option>
            <option value="gemini" ${state.forge.agent === 'gemini' ? 'selected' : ''}>Google Gemini CLI (gemini)</option>
          </select>
        </div>
        <div class="field">
          <label for="forge-mode">Execution &amp; Sandbox Mode</label>
          <select id="forge-mode">
            <option value="unsandboxed" ${state.forge.mode === 'unsandboxed' ? 'selected' : ''}>Unsandboxed · Zero Prompts</option>
            <option value="auto" ${state.forge.mode === 'auto' ? 'selected' : ''}>Unsandboxed · Auto Mode</option>
            <option value="plan" ${state.forge.mode === 'plan' ? 'selected' : ''}>Read-Only / Plan Mode</option>
            <option value="sandbox" ${state.forge.mode === 'sandbox' ? 'selected' : ''}>Sandboxed (--sandbox)</option>
          </select>
        </div>
        <div class="field">
          <label for="forge-model">Antigravity Model Tier</label>
          <select id="forge-model">
            <option value="gemini-4-neon-xhigh" ${state.forge.model === 'gemini-4-neon-xhigh' ? 'selected' : ''}>gemini-4-neon-xhigh (Frontier Max)</option>
            <option value="gemini-4-neon-high" ${state.forge.model === 'gemini-4-neon-high' ? 'selected' : ''}>gemini-4-neon-high</option>
            <option value="gemini-4-carbon-high" ${state.forge.model === 'gemini-4-carbon-high' ? 'selected' : ''}>gemini-4-carbon-high</option>
            <option value="gemini-4-hydrogen-xhigh" ${state.forge.model === 'gemini-4-hydrogen-xhigh' ? 'selected' : ''}>gemini-4-hydrogen-xhigh</option>
            <option value="gemini-4-argon-high" ${state.forge.model === 'gemini-4-argon-high' ? 'selected' : ''}>gemini-4-argon-high</option>
          </select>
        </div>
        <div class="field">
          <label for="forge-output">Session Style</label>
          <select id="forge-output">
            <option value="interactive" ${state.forge.output === 'interactive' ? 'selected' : ''}>Interactive TUI</option>
            <option value="print" ${state.forge.output === 'print' ? 'selected' : ''}>Single-Turn Print (-p)</option>
            <option value="stream" ${state.forge.output === 'stream' ? 'selected' : ''}>Stream NDJSON (--output-format stream-json)</option>
          </select>
        </div>
      </div>

      <div class="field" style="margin-top:12px;">
        <label for="forge-prompt">Prompt (used for Print / Stream JSON modes)</label>
        <input id="forge-prompt" type="text" value="${escapeHtml(state.forge.promptText)}">
      </div>

      <div style="margin-top:14px;">
        <div class="code-toolbar">
          <span class="code-label">Direct CLI Invocation</span>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-xs" data-copy="${escapeHtml(generatedCmd)}">Copy CLI</button>
            <button type="button" class="btn btn-xs btn-primary" data-action="open-sandbox" data-cmd="${escapeHtml(generatedCmd)}">Test in Sandbox</button>
          </div>
        </div>
        <pre class="code-box">${escapeHtml(generatedCmd)}</pre>
      </div>

      <div style="margin-top:12px;">
        <div class="code-toolbar">
          <span class="code-label">Launch Inside New Microsoft Intelligent Terminal Tab</span>
          <button type="button" class="btn btn-xs" data-copy="${escapeHtml(wtaiCmd)}">Copy wtai Tab Command</button>
        </div>
        <pre class="code-box">${escapeHtml(wtaiCmd)}</pre>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">4-Profile Health Matrix</h2>
          <p class="panel-subtitle">Exact verified status of every agent profile configured in Microsoft Intelligent Terminal.</p>
        </div>
      </div>
      <div class="cards-grid-2">
        <article class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 class="card-title">Google Antigravity (<span class="mono">agy</span>)</h3>
            <span class="badge badge-verified">Operational · 401 Fixed</span>
          </div>
          <p class="card-body"><code>modelProvider</code> conflict removed; ACP handshake verified (<code>v1.4.0</code>); default profile running <code>gemini-4-neon-xhigh</code> unsandboxed.</p>
        </article>
        <article class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 class="card-title">OpenAI Codex (<span class="mono">codex</span>)</h3>
            <span class="badge badge-verified">Logged In</span>
          </div>
          <p class="card-body">Authenticated via ChatGPT subscription; Intelligent Terminal profile wired with <code>permissionMode: "never"</code>.</p>
        </article>
        <article class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 class="card-title">Claude Code (<span class="mono">claude</span>)</h3>
            <span class="badge badge-amber">Subscription Billing Gate</span>
          </div>
          <p class="card-body">Profile wired with <code>bypassPermissions</code>; live check reported past-due Claude subscription billing (or supply <code>ANTHROPIC_API_KEY</code>).</p>
        </article>
        <article class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 class="card-title">Gemini CLI (<span class="mono">gemini</span>)</h3>
            <span class="badge badge-coral">401 Key / OAuth Needed</span>
          </div>
          <p class="card-body">Profile wired with <code>yolo</code> and experimental flags; standalone <code>gemini</code> needs an <code>AIza...</code> key or interactive <code>/auth</code> OAuth sign-in.</p>
        </article>
      </div>
      ${
        authProbe || modelsProbe
          ? `<pre class="code-box" style="margin-top:12px;">${escapeHtml(
              JSON.stringify({ auth: authProbe, models: modelsProbe }, null, 2)
            )}</pre>`
          : ''
      }
    </section>
  `;
}

function buildMultiPaneScript() {
  const worktreeLines = state.panes
    .filter((p) => p.branch !== 'main')
    .map((p) => `git worktree add "${p.dir}" -b "${p.branch}"`);
  const wtParts = state.panes.map((p, idx) =>
    idx === 0
      ? `wtai.exe -w 0 new-tab -p "${p.profile}" -d "${p.dir}"`
      : `split-pane -H -p "${p.profile}" -d "${p.dir}"`
  );
  return [
    '# ==============================================================================',
    '# LABEL:               Spawn Parallel Multi-Agent Worktree Workspace',
    '# USE:                 Launch isolated git worktrees side-by-side in Microsoft Intelligent Terminal.',
    '# MECHANISM_OF_ACTION: Targets PowerShell; creates non-main git worktree branches if missing, then opens split panes in wtai.exe.',
    '# ==============================================================================',
    ...worktreeLines,
    wtParts.join(' `; ')
  ].join('\n');
}

function renderChapter4() {
  const script = buildMultiPaneScript();
  return `
    <section class="hero-panel">
      <div class="eyebrow">Chapter 04 · Multi-Pane Orchestration &amp; Worktrees</div>
      <h1 class="hero-title">Parallel Agent Swarms Without Branch Collisions</h1>
      <p class="hero-lead">
        Never let two autonomous agents edit the same working tree simultaneously. Pair <code>git worktree</code> isolation with Microsoft Intelligent Terminal split panes—and bind physical Razer/hardware macros to one-button dispatch.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" data-action="add-pane">Add Split Worker Pane</button>
        <button type="button" class="btn" data-action="reset-panes">Reset Layout</button>
        <button type="button" class="btn btn-verified" data-action="mark-done" data-chapter="4">Mark Chapter Complete</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Interactive Split-Pane &amp; Worktree Builder</h2>
          <p class="panel-subtitle">Add or customize panes to generate an Aether-standard PowerShell launcher script.</p>
        </div>
      </div>

      <div class="pane-canvas">
        ${state.panes
          .map(
            (p) => `
          <div class="sim-pane">
            <div class="sim-pane-head">
              <span>${escapeHtml(p.title)}</span>
              ${
                state.panes.length > 1
                  ? `<button type="button" class="btn btn-xs" data-remove-pane="${p.id}">Close</button>`
                  : ''
              }
            </div>
            <div class="field">
              <label>Profile</label>
              <select data-pane-profile="${p.id}">
                <option value="Google Antigravity" ${p.profile === 'Google Antigravity' ? 'selected' : ''}>Google Antigravity</option>
                <option value="Codex" ${p.profile === 'Codex' ? 'selected' : ''}>Codex</option>
                <option value="Claude" ${p.profile === 'Claude' ? 'selected' : ''}>Claude</option>
                <option value="PowerShell" ${p.profile === 'PowerShell' ? 'selected' : ''}>PowerShell</option>
              </select>
            </div>
            <div style="font-size:0.75rem;color:#94a3b8;">Branch: <code style="color:#30d158">${escapeHtml(p.branch)}</code> · Dir: <code>${escapeHtml(p.dir)}</code></div>
          </div>`
          )
          .join('')}
      </div>

      <div style="margin-top:14px;">
        <div class="code-toolbar">
          <span class="code-label">Generated Multi-Pane PowerShell Launcher (Aether Command Standard)</span>
          <button type="button" class="btn btn-xs btn-primary" data-copy="${escapeHtml(script)}">Copy Launcher Script</button>
        </div>
        <pre class="code-box">${escapeHtml(script)}</pre>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Hardware Macro Bridge (<span class="mono">C:\\Aether\\macros</span>)</h2>
          <p class="panel-subtitle">Your 6 installed VBS shims connect physical mouse/keyboard chords straight into Stage-0 agent packets.</p>
        </div>
      </div>
      <div class="cards-grid-3">
        <article class="card">
          <span class="badge badge-accent">M1 Plan Spec</span>
          <h3 class="card-title">Clipboard <=160-Line Packet</h3>
          <p class="card-body">Hashes clipboard input via SHA-256 and wraps a Flash-shunted KPPC planning packet ready for Antigravity or Terminal Agent Pane.</p>
        </article>
        <article class="card">
          <span class="badge badge-verified">M3 Worktree Spawn</span>
          <h3 class="card-title">One-Button Worktree Shell</h3>
          <p class="card-body">Creates a branch-scoped worktree with <code>AETHER_FLASH_SHUNT=1</code> and boots a fresh terminal session automatically.</p>
        </article>
        <article class="card">
          <span class="badge badge-amber">M4 Adversarial Review</span>
          <h3 class="card-title">Zero-Rubber-Stamp Diff Gate</h3>
          <p class="card-body">Captures live <code>git diff --unified=3</code> and wraps it in a staff security &amp; edge-case audit rubric.</p>
        </article>
      </div>
    </section>
  `;
}

function buildAdvocacyDossier() {
  const milestoneMap = {
    'acp-orchestration':
      '- **Microsoft Intelligent Terminal + ACP Multi-Agent Harness:** Configured and verified native `agy_acp_server` + `wta` multi-provider orchestration (`antigravity`, `claude`, `codex`, `gemini`) with `gemini-4-neon-xhigh`, custom `Fuzziness & Emboldened Autonomy` agent prompts, and live JSON/process telemetry.',
    'stage0-efficiency':
      '- **Stage-0 Deterministic Token Pre-Compensation & Cache Discipline:** Built local SHA-256 read deduplication, bounded 160-line AST/diff slicing, and Flash-shunted frontier routing (`AETHER_FLASH_SHUNT=1`) achieving >93% cache read reuse across multi-agent development workflows.',
    'android-edge':
      '- **PC + Android Cross-Surface Builder Workflows:** Architected companion Android applications (`aether-mobile-app`), on-device AI Edge/AICore experiments, and cross-platform CLI + mobile developer tooling.',
    'hid-control':
      '- **Low-Latency 250 Hz USB HID & Control Theory Engineering:** Authored custom C++/Windows XInput & DualSense 6-axis gyro steering/haptic proxies featuring Casiez 1-Euro adaptive filtering, Ken Perlin C2 smootherstep transitions, and cryptographic SHA-256 deployment parity.'
  };
  const selected = [...state.dossierMilestones].map((k) => milestoneMap[k]).filter(Boolean);

  return [
    `# Developer Early-Access & Recognition Brief — ${state.dossierTrack}`,
    `Author / Operator: **Eloquent** (\`@mjeanhudson-dev\`)`,
    `GitHub Hub: https://github.com/mjeanhudson-dev`,
    ``,
    `## Focus & Advocacy Request`,
    `Applying for early-access, preview/alpha channel participation, and developer recognition under **${state.dossierTrack}** across PC and Android developer ecosystems.`,
    ``,
    `## Verified Engineering Proof Points`,
    ...(selected.length ? selected : ['- Full-stack PC & Android systems builder using Gemini, Antigravity CLI, and Windows Terminal.']),
    ``,
    `## Feedback & Telemetry Commitment`,
    `- Supply reproducible bug reports, exact CLI/protocol logs, SHA-256 verified test cases, and real-world Windows 11 + Android hardware telemetry.`
  ].join('\n');
}

function renderChapter5() {
  const filteredPortals = PORTALS.filter((p) => {
    const platOk = state.portalPlatform === 'All' || p.platform === state.portalPlatform;
    const chanOk = state.portalChannel === 'All' || p.channel === state.portalChannel;
    return platOk && chanOk;
  });
  const dossierText = buildAdvocacyDossier();

  return `
    <section class="hero-panel">
      <div class="eyebrow">Chapter 05 · Closing Payoff &amp; Sovereign Portals Vault</div>
      <h1 class="hero-title">What Terminal Mastery Unlocks — Plus Verified PC &amp; Android Access Portals</h1>
      <p class="hero-lead">
        Ending where we began: once you internalize the terminal workflow, you control local silicon, multi-agent reasoning, and Android devices from a single reproducible cockpit. Below are the verified official PC and Android beta, alpha/canary, preview, and developer recognition portals—with clear access labels and zero fabricated links.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-verified" data-action="mark-done" data-chapter="5">Complete Final Chapter</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Closing Payoff: Full-Spectrum End-User Affordances</h2>
          <p class="panel-subtitle">Everything you can now execute directly from Microsoft Intelligent Terminal.</p>
        </div>
      </div>
      <div class="cards-grid-3">
        <article class="card">
          <span class="badge badge-verified">PC &amp; Cloud Autonomy</span>
          <h3 class="card-title">Instant Unsandboxed Execution</h3>
          <p class="card-body">Launch <code>agy --dangerously-skip-permissions --model gemini-4-neon-xhigh</code> or split parallel <code>git worktree</code> agents in one keystroke.</p>
        </article>
        <article class="card">
          <span class="badge badge-accent">Android + Edge Reach</span>
          <h3 class="card-title">Direct Device &amp; Preview Tooling</h3>
          <p class="card-body">Inspect connected Android hardware via <code>adb</code>, deploy pre-release APKs via Firebase App Distribution, and prototype on-device AICore / AI Edge models.</p>
        </article>
        <article class="card">
          <span class="badge badge-amber">Dev Recognition Leverage</span>
          <h3 class="card-title">Proof-Backed Advocacy Dossiers</h3>
          <p class="card-body">Export concrete, redacted engineering artifacts under <strong>Eloquent (@mjeanhudson-dev)</strong> to enroll in official Early Access and Developer Programs.</p>
        </article>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Verified Sovereign &amp; Official Beta/Alpha Portals (PC &amp; Android)</h2>
          <p class="panel-subtitle">Private invite-only partner tracks do not have public bypass URLs; every portal below is an official verified entry point, download, or enrollment hub.</p>
        </div>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;margin-bottom:14px;">
        <div class="pill-row">
          ${['All', 'PC', 'Android']
            .map(
              (plat) =>
                `<button type="button" class="pill-btn ${state.portalPlatform === plat ? 'is-active' : ''}" data-portal-platform="${plat}">${plat}</button>`
            )
            .join('')}
        </div>
        <div class="pill-row">
          ${['All', 'Early Access / Labs', 'Alpha / Canary', 'Beta / Store', 'CLI Releases', 'Dev Recognition']
            .map(
              (ch) =>
                `<button type="button" class="pill-btn ${state.portalChannel === ch ? 'is-active' : ''}" data-portal-channel="${escapeHtml(ch)}">${escapeHtml(ch)}</button>`
            )
            .join('')}
        </div>
      </div>

      <div class="cards-grid-2">
        ${filteredPortals
          .map(
            (p) => `
          <article class="portal-card">
            <div>
              <div class="portal-badges">
                <span class="badge badge-accent">${escapeHtml(p.platform)}</span>
                <span class="badge badge-verified">${escapeHtml(p.channel)}</span>
                <span class="badge">${escapeHtml(p.accessType)}</span>
              </div>
              <h3 class="card-title" style="margin-top:8px;">${escapeHtml(p.name)}</h3>
              <p class="card-body" style="margin-top:4px;">${escapeHtml(p.description)}</p>
            </div>
            <div>
              <div class="code-toolbar">
                <span class="code-label">Terminal / ADB Quick Command</span>
                <button type="button" class="btn btn-xs" data-copy="${escapeHtml(p.command)}">Copy Cmd</button>
              </div>
              <pre class="code-box">${escapeHtml(p.command)}</pre>
              <div class="portal-footer" style="margin-top:10px;">
                <a class="btn btn-sm btn-primary" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">Open Primary Portal</a>
                <a class="btn btn-sm" href="${escapeHtml(p.secondaryUrl)}" target="_blank" rel="noopener noreferrer">Secondary Link</a>
              </div>
            </div>
          </article>`
          )
          .join('')}
      </div>

      <div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:8px;">
        ${EXTRA_PORTAL_LINKS.map(
          (l) =>
            `<a class="btn btn-xs" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
        ).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Eloquent Dev Recognition &amp; Early-Access Advocacy Kit</h2>
          <p class="panel-subtitle">Generate a clean, redacted engineering proof dossier (zero OS username leakage) for official Google Developer Program, Cloud Startup, or Early Access applications.</p>
        </div>
        <button type="button" class="btn btn-primary" data-copy="${escapeHtml(dossierText)}">Copy Advocacy Brief</button>
      </div>

      <div class="control-grid" style="margin-bottom:12px;">
        <div class="field">
          <label for="dossier-track">Target Recognition / Channel Track</label>
          <select id="dossier-track">
            <option value="Google Developer Program & Early Access" ${state.dossierTrack === 'Google Developer Program & Early Access' ? 'selected' : ''}>Google Developer Program &amp; Early Access</option>
            <option value="Google Cloud Startup & Innovators AI Grant" ${state.dossierTrack === 'Google Cloud Startup & Innovators AI Grant' ? 'selected' : ''}>Google Cloud Startup &amp; Innovators AI Grant</option>
            <option value="Chrome AI Early Preview Program (EPP)" ${state.dossierTrack === 'Chrome AI Early Preview Program (EPP)' ? 'selected' : ''}>Chrome AI Early Preview Program (EPP)</option>
            <option value="Google AI Edge & Android AICore Developer Preview" ${state.dossierTrack === 'Google AI Edge & Android AICore Developer Preview' ? 'selected' : ''}>Google AI Edge &amp; Android AICore Preview</option>
          </select>
        </div>
      </div>

      <div class="pill-row" style="margin-bottom:12px;">
        ${[
          ['acp-orchestration', 'Intelligent Terminal + ACP Harness'],
          ['stage0-efficiency', 'Stage-0 Token & Cache Efficiency'],
          ['android-edge', 'PC + Android Cross-Surface Builds'],
          ['hid-control', '250 Hz DualSense HID & C2 Control']
        ]
          .map(
            ([id, label]) =>
              `<button type="button" class="pill-btn ${state.dossierMilestones.has(id) ? 'is-active' : ''}" data-milestone="${id}">${escapeHtml(label)}</button>`
          )
          .join('')}
      </div>

      <pre class="code-box">${escapeHtml(dossierText)}</pre>
    </section>
  `;
}

function renderNavAndProgress() {
  const nav = document.getElementById('chapter-nav');
  if (nav) {
    nav.innerHTML = CHAPTERS.map((ch) => {
      const active = state.chapter === ch.id;
      const done = state.completedChapters.has(ch.id);
      return `
        <button type="button" class="chapter-btn ${active ? 'is-active' : ''}" data-chapter="${ch.id}">
          <span>
            <span class="chapter-num">${escapeHtml(ch.num)}</span>
            <span class="chapter-name">${escapeHtml(ch.name)}</span>
            <span class="chapter-tag">${escapeHtml(ch.tag)}</span>
          </span>
          <span class="chapter-check ${done ? 'is-done' : ''}" aria-label="${done ? 'Completed' : 'Incomplete'}">
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2.5 6.2l2.2 2.3 4.8-5"/>
            </svg>
          </span>
        </button>`;
    }).join('');
  }

  const count = state.completedChapters.size;
  const pct = Math.round((count / CHAPTERS.length) * 100);
  const scoreEl = document.getElementById('mastery-score');
  const fillEl = document.getElementById('mastery-fill');
  if (scoreEl) scoreEl.textContent = `${count} / ${CHAPTERS.length} Chapters`;
  if (fillEl) fillEl.style.width = `${pct}%`;
}

function renderSandboxPresets() {
  const presetsEl = document.getElementById('sandbox-presets');
  if (!presetsEl) return;
  const presetsByChapter = {
    0: ['agy --dangerously-skip-permissions --model gemini-4-neon-xhigh', 'probe overview', 'help'],
    1: ['wta hooks status --json', 'probe prompts', 'wtai.exe new-tab -p "Google Antigravity"'],
    2: [
      'agy --dangerously-skip-permissions --model gemini-4-neon-xhigh',
      'git diff | Select-Object -First 160',
      'wta hooks status --json',
      'git worktree add ../wt-feature -b feat/terminal-lab'
    ],
    3: ['agy --mode auto --model gemini-4-neon-xhigh', 'codex login status', 'probe auth'],
    4: ['git worktree add ../wt-worker-2 -b feat/worker-2', 'wtai.exe -w 0 split-pane -H -p "Codex"'],
    5: ['adb devices -l', 'gcloud auth list', 'agy --dangerously-skip-permissions --model gemini-4-neon-xhigh']
  };
  const list = presetsByChapter[state.chapter] || presetsByChapter[0];
  presetsEl.innerHTML = list
    .map((cmd) => `<button type="button" class="preset-chip" data-run-preset="${escapeHtml(cmd)}">${escapeHtml(cmd)}</button>`)
    .join('');
}

function renderStage() {
  const stage = document.getElementById('main-stage');
  if (!stage) return;
  const renderers = [
    renderChapter0,
    renderChapter1,
    renderChapter2,
    renderChapter3,
    renderChapter4,
    renderChapter5
  ];
  const body = (renderers[state.chapter] || renderChapter0)();
  const prevBtn =
    state.chapter > 0
      ? `<button type="button" class="btn" data-action="go-chapter" data-chapter="${state.chapter - 1}">Previous Chapter</button>`
      : '<span></span>';
  const nextBtn =
    state.chapter < CHAPTERS.length - 1
      ? `<button type="button" class="btn btn-primary" data-action="go-chapter" data-chapter="${state.chapter + 1}">Next Chapter</button>`
      : `<button type="button" class="btn btn-verified" data-action="go-chapter" data-chapter="0">Back to Chapter 00</button>`;

  stage.innerHTML = `${body}<footer class="stage-footer">${prevBtn}${nextBtn}</footer>`;
  renderNavAndProgress();
  renderSandboxPresets();
}

function switchChapter(id) {
  const target = Math.max(0, Math.min(CHAPTERS.length - 1, Number(id) || 0));
  state.chapter = target;
  saveState();
  renderStage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initThemeControls() {
  const buttons = document.querySelectorAll('[data-theme-choice]');
  const syncButtons = (mode) => {
    buttons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.themeChoice === mode));
  };
  const savedMode = localStorage.getItem('workshop-theme') || 'dark';
  syncButtons(savedMode);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.themeChoice || 'dark';
      localStorage.setItem('workshop-theme', mode);
      const resolved =
        mode === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : mode;
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.setAttribute('data-theme-mode', mode);
      syncButtons(mode);
    });
  });
}

function bindGlobalEvents() {
  document.getElementById('chapter-nav')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-chapter]');
    if (btn) switchChapter(btn.dataset.chapter);
  });

  document.getElementById('rail-probe-btn')?.addEventListener('click', () => runHostProbe('overview'));
  document.getElementById('toggle-sandbox-btn')?.addEventListener('click', () => toggleSandbox());
  document.getElementById('sandbox-close-btn')?.addEventListener('click', () => toggleSandbox(false));
  document.getElementById('sandbox-clear-btn')?.addEventListener('click', () => executeSandboxCommand('clear'));
  document.getElementById('sandbox-hint-btn')?.addEventListener('click', () => executeSandboxCommand('hint'));

  document.getElementById('sandbox-presets')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-run-preset]');
    if (!chip) return;
    openSandbox();
    executeSandboxCommand(chip.dataset.runPreset || '');
  });

  const sandboxForm = document.getElementById('sandbox-form');
  const sandboxInput = document.getElementById('sandbox-input');
  sandboxForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!sandboxInput) return;
    const val = sandboxInput.value;
    sandboxInput.value = '';
    executeSandboxCommand(val);
  });

  sandboxInput?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && state.history.length > 0) {
      e.preventDefault();
      state.historyIdx = Math.max(0, state.historyIdx - 1);
      sandboxInput.value = state.history[state.historyIdx] || '';
    } else if (e.key === 'ArrowDown' && state.history.length > 0) {
      e.preventDefault();
      state.historyIdx = Math.min(state.history.length, state.historyIdx + 1);
      sandboxInput.value = state.history[state.historyIdx] || '';
    }
  });

  document.getElementById('main-stage')?.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      copyText(copyBtn.dataset.copy || '', 'Copied to clipboard');
      return;
    }

    const contrastBtn = e.target.closest('[data-contrast]');
    if (contrastBtn) {
      state.viewContrast = contrastBtn.dataset.contrast || 'terminal';
      renderStage();
      return;
    }

    const chordBtn = e.target.closest('[data-chord]');
    if (chordBtn) {
      state.selectedChordId = chordBtn.dataset.chord || 'open-pane';
      renderStage();
      return;
    }

    const stageBtn = e.target.closest('[data-stage]');
    if (stageBtn) {
      state.pipelineStage = Number(stageBtn.dataset.stage || 0);
      renderStage();
      return;
    }

    const removePaneBtn = e.target.closest('[data-remove-pane]');
    if (removePaneBtn) {
      const id = Number(removePaneBtn.dataset.removePane);
      state.panes = state.panes.filter((p) => p.id !== id);
      renderStage();
      return;
    }

    const platBtn = e.target.closest('[data-portal-platform]');
    if (platBtn) {
      state.portalPlatform = platBtn.dataset.portalPlatform || 'All';
      renderStage();
      return;
    }

    const chanBtn = e.target.closest('[data-portal-channel]');
    if (chanBtn) {
      state.portalChannel = chanBtn.dataset.portalChannel || 'All';
      renderStage();
      return;
    }

    const milestoneBtn = e.target.closest('[data-milestone]');
    if (milestoneBtn) {
      const m = milestoneBtn.dataset.milestone;
      if (m) {
        if (state.dossierMilestones.has(m)) state.dossierMilestones.delete(m);
        else state.dossierMilestones.add(m);
        renderStage();
      }
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'go-chapter') {
      switchChapter(actionEl.dataset.chapter);
    } else if (action === 'open-sandbox') {
      const cmd = actionEl.dataset.cmd || '';
      openSandbox(cmd);
      if (cmd) executeSandboxCommand(cmd);
    } else if (action === 'mark-done') {
      markChapterDone(Number(actionEl.dataset.chapter));
      showToast('Chapter marked complete');
    } else if (action === 'probe') {
      runHostProbe(actionEl.dataset.target || 'overview');
    } else if (action === 'add-pane') {
      const nextNum = state.panes.length + 1;
      state.panes.push({
        id: Date.now(),
        title: `Pane ${nextNum} · Parallel Worker`,
        profile: nextNum % 2 === 0 ? 'Codex' : 'Google Antigravity',
        branch: `feat/worker-${nextNum}`,
        dir: `~/wt-worker-${nextNum}`
      });
      renderStage();
    } else if (action === 'reset-panes') {
      state.panes = [
        { id: 1, title: 'Pane 1 · Main Shell', profile: 'Google Antigravity', branch: 'main', dir: '~/repo' },
        { id: 2, title: 'Pane 2 · Parallel Worker', profile: 'Codex', branch: 'feat/terminal-lab', dir: '~/wt-terminal-lab' }
      ];
      renderStage();
    }
  });

  document.getElementById('main-stage')?.addEventListener('change', (e) => {
    const id = e.target.id;
    if (id === 'forge-agent') {
      state.forge.agent = e.target.value;
      renderStage();
    } else if (id === 'forge-mode') {
      state.forge.mode = e.target.value;
      renderStage();
    } else if (id === 'forge-model') {
      state.forge.model = e.target.value;
      renderStage();
    } else if (id === 'forge-output') {
      state.forge.output = e.target.value;
      renderStage();
    } else if (id === 'dossier-track') {
      state.dossierTrack = e.target.value;
      renderStage();
    } else if (e.target.dataset.paneProfile) {
      const pid = Number(e.target.dataset.paneProfile);
      const pane = state.panes.find((p) => p.id === pid);
      if (pane) {
        pane.profile = e.target.value;
        renderStage();
      }
    }
  });

  document.getElementById('main-stage')?.addEventListener('input', (e) => {
    if (e.target.id === 'forge-prompt') {
      state.forge.promptText = e.target.value;
      const boxes = document.querySelectorAll('#main-stage .code-box');
      if (boxes.length >= 2) {
        const cmd = buildForgeCommand();
        boxes[0].textContent = cmd;
        boxes[1].textContent = `wtai.exe new-tab -p "Google Antigravity" -- ${cmd}`;
      }
    }
  });
}

initThemeControls();
bindGlobalEvents();
renderStage();
appendTerminalLine('Sovereign Terminal Practice Sandbox ready. Type "help" or click any preset above.', 'term-ok');
