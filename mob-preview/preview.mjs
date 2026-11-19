import { ForegroundFrameDriver } from '../src/foreground.mjs';
import { FIXED_STEP } from '../src/mobs/engine.mjs';
import { createScene } from './scene.mjs';
import { createRenderer } from './renderer.mjs';

const canvas = document.querySelector('canvas');
const actions = document.querySelector('#actions');
const message = document.querySelector('#graphics');
const feedback = document.querySelector('#feedback');
const name = document.querySelector('#name');
const habitat = document.querySelector('#habitat');
const state = document.querySelector('#state');
const health = document.querySelector('#health');
const stats = document.querySelector('#stats');
const tabs = [...document.querySelectorAll('[data-species]')];
const commands = {
  deer: [['approach', 'Approach deer'], ['withdraw', 'Step away']],
  goblin: [['encounter', 'Start encounter'], ['withdraw', 'Leave encounter'], ['door', 'Open test door']],
  glownewt: [['near', 'Move nearby'], ['bond', 'Befriend'], ['move', 'Move guide'],
    ['follow', 'Follow'], ['stay', 'Stay'], ['return', 'Return'], ['down', 'Simulate injury'], ['rescue', 'Rescue']]
};
const testMode = ['localhost', '127.0.0.1'].includes(location.hostname) &&
  new URL(location.href).searchParams.has('test');
const scene = createScene();
const terrain = scene.meshes();
const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
let lossExtension = testMode ? gl?.getExtension('WEBGL_lose_context') : null;
let renderer;
let time = 0;
let previous;
let frames = 0;
let losses = 0;
let restores = 0;
let draw = { actors: 0, draws: 0 };
let lastRender = 0;
let lastSimulation = 0;
let destroyed = false;
const paused = testMode;
let hideSubject = false;

function redraw(snapshot = scene.snapshot()) {
  if (!renderer || gl.isContextLost()) return;
  const start = performance.now();
  const entities = hideSubject ? snapshot.draw.filter(entity => entity.id !== snapshot.mob.id) : snapshot.draw;
  draw = renderer.render(canvas, snapshot.mob, entities, time);
  lastRender = performance.now() - start;
  frames++;
}

function renderControls(snapshot) {
  habitat.textContent = snapshot.fixture.habitat;
  name.textContent = snapshot.fixture.title;
  state.textContent = snapshot.state.replaceAll('-', ' ');
  health.hidden = snapshot.species !== 'goblin' || !snapshot.target.visible;
  health.textContent = 'Target HP ' + snapshot.target.health;
  if (frames % 10 === 0 || testMode)
    stats.value = 'WebGL2 · ' + draw.actors + ' visible · ' + draw.draws + ' draw calls · ' +
      snapshot.work + ' navigation nodes · ' + lastSimulation.toFixed(2) + ' ms simulation';
}

function simulate(dt) {
  const start = performance.now();
  scene.tick(dt);
  time += dt;
  lastSimulation = performance.now() - start;
}

function frame(timestamp) {
  const dt = previous === undefined ? 0 : Math.min(.1, (timestamp - previous) / 1000);
  previous = timestamp;
  if (!paused) simulate(dt);
  const snapshot = scene.snapshot();
  redraw(snapshot);
  renderControls(snapshot);
}

const scheduler = new ForegroundFrameDriver(requestAnimationFrame.bind(window), cancelAnimationFrame.bind(window), frame);
function start() {
  if (destroyed || !renderer || document.hidden || gl.isContextLost()) return;
  previous = undefined;
  scheduler.resume();
}

function stop() {
  scheduler.pause();
  previous = undefined;
}

function construct() {
  if (!gl) {
    message.textContent = 'This preview requires WebGL2.';
    return false;
  }
  try {
    renderer = createRenderer(gl, terrain, scene.cameraClear);
    message.textContent = '';
    return true;
  } catch (error) {
    message.textContent = 'WebGL2 setup failed: ' + error.message;
    renderer = null;
    return false;
  }
}

function select(species) {
  if (!scene.select(species)) return;
  for (const tab of tabs) tab.setAttribute('aria-pressed', String(tab.dataset.species === species));
  actions.replaceChildren(...commands[species].map(([id, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.action = id;
    button.textContent = label;
    return button;
  }));
  feedback.textContent = '';
  renderControls(scene.snapshot());
  redraw();
}

const feedbackText = {
  bond: 'Bonded. The Glownewt will follow the guide.',
  stay: 'The Glownewt will stay here.',
  down: 'The Glownewt is downed. Move nearby and give it a moment before rescue.',
  rescue: 'Rescued. The Glownewt can follow again.',
  door: 'The approved outpost door opened.'
};

for (const tab of tabs) tab.addEventListener('click', () => select(tab.dataset.species));
actions.addEventListener('click', event => {
  const command = event.target.closest('button')?.dataset.action;
  if (!command) return;
  const success = scene.action(command);
  feedback.textContent = success ? (feedbackText[command] ?? '') :
    'This action is unavailable at the current position or state.';
  renderControls(scene.snapshot());
  redraw();
});

canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  losses++;
  stop();
  message.textContent = 'WebGL2 context lost. Waiting for restoration.';
});
canvas.addEventListener('webglcontextrestored', () => {
  if (destroyed) return;
  restores++;
  lossExtension = testMode ? gl.getExtension('WEBGL_lose_context') : null;
  renderer?.dispose();
  if (construct()) start();
});
document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
window.addEventListener('pageshow', start);
window.addEventListener('pagehide', event => {
  stop();
  if (!event.persisted) teardown();
});

function teardown() {
  if (destroyed) return;
  stop();
  destroyed = true;
  renderer?.dispose();
  scene.dispose();
}

function sample(values, quantile) {
  const sorted = [...values].sort((a, b) => a - b);
  return Number(sorted[Math.floor((sorted.length - 1) * quantile)].toFixed(3));
}

async function benchmark(count, samples = 90) {
  if (!testMode || !renderer || ![0, 24].includes(count) || !Number.isInteger(samples) || samples < 20 || samples > 360)
    return null;
  stop();
  const { runtime, steering, population } = scene.benchmark(count);
  const simulation = [], submission = [], intervals = [];
  const subject = scene.snapshot().mob;
  const jsHeapBefore = performance.memory?.usedJSHeapSize ?? null;
  const observer = [-8, 9, 5];
  let last, nodes = 0, active = 0, dormant = 0, elapsed = 0, draws = 0;
  // Keep the camera, world, buffer dimensions, and sample count fixed for both
  // runs. This measures CPU work and RAF intervals, not hardware GPU timings.
  try {
    for (let i = 0; i < samples + 12; i++) {
      const stamp = await new Promise(requestAnimationFrame);
      const before = performance.now();
      population.advance(FIXED_STEP, observer, []);
      steering.advance(FIXED_STEP);
      elapsed += FIXED_STEP;
      const sim = performance.now() - before;
      const entities = runtime.all();
      const visible = entities.filter(mob => mob.state !== 'dormant');
      active = visible.length;
      dormant = entities.length - active;
      const renderStart = performance.now();
      draws = renderer.render(canvas, subject, visible, elapsed).draws;
      const render = performance.now() - renderStart;
      if (i >= 12) {
        simulation.push(sim);
        submission.push(render);
        intervals.push(stamp - last);
        nodes += steering.navigationWork;
      }
      last = stamp;
    }
    const extendedStart = performance.now();
    for (let i = 0; i < 1800; i++) {
      population.advance(FIXED_STEP, observer, []);
      steering.advance(FIXED_STEP);
    }
    const extendedMs = performance.now() - extendedStart;
    const liveAfterStress = runtime.counts().total;
    runtime.dispose();
    return { count, samples, active, dormant, draws, nodeExpansions: nodes,
      simulationP50: sample(simulation, .5), simulationP95: sample(simulation, .95),
      renderSubmitP50: sample(submission, .5), renderSubmitP95: sample(submission, .95),
      frameP50: sample(intervals, .5), frameP95: sample(intervals, .95),
      extendedSteps: 1800, extendedMs, liveAfterStress,
      emptyAfterDispose: runtime.counts().total === 0,
      jsHeapBefore, jsHeapAfter: performance.memory?.usedJSHeapSize ?? null,
      resources: renderer.resources() };
  } finally {
    runtime.dispose();
    start();
  }
}

if (testMode) Object.defineProperty(window, 'mobPreview', { value: Object.freeze({
  step(count, matchState) {
    if (!Number.isInteger(count) || count < 0 || count > 600 || destroyed) return false;
    for (let i = 0; i < count; i++) {
      simulate(FIXED_STEP);
      if (matchState && scene.snapshot().state === matchState) break;
    }
    const snapshot = scene.snapshot();
    redraw(snapshot);
    renderControls(snapshot);
    return true;
  },
  showSubject(visible) {
    hideSubject = visible !== true;
    redraw();
  },
  inspect() {
    return { ...scene.snapshot(true), graphics: Boolean(renderer), frames, draw, losses, restores,
      glError: !gl || gl.isContextLost() ? null : gl.getError(), contextLost: gl?.isContextLost() ?? false,
      resources: renderer?.resources(), submissionMs: lastRender };
  },
  context(restore = false) {
    if (!lossExtension) return false;
    if (restore) lossExtension.restoreContext();
    else lossExtension.loseContext();
    return true;
  },
  resources() { return renderer?.resources(); },
  teardown,
  benchmark
}) });

select('deer');
if (construct()) start();
