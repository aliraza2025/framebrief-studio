import { SAMPLE_BRIEF, makeStoryboard, validateStoryboard, timeline, sceneAt, toSrt, toSvg, toMarkdown } from './core.js';
import { el, download, showError, assist } from './shared.js';
const $ = id => document.getElementById(id);
let board = makeStoryboard(SAMPLE_BRIEF);
let position = 0;
let playing = false;
let lastFrame = 0;
let animation;
function fillBrief(brief) { for (const key of Object.keys(SAMPLE_BRIEF)) $(key).value = brief[key]; }
function stop() { playing = false; cancelAnimationFrame(animation); $('play').textContent = 'Play preview'; }
function render() {
  stop(); position = 0; $('scrub').value = 0; $('scrub').max = board.brief.duration;
  $('mode-label').textContent = board.mode === 'ollama' ? 'LOCAL AI DRAFT' : 'TEMPLATE DRAFT';
  $('timeline').replaceChildren(...timeline(board).map((scene, index) => el('button', { style: `flex:${scene.duration}`, onclick: () => { stop(); position = scene.start; updatePreview(); }, 'aria-label': `Jump to scene ${index + 1}: ${scene.title}` }, String(index + 1).padStart(2, '0'), el('small', {}, `${scene.duration}s`))));
  $('scenes').replaceChildren(...board.scenes.map((scene, index) => el('article', { className: 'story-card' }, el('div', { className: 'story-swatch', style: `--swatch:${['#294a43', '#845145', '#2c394a'][index % 3]}` }, el('span', {}, String(index + 1).padStart(2, '0')), el('small', {}, `${scene.duration} SECONDS`)),
    ...[['title', 'Scene title'], ['visual', 'Visual'], ['narration', 'Narration / caption'], ['direction', 'Direction']].map(([key, label]) => el('label', {}, label, el(key === 'title' ? 'input' : 'textarea', { value: scene[key], rows: key === 'title' ? undefined : 3, maxLength: 3000, 'aria-label': `Scene ${index + 1} ${label}`, onchange: event => { if (!event.target.value.trim()) { event.target.value = scene[key]; return; } scene[key] = event.target.value; updatePreview(); } }))))));
  updatePreview(); $('error').hidden = true;
}
function updatePreview() {
  const scene = sceneAt(board, position);
  const index = board.scenes.findIndex(item => item.id === scene.id);
  $('canvas').className = `animatic ${board.brief.format} tone-${index % 3}`;
  $('scene-number').textContent = String(index + 1).padStart(2, '0');
  $('scene-title').textContent = scene.title;
  $('scene-caption').textContent = scene.narration;
  $('scene-visual').textContent = scene.visual;
  $('canvas-brand').textContent = board.brief.brand;
  $('scrub').value = position;
  $('time').textContent = `${position.toFixed(1)} / ${board.brief.duration}s`;
  [...$('timeline').children].forEach((button, i) => button.classList.toggle('active', i === index));
}
function frame(now) { if (!playing) return; position = Math.min(board.brief.duration, position + (now - lastFrame) / 1000); lastFrame = now; updatePreview(); if (position >= board.brief.duration) stop(); else animation = requestAnimationFrame(frame); }
$('play').addEventListener('click', () => { if (playing) { stop(); return; } if (position >= board.brief.duration) position = 0; playing = true; lastFrame = performance.now(); $('play').textContent = 'Pause preview'; animation = requestAnimationFrame(frame); });
$('scrub').addEventListener('input', () => { stop(); position = Number($('scrub').value); updatePreview(); });
$('brief-form').addEventListener('submit', async event => { event.preventDefault(); const brief = { brand: $('brand').value.trim(), audience: $('audience').value.trim(), message: $('message').value.trim(), objective: $('objective').value.trim(), duration: Number($('duration').value), format: $('format').value }; const button = $('generate'); button.disabled = true; button.textContent = 'Drafting…'; try { const next = $('mode').value === 'ollama' ? await assist({ brief }) : makeStoryboard(brief); validateStoryboard(next); board = next; render(); } catch (error) { showError(error); } finally { button.disabled = false; button.textContent = 'Build storyboard ↗'; } });
$('sample').addEventListener('click', () => { fillBrief(SAMPLE_BRIEF); board = makeStoryboard(SAMPLE_BRIEF); render(); });
$('json').onclick = () => download('framebrief-project.json', JSON.stringify(board, null, 2), 'application/json');
$('srt').onclick = () => download('framebrief-captions.srt', toSrt(board), 'application/x-subrip');
$('svg').onclick = () => download('framebrief-storyboard.svg', toSvg(board), 'image/svg+xml');
$('markdown').onclick = () => download('framebrief-production.md', toMarkdown(board), 'text/markdown');
$('import').addEventListener('change', async event => { try { const file = event.target.files[0]; if (!file) return; if (file.size > 1_000_000) throw new Error('Choose a project smaller than 1 MB.'); const next = validateStoryboard(JSON.parse(await file.text())); board = next; fillBrief(board.brief); render(); } catch (error) { showError(error); } finally { event.target.value = ''; } });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
fillBrief(SAMPLE_BRIEF); render();
