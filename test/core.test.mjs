import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_BRIEF, makeStoryboard, validateStoryboard, sceneAt, toSrt, toSvg, validateAssist, prepareAssist } from '../public/core.js';
test('all supported runtimes have contiguous scenes and exact subtitle endpoints', () => {
  for (const duration of [15, 30, 60]) {
    const board = makeStoryboard({ ...SAMPLE_BRIEF, duration });
    assert.equal(board.scenes.reduce((sum, scene) => sum + scene.duration, 0), duration);
    assert.equal(sceneAt(board, duration).id, board.scenes.at(-1).id);
    assert.match(toSrt(board), new RegExp(`00:${duration === 60 ? '01:00' : `00:${duration}`},000`));
  }
});
test('scene boundaries select the next scene and long clocks remain valid', () => {
  const board = makeStoryboard(SAMPLE_BRIEF);
  assert.equal(sceneAt(board, board.scenes[0].duration).id, board.scenes[1].id);
  assert.throws(() => sceneAt(board, NaN));
});
test('SVG export escapes untrusted text instead of emitting executable markup', () => {
  const board = makeStoryboard({ ...SAMPLE_BRIEF, brand: '<script>alert(1)</script>' });
  board.scenes[0].title = '<image onload="bad"/>';
  const svg = toSvg(board);
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('<image'));
  assert.ok(svg.includes('&lt;script&gt;'));
});
test('invalid AI drafts cannot silently change runtime or scene identity', () => {
  const board = makeStoryboard(SAMPLE_BRIEF);
  assert.equal(validateAssist({ scenes: board.scenes }, { brief: SAMPLE_BRIEF }).mode, 'ollama');
  board.scenes[0].duration += 1;
  assert.throws(() => validateAssist({ scenes: board.scenes }, { brief: SAMPLE_BRIEF }));
  board.scenes[0].duration -= 1;
  board.scenes[1].id = board.scenes[0].id;
  assert.throws(() => validateStoryboard(board));
  assert.throws(() => prepareAssist({ brief: { ...SAMPLE_BRIEF, message: '' } }));
});
