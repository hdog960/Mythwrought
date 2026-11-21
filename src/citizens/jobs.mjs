import {workplaceCompatible} from './entity.mjs';
import {PROFESSIONS, RACES} from './registry.mjs';

const poses = {
  tend: ['tend-crops','tend-livestock','tend-herd','tend-garden','tend-greenhouse','inspect-hive',
    'tend-woodland','tend-stable','tend-animals','sort-herbs','tend-magical-creature','tend-shrine'],
  craft: ['operate-mill','bake','prepare-cuts','brew','split-stone','work-timber','hammer-metal',
    'fit-armor','shape-wood','dress-stone','shape-clay','shape-glass','stitch-cloth','set-jewels',
    'cook-meal','prepare-medicine','mix-reagents','prepare-potion','paint'],
  read: ['check-records','check-ledger','read-case','review-plans','sort-books','catalog-records',
    'study','draw-map','study-arcana','record-arcane-observation','draft-plan'],
  observe: ['inspect-hunting-post','fish','inspect-mine','survey-ore','keep-watch','watch-gate',
    'inspect-beacon','observe-sky','inspect-enchantment','inspect-crystal','inspect-building-materials',
    'inspect-equipment','inspect-hull','inspect-resonance-device'],
  perform: ['teach','teach-arcana','perform-scene','play-instrument'],
  carry: ['handle-cargo'],
  patrol: ['patrol','guard-post','patrol-edge','visit-lookout','visit-message-points'],
};

const poseByActivity = new Map(Object.entries(poses).flatMap(([pose,activities]) =>
  activities.map(activity=>[activity,pose])));

const nameParts = {
  human: [['Mara','Tobin','Sela','Ivo','Nell','Orin'],['Reed','Vale','Moss','Fenn','Hale']],
  elf: [['Avel','Leth','Iria','Sael','Eris','Nerin'],['Lark','Willow','Silverleaf','Dew']],
  dwarf: [['Bruna','Dori','Torra','Uld','Mira','Garn'],['Flint','Anvil','Copper','Alder']],
  thornkin: [['Bracken','Yarrow','Linden','Vetch','Rowan','Aster'],['Root','Fern','Moss','Briar']],
  asteri: [['Veya','Sira','Oren','Luma','Tavi','Mera'],['Dawn','Dusk','Gleam','Skytide']],
  glassborn: [['Fira','Kest','Rhyn','Tess','Nacre','Vitre'],['Facet','Vein','Gleam','Splinter']],
};

function displayIdentity(citizen) {
  const [first,last]=nameParts[citizen.race];
  const seed=citizen.appearanceSeed>>>0;
  return `${first[seed%first.length]} ${last[(seed>>>16)%last.length]}`;
}

export function citizenJob(citizen,workplace) {
  const role=PROFESSIONS[citizen.profession];
  if (!role) return null;
  return {
    activity:role.activity,
    pose:poseByActivity.get(role.activity)??'attend',
    availability:workplaceCompatible(citizen,workplace)?'workplace':'absent',
  };
}

function serviceFor(citizen,{workplace,host}) {
  const role=PROFESSIONS[citizen.profession];
  if (!role?.dependency || !workplaceCompatible(citizen,workplace) ||
      !host?.services || !Object.hasOwn(host.services,role.interaction)) return null;
  const entry=host.services[role.interaction];
  return typeof entry?.execute==='function'&&typeof entry.label==='string' ? entry : null;
}

function information(role,settlementName,place,sky) {
  if (role.id==='astronomer' && /^\d{2}:\d{2}$/.test(sky?.time) &&
      ['dawn','day','dusk','night'].includes(sky.phase)) {
    return `${settlementName} sky report from ${place}. It is ${sky.time}, during ${sky.phase}.`;
  }
  if (role.id==='mayor') return `Welcome to ${settlementName}. The civic office is at ${place}.`;
  return `I work in ${settlementName} at ${place}.`;
}

export function citizenInteraction(citizen,{settlement,workplace=null,sky=null,host=null}={}) {
  if (settlement?.id!==citizen.settlementId) throw RangeError('Citizen is outside this settlement');
  const role=PROFESSIONS[citizen.profession];
  const name=displayIdentity(citizen);
  const settlementName=settlement.name||settlement.id;
  const compatible=workplaceCompatible(citizen,workplace);
  const service=serviceFor(citizen,{workplace,host});
  const place=workplace?.label||workplace?.id;
  return {
    id:citizen.id,name,race:RACES[citizen.race].name,profession:role?.name??null,
    message:compatible ? information(role,settlementName,place,sky) :
      role ? `I am the ${role.name.toLowerCase()} in ${settlementName}. I have no active workplace here.` :
      `I live in ${settlementName}.`,
    service:role?.dependency ? {
      id:role.interaction,dependency:role.dependency,available:Boolean(service),label:service?.label??null,
    } : null,
  };
}

export function useCitizenService(citizen,{settlement,workplace,host,player}) {
  if (settlement?.id!==citizen.settlementId) throw RangeError('Citizen is outside this settlement');
  const service=serviceFor(citizen,{workplace,host});
  if (!service) throw Error('Citizen service is unavailable');
  return service.execute({citizen,workplace,player});
}
