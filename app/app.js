// Leonida Legend — GTA VI trophy guide & tracker.
// All data lives in data/trophies.json (official names, descriptions, grades + original guides with sources).
// Progress is kept in localStorage only; nothing leaves the browser. No network requests besides the local JSON.
const KEY = 'gta6-trophy-checklist-v1';
const SETTINGS_KEY = 'gta6-trophy-settings-v1';

const listEl = document.getElementById('list');
const progressEl = document.getElementById('progress');
const ringEl = document.getElementById('ring');
const ringNumEl = document.getElementById('ring-num');
const gradeCountsEl = document.getElementById('grade-counts');
const countLineEl = document.getElementById('count-line');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const sortEl = document.getElementById('sort');
const hideEarnedEl = document.getElementById('hide-earned');
const spoilersEl = document.getElementById('spoilers');

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
let settings = { spoilers: true };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')); } catch { /* keep defaults */ }
spoilersEl.checked = settings.spoilers !== false;

// Shareable filtered views: ?kind=story&grade=silver&q=meditate preselects the filters on load.
const params = new URLSearchParams(location.search);
if (['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(params.get('kind') ?? '')) kindEl.value = params.get('kind');
if (['all', 'platinum', 'gold', 'silver', 'bronze'].includes(params.get('grade') ?? '')) gradeEl.value = params.get('grade');
if (params.get('q')) searchEl.value = params.get('q');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const KIND_LABEL = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online', platinum: 'Platinum' };

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}
function saveSettings() {
  settings.spoilers = spoilersEl.checked;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function fmtTarget(t) {
  if (t.target == null) return '';
  return t.target >= 1000 ? `PSN target: ${t.target.toLocaleString('en-US')}` : `PSN target: ${t.target}`;
}
function spoilerHidden(t) {
  // Story trophies hide name + description until earned, while the spoiler setting is on.
  return spoilersEl.checked && t.kind === 'story' && !earned.has(t.id);
}
function visible(t) {
  if (kindEl.value === 'missable' && !t.missable) return false;
  if (kindEl.value === 'online') return false; // No online trophies: all 55 are single-player.
  if (kindEl.value !== 'all' && kindEl.value !== 'missable' && t.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (hideEarnedEl.checked && earned.has(t.id)) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
  return true;
}
function sorted(ts) {
  const arr = [...ts];
  if (sortEl.value === 'grade') arr.sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.id - b.id);
  if (sortEl.value === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
  return arr;
}
function render() {
  const shown = sorted(trophies.filter(visible));
  listEl.replaceChildren();
  if (shown.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = kindEl.value === 'online'
      ? 'No online trophies — all 55 GTA VI trophies are single-player, so this filter is empty by design.'
      : 'No trophies match these filters. Clear the search or widen the filters.';
    listEl.append(p);
  }
  for (const t of shown) {
    const card = document.createElement('article');
    card.className = 'card' + (earned.has(t.id) ? ' earned' : '') + (t.unconfirmed ? ' unconfirmed' : '');
    card.id = 't-' + t.id;

    const head = document.createElement('div');
    head.className = 'card-head';
    const h = document.createElement('h3');
    h.textContent = spoilerHidden(t) ? 'Hidden story trophy' : t.name;
    if (spoilerHidden(t)) h.classList.add('spoiler-hidden');
    const badge = document.createElement('span');
    badge.className = 'badge ' + t.grade;
    badge.textContent = t.grade;
    head.append(h, badge);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = KIND_LABEL[t.kind] ?? t.kind;
    head.append(kindTag);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag missable';
      m.textContent = 'Potentially missable';
      head.append(m);
    }
    if (t.unconfirmed) {
      const u = document.createElement('span');
      u.className = 'tag unconfirmed-tag';
      u.textContent = 'Method not yet confirmed';
      head.append(u);
    }
    if (t.target != null) {
      const tg = document.createElement('span');
      tg.className = 'target';
      tg.textContent = fmtTarget(t);
      head.append(tg);
    }
    card.append(head);

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = spoilerHidden(t)
      ? 'Story trophy — its name and description are hidden until you earn it (turn off “Hide story spoilers” to reveal).'
      : '“' + t.description + '”';
    if (spoilerHidden(t)) desc.classList.add('spoiler-hidden');
    card.append(desc);

    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = t.guide;
    card.append(guide);

    const src = document.createElement('p');
    src.className = 'sources';
    src.textContent = 'Sources: ';
    t.sources.forEach((s, i) => {
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      src.append(a);
    });
    card.append(src);

    const earn = document.createElement('label');
    earn.className = 'earn';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      render();
    });
    earn.append(box, document.createTextNode(earned.has(t.id) ? 'Earned ✓' : 'Mark as earned'));
    card.append(earn);

    listEl.append(card);
  }

  const n = earned.size;
  const pct = Math.round((n / trophies.length) * 100);
  progressEl.textContent = `${n} of ${trophies.length} earned`;
  ringEl.style.setProperty('--pct', pct);
  ringNumEl.textContent = pct + '%';
  const counts = {};
  for (const t of trophies) if (earned.has(t.id)) counts[t.grade] = (counts[t.grade] ?? 0) + 1;
  gradeCountsEl.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map(g => `${counts[g] ?? 0} ${g}`).join(' · ');
  countLineEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
    (kindEl.value === 'online' ? ' — GTA VI has no online trophies.' : '');
}

document.getElementById('export').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map(t => t.id));
    const next = new Set((ids ?? []).filter(id => valid.has(Number(id))).map(Number));
    earned = next;
    save();
    render();
  } catch {
    alert('That file could not be imported — it is not a trophy-progress JSON file from this guide.');
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!earned.size) return;
  if (confirm('Clear all earned trophies? This cannot be undone (export first if you want a backup).')) {
    earned = new Set();
    save();
    render();
  }
});
for (const el of [searchEl, kindEl, gradeEl, sortEl, hideEarnedEl]) el.addEventListener('input', render);
spoilersEl.addEventListener('change', () => { saveSettings(); render(); });
render();
