import {agricultureOutfit, agricultureTool} from './agriculture-appearance.mjs';
import {civicOutfit} from './civic-appearance.mjs';
import {craftsmanshipOutfit} from './craftsmanship-appearance.mjs';
import {ordinaryOutfit} from './ordinary-appearance.mjs';
import {specialistOutfit} from './specialist-appearance.mjs';
import {buildWorkClothes} from './work-clothes.mjs';
import {PROFESSIONS} from './registry.mjs';

export const CITIZEN_VERTEX_FLOATS = 9;
const JOINT = Object.freeze({body:0, leftLeg:1, rightLeg:2, leftArm:3, rightArm:4, head:5});

const races = {
  human:     {height:1.72, width:.43, head:.32, skin:['#bf805b','#744935'], hair:['#463028','#242533']},
  elf:       {height:1.86, width:.36, head:.29, skin:['#e2aa80','#8e684e'], hair:['#e0c495','#353154']},
  dwarf:     {height:1.37, width:.56, head:.37, skin:['#cb885a','#8c583e'], hair:['#7c3926','#3f302a']},
  thornkin:  {height:1.85, width:.48, head:.32, skin:['#826747','#617044'], hair:['#587642','#46795b']},
  asteri:    {height:1.76, width:.39, head:.31, skin:['#7862a2','#424a87'], hair:['#dbd2ee','#22264b']},
  glassborn: {height:1.67, width:.53, head:.35, skin:['#4f9f9d','#8081bd'], hair:['#9adad7','#ddbaec']},
};

const biomes = {
  temperate: {cloth:'#53694a', outer:'#91815a', feet:'#534034', lining:'#d5aa72'},
  desert:    {cloth:'#d8b778', outer:'#9e5a35', feet:'#72503c', lining:'#f5db9d'},
  snow:      {cloth:'#516c81', outer:'#b7c9c8', feet:'#3f505d', lining:'#e8e4d8'},
  'enchanted-forest': {cloth:'#4d426b', outer:'#4c775d', feet:'#3e364b', lining:'#b9bd76'},
  mountain:  {cloth:'#6e7077', outer:'#aa6245', feet:'#423b38', lining:'#d8ba8b'},
};

const styles = {
  village: {metal:'#9e744d', seam:'#594731', finish:.055},
  town:    {metal:'#b99161', seam:'#514457', finish:.085},
  city:    {metal:'#e1b77a', seam:'#49427b', finish:.115},
};

const professionColors = {
  'agriculture-food':'#5d7746', 'resources-craftsmanship':'#7d4e3a',
  'commerce-hospitality':'#ab6b39', 'government-administration':'#764462',
  'defense-transportation':'#46657a', 'healing-education-knowledge':'#738456',
  'magic-arcane':'#684681', 'culture-construction-utilities':'#387375',
};

const faces = [
  [[0,2,3,1],.66], [[4,5,7,6],.93], [[0,4,6,2],.75],
  [[1,3,7,5],.81], [[0,1,5,4],.54], [[2,6,7,3],1],
];
const triangles = [0,1,2,0,2,3];

function color(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(channel => channel / 255);
}

function makeGeometry(detail) {
  const vertices = [];
  return {
    box(joint, pivot, x, y, z, width, height, depth, hex) {
      if (detail==='far' && width*height*depth<.0012) return;
      const rgb = color(hex);
      for (const [corners, shade] of faces) for (const index of triangles) {
        const corner = corners[index];
        vertices.push(x + width * ((corner & 1) - .5),
          y + height * (((corner >> 1) & 1) - .5),
          z + depth * (((corner >> 2) & 1) - .5),
          rgb[0] * shade, rgb[1] * shade, rgb[2] * shade, joint, ...pivot);
      }
    },
    finish() { return new Float32Array(vertices); },
  };
}

function facialFeatures(box, race, variant, width, headY, pivot, skin, hair) {
  const head = (x,y,z,w,h,d,c) => box(JOINT.head,pivot,x,headY+y,z,w,h,d,c);
  const front = width * .43;
  const accent = variant ? '#dcad65' : '#eee3b9';
  head(0,0,0,width,width*.85,width*.84,skin);
  head(0,width*.42,-.015,width*1.06,.075,width*.9,hair);
  head(0,-.005,-width*.42,width,.24,.065,hair);
  head(-width*.17,.025,front,.045,.025,.018,'#282839');
  head(width*.17,.025,front,.045,.025,.018,'#282839');
  head(0,-.051,front+.012,.047,.043,.034,skin);
  if (variant) {
    head(-width*.28,.095,front,.12,.09,.045,hair);
    head(width*.47,-.045,.018,.065,.25,.08,hair);
  } else {
    head(width*.20,.123,front,.14,.045,.047,hair);
    head(-width*.46,.045,-.015,.050,.11,.10,hair);
  }

  if (race === 'elf') {
    for (const side of [-1,1]) {
      head(side*width*.58,.06,-.012,.11,.035,.105,skin);
      head(side*width*.72,.09,-.025,.066,.025,.065,skin);
    }
  } else if (race === 'dwarf') {
    head(0,-.128,front+.005,width*.79,.115,.075,hair);
    head(variant ? -.045 : 0,-.207,front+.02,width*.49,variant?.14:.105,.095,hair);
    head(variant ? -.045 : 0,-.207,front+.07,.042,.034,.018,accent);
  } else if (race === 'thornkin') {
    head(-width*.29,.27,-.035,.068,.26,.07,skin);
    head(-width*.43,.34,-.035,.16,.06,.10,hair);
    head(width*.26,.24,-.05,.13,.13,.18,hair);
    head(width*.27,-.06,front,.048,.11,.03,accent);
  } else if (race === 'asteri') {
    head(0,.205,-.055,.22,.052,.08,accent);
    head(0,.13,front+.013,.039,.085,.02,accent);
    head(0,.135,front+.014,.077,.026,.02,accent);
    head(width*.51,-.035,-.03,.035,.07,.065,accent);
  } else if (race === 'glassborn') {
    head(-width*.24,.205,-.035,.127,.185,.133,hair);
    head(width*.22,.20,.025,.10,.12,.15,skin);
    head(-width*.37,0,front,.063,.185,.06,hair);
    head(width*.42,-.025,.045,.066,.15,.184,hair);
  }
}

function equipment(box, pivot, x, y, outfit) {
  const prop = (dx,dy,z,w,h,d,c) => box(JOINT.rightArm,pivot,x+dx,y+dy,z-.066,w,h,d,c);
  if (outfit?.equipment) {
    for (const piece of outfit.equipment) prop(...piece);
  } else if (outfit?.tool) {
    agricultureTool(outfit.tool,prop);
  }
}

export function buildCitizenMesh(citizen,{detail='near'}={}) {
  const rig = races[citizen.race];
  const biome = biomes[citizen.biome];
  const style = styles[citizen.style];
  const profession = PROFESSIONS[citizen.profession];
  const variant = citizen.variant - 1;
  const outfit = profession
    ? agricultureOutfit(profession.id) ?? craftsmanshipOutfit(profession.id) ??
      civicOutfit(profession.id) ?? specialistOutfit(profession.id)
    : ordinaryOutfit(citizen,biome);
  const outer = profession ? professionColors[profession.group] : biome.outer;
  if (profession && !outfit) throw Error('Missing equipment for '+profession.id);
  const {box,finish} = makeGeometry(detail);
  const {height,width,head} = rig;
  const hip = height * .45, shoulder = height * .78, headY = height - head * .45;
  const bodyDepth = width * .59, armWidth = width * .25;
  const wrist = shoulder - height * .26, legWidth = width*.37;
  const skin = rig.skin[variant], hair = rig.hair[variant];
  const body = (x,y,z,w,h,d,c) => box(JOINT.body,[0,0],x,y,z,w,h,d,c);

  body(0,(hip+shoulder)*.5,0,width,shoulder-hip,bodyDepth,biome.cloth);
  body(0,shoulder-.13,bodyDepth*.49,width*.72,.255,.045,outer);
  body(0,hip+.02,0,width*1.04,.059,bodyDepth+.04,style.seam);
  body(width*.19,hip+.02,bodyDepth*.56,style.finish,.058,.035,style.metal);
  body(variant ? -width*.28 : width*.29,hip-.021,bodyDepth*.45,.104,.111,.080,biome.outer);
  body(0,shoulder+.008,0,width*.61,.057,bodyDepth+.06,biome.lining);
  const neckTop = headY - head * .26;
  body(0,(shoulder+neckTop)*.5,0,head*.59,neckTop-shoulder,head*.56,skin);

  for (const side of [-1,1]) {
    const leg = side < 0 ? JOINT.leftLeg : JOINT.rightLeg;
    const arm = side < 0 ? JOINT.leftArm : JOINT.rightArm;
    const lx = side*width*.241, ax = side*(width*.5 + armWidth*.48);
    box(leg,[hip,0],lx,hip*.51,0,legWidth,hip-.06,legWidth,style.seam);
    box(leg,[hip,0],lx,.089,.041,legWidth*1.07,.178,legWidth*1.42,biome.feet);
    box(leg,[hip,0],lx,.032,.043,legWidth*1.13,.061,legWidth*1.47,'#382f31');
    box(arm,[shoulder,0],ax,(shoulder+wrist)*.5,0,armWidth,shoulder-wrist,armWidth,outer);
    box(arm,[shoulder,0],ax,wrist+.07,0,armWidth*1.01,.053,armWidth*1.02,biome.lining);
    box(arm,[shoulder,0],ax,wrist,0,armWidth*.92,.11,armWidth,skin);
    if (side === 1) equipment(box,[shoulder,0],ax,wrist,outfit);
  }

  facialFeatures(box,citizen.race,variant,head,headY,[headY,0],skin,hair);
  const headBox = (x,y,z,w,h,d,c) => box(JOINT.head,[headY,0],x,headY+y,z,w,h,d,c);
  if (citizen.biome === 'desert') {
    headBox(0,.128,.002,head*1.12,.059,head*1.04,biome.lining);
    headBox(-head*.43,.011,-.055,.074,.18,.183,biome.lining);
  } else if (citizen.biome === 'snow') {
    body(0,shoulder-.035,bodyDepth*.56,width*.81,.105,.049,biome.outer);
    body(width*.28,shoulder-.13,bodyDepth*.6,.076,.215,.041,biome.lining);
  } else if (citizen.biome === 'enchanted-forest') {
    headBox(head*.38,.151,.015,.078,.15,.09,biome.outer);
    headBox(head*.47,.205,.015,.13,.045,.09,biome.lining);
  } else if (citizen.biome === 'mountain') {
    body(0,shoulder-.043,-bodyDepth*.51,width*.85,.13,.07,biome.outer);
    body(-width*.28,shoulder-.13,bodyDepth*.52,.063,.16,.045,biome.outer);
  }
  if (outfit) {
    const headClothes = (x,y,z,w,h,d,c) => headBox(x*head,y,z*head,w*head,h,d*head,c);
    buildWorkClothes(outfit,{body,head:headClothes,width,shoulder,hip,depth:bodyDepth,variant});
  }
  return finish();
}

const poseActivity = {
    work:[5,1],craft:[6.5,1],tend:[3.3,.65],read:[1.8,.48],observe:[2.2,.77],
    perform:[5.2,.82],carry:[2.5,.4],interact:[5,.38],attack:[8,1],
};

export function citizenPose(action, time) {
  const walking = action === 'walk' || action === 'flee';
  const fleeing = action === 'flee';
  const activity = poseActivity[action];
  return {
    swing: walking ? Math.sin(time * (fleeing ? 10 : 8)) * (fleeing ? .77 : .45) : 0,
    lift: Math.sin(time * 3) * .011,
    action: activity ? Math.max(0, Math.sin(time * activity[0])) * activity[1] : 0,
    turn: action === 'turn' ? Math.sin(time * 3) * .42 : Math.sin(time * 1.8) * .073,
    hurt: action === 'damage' ? Math.max(0, Math.sin(time * 8)) : 0,
  };
}
