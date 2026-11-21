import {BIOMES, PROFESSIONS, RACES, SETTLEMENT_STYLES} from '../src/citizens/registry.mjs';
import {createCitizen} from '../src/citizens/entity.mjs';
import {ordinaryAppearancePool} from '../src/citizens/ordinary-appearance.mjs';
import {createCitizenRenderer} from '../src/citizens/renderer.mjs';

const field = id => document.getElementById(id);
const title = id => id.replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
const options = (id, rows) => field(id).replaceChildren(...rows.map(([value,label]) => new Option(label,value)));
const byId = values => values.map(value => [value,title(value)]);

options('profession',[['','Ordinary citizen'],...Object.values(PROFESSIONS).map(({id,name}) => [id,name])]);
options('race',[['','All six races'],...Object.values(RACES).map(({id,name}) => [id,name])]);
options('biome',byId(BIOMES));
options('style',byId(SETTLEMENT_STYLES));
options('action',byId(['idle','walk','turn','interact','work','flee','damage','attack']));
field('profession').value = 'blacksmith';
field('action').value = 'walk';

const canvas = field('scene');
const status = field('status');
const gl = canvas.getContext('webgl2',{alpha:false,antialias:true});
if (!gl) {
  status.textContent = 'WebGL2 is required for the citizen preview.';
} else {
  let renderer = createCitizenRenderer(gl);
  let characters = [];
  let frame = 0;
  let frameRequest = 0;
  let start = 0;

  function selectCitizens() {
    const profession = field('profession').value || null;
    const biome = field('biome').value;
    const action = field('action').value;
    field('raceChoice').hidden = profession === null;
    field('variantChoice').hidden = profession === null;
    field('ordinaryChoice').hidden = profession !== null;
    let choices;
    if (profession) {
      const races = field('race').value ? [field('race').value] : Object.keys(RACES);
      choices = races.map(race=>({race,profession,biome,variant:Number(field('variant').value)}));
    } else {
      const pool = ordinaryAppearancePool(biome);
      const current = field('ordinary').value;
      options('ordinary',[['','All ten appearances'],...pool.map(({race,variant},index)=>
        [String(index),`${RACES[race].name} ${variant}`])]);
      field('ordinary').value = current;
      choices = current === '' ? pool : [pool[Number(current)]];
    }
    const names = field('names');
    names.style.gridTemplateColumns = `repeat(${choices.length},1fr)`;
    names.replaceChildren(...choices.map(({race,variant}) => {
      const label = document.createElement('span');
      label.textContent = profession ? RACES[race].name : `${RACES[race].name} ${variant}`;
      return label;
    }));
    characters = choices.map((choice, slot) => ({
      citizen: createCitizen({worldSeed:179,settlementId:'preview',slot,style:field('style').value,...choice}),
      action:action === 'attack' && PROFESSIONS[profession]?.threatResponse !== 'defend' ? 'idle' : action,
    }));
    start = performance.now();
  }

  function draw(now) {
    const ratio = Math.min(devicePixelRatio,1.5);
    const width = Math.max(1,Math.round(canvas.clientWidth*ratio));
    const height = Math.max(1,Math.round(canvas.clientHeight*ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const aspect = width/height;
    const tanHalfFov = .42;
    const distance = Math.max(3.8,characters.length*1.2/(2*aspect*tanHalfFov));
    const time = (now-start)/1000;
    const pitch = .11;
    const eye = [0,1+distance*Math.sin(pitch),distance*Math.cos(pitch)];
    gl.viewport(0,0,width,height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(.157,.235,.247,1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const step = 2*distance*aspect*tanHalfFov/characters.length;
    const entities = characters.map((character,index) => ({
      ...character,
      position:[(index-(characters.length-1)/2)*step,0,0],
      heading:.27+Math.sin(time*.8)*.14,
    }));
    const stats = renderer.draw(entities,{eye,forward:[0,-Math.sin(pitch),-Math.cos(pitch)],
      right:[1,0,0],up:[0,Math.cos(pitch),-Math.sin(pitch)],aspect,tanHalfFov,time});
    canvas.dataset.frame = String(++frame);
    canvas.dataset.drawCalls = String(stats.drawCalls);
    canvas.dataset.gpuBytes = String(stats.gpuBytes);
    const summary = `${entities.length} citizens · ${stats.drawCalls} draws · ${Math.round(stats.gpuBytes/1024)} KiB cached mesh data`;
    if (status.textContent !== summary) status.textContent = summary;
    frameRequest = requestAnimationFrame(draw);
  }

  field('controls').addEventListener('change',selectCitizens);
  canvas.addEventListener('webglcontextlost',event => {
    event.preventDefault();
    cancelAnimationFrame(frameRequest);
    status.textContent = 'Rendering paused while WebGL recovers.';
  });
  canvas.addEventListener('webglcontextrestored',() => {
    renderer = createCitizenRenderer(gl);
    frameRequest = requestAnimationFrame(draw);
  });
  selectCitizens();
  frameRequest = requestAnimationFrame(draw);
}
