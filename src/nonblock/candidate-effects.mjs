// Ambient effects are render-only. A parent key makes an effect follow a
// source-authored scenery instance's actual render and removal lifetime.
const MAX_EFFECTS=16;
const RANGE=24;
const TAU=Math.PI*2;
const wave=Math.sin;
const unit=n=>n-Math.floor(n);
const fade=p=>Math.sin(Math.PI*p);

const styles=new Map([
  ['scene48:flame',{count:6,life:.82,color:[1,.55,.18],shape:'flare',
    sample:(p,r,t)=>[.19*(r-.5)*p,.05+.63*p,.10*wave(t*9+r*7)*p,.11*(1-.7*p),.32+.60*fade(p)]}],
  ['scene48:embers',{count:9,life:2.3,color:[1,.36,.09],shape:'spark',
    sample:(p,r,t)=>[.69*(r-.5)*p,.08+1.13*p,.24*wave(t*2+r*7)*p,.020+.016*r,.70*(1-p)]}],
  ['scene48:smoke',{count:7,life:3.9,color:[.42,.45,.44],shape:'puff',
    sample:(p,r,t)=>[.32*p+.18*wave(t+r*9),.24+1.68*p,.32*(r-.5)*p,.070+.29*p,.22*fade(p)]}],
  ['scene48:flicker',{count:2,life:1.4,color:[1,.77,.30],shape:'flare',
    sample:(p,r,t)=>[.035*wave(t*18),.19+.024*wave(t*21+r*9),.02,.041+.04*p,.24+.48*fade(p)]}],
  ['scene48:magic-dust',{count:12,life:3.3,color:[.65,.43,.98],shape:'spark',
    sample:(p,r,t)=>[.44*wave(p*TAU+r*9),.22+.82*p,.44*Math.cos(p*TAU+r*9),.019+.018*r,.77*fade(p)]}],
  ['scene48:cave-drip',{count:3,life:1.75,color:[.45,.79,.96],shape:'drop',
    sample:(p,r)=>[.14*(r-.5),1.56-1.51*p*p,.03,.037+.019*p,.58+.14*fade(p)]}],
  ['scene48:spray',{count:12,life:1.09,color:[.49,.77,.90],shape:'spark',
    sample:(p,r)=>[.98*p*Math.cos(r*TAU),.08+.91*4*p*(1-p),.73*p*wave(r*TAU),.022+.020*r,.64*(1-p)]}],
  ['scene48:mist',{count:8,life:6.4,color:[.65,.76,.78],shape:'mist',
    sample:(p,r,t)=>[1.30*(p-.5),.13+.12*r,.70*wave(r*TAU+t*.17),.25+.26*p,.22*fade(p)]}],
  ['scene48:wisps',{count:6,life:4.5,color:[.38,.85,.78],shape:'wisp',
    sample:(p,r,t)=>[.73*wave(t*.58+p*TAU+r),.29+.96*p,.47*Math.cos(p*TAU+r),.068+.06*r,.38*fade(p)]}],
  ['scene48:pollen',{count:12,life:5.1,color:[.93,.77,.36],shape:'spark',
    sample:(p,r,t)=>[1.12*(p-.5),.16+.54*r+.09*wave(t+r*7),.64*wave(r*11),.020+.014*r,.72*fade(p)]}],
  ['scene48:snow-gust',{count:13,life:2.9,color:[.83,.92,.99],shape:'drop',
    sample:(p,r,t)=>[1.57*(p-.5),.42+.62*r-.35*p,.57*wave(r*TAU+t*.46),.021+.028*r,.65*fade(p)]}],
  ['scene48:surface-ripples',{count:2,life:2.4,color:[.40,.72,.77],shape:'ripple',
    sample:(p,r)=>[.045*r,.025,.030*r,.064+.61*p,.47*(1-p)]}]
]);

export const EFFECT_IDS=Object.freeze([...styles.keys()]);

export function readCandidateEffectLayout(url) {
  if(!['localhost','127.0.0.1'].includes(url.hostname) || !url.searchParams.has('nonblock-stage'))
    return [];
  const value=url.searchParams.get('nonblock-fx');
  if(value===null)return [];
  if(value.length>8192)throw new RangeError('Oversized staging effect layout');
  return JSON.parse(value);
}

function hash(id,anchor,seed,index) {
  let state=2166136261;
  for(const char of [seed,id,...anchor,index].join(':'))
    state=Math.imul(state^char.charCodeAt(0),16777619);
  return (state>>>0)/4294967296;
}

function particle(out,anchor,style,[dx,dy,dz,size,alpha]) {
  if(alpha<.025)return;
  const [x,y,z]=[anchor[0]+dx,anchor[1]+dy,anchor[2]+dz];
  const material=23+Math.min(.92,alpha);
  const tri=(a,b,c)=>out.push(...a,...style.color,0,0,material,
    ...b,...style.color,0,0,material,...c,...style.color,0,0,material);
  if(style.shape==='ripple'){
    const ring=(angle,r)=>[x+Math.cos(angle)*r,y,z+Math.sin(angle)*r];
    for(let i=0;i<12;i++){
      const a=TAU*i/12,b=TAU*(i+1)/12;
      const outer1=ring(a,size),outer2=ring(b,size);
      const inner1=ring(a,size*.86),inner2=ring(b,size*.86);
      tri(outer1,outer2,inner2);
      tri(outer1,inner2,inner1);
    }
    return;
  }
  const proportions={
    flare:[.62,2.6],spark:[.7,1],puff:[1.2,1.05],drop:[.54,1.7],mist:[2.7,.33],wisp:[1.3,.88]
  };
  const [width,height]=proportions[style.shape].map(scale=>size*scale);
  const a=[x,y+height,z], b=[x,y-height*.48,z];
  for(const [side1,side2] of [
    [[x-width,y,z],[x+width,y,z]],
    [[x,y,z-width],[x,y,z+width]]
  ]){
    tri(a,side1,side2);
    tri(b,side2,side1);
  }
}

export function prepareCandidateEffects(layout) {
  if(!Array.isArray(layout)||layout.length>MAX_EFFECTS)throw new TypeError('Invalid staged effect layout');
  const effects=layout.map(row=>{
    const id=row?.sceneId,style=styles.get(id);
    const anchor=row?.anchor,parentKey=row?.parentKey??null;
    if(!style||!Array.isArray(anchor)||anchor.length!==3||
      !anchor.every(n=>Number.isInteger(n)&&Math.abs(n)<10_000)||
      parentKey!==null&&(typeof parentKey!=='string'||parentKey.length>160))
      throw new TypeError('Invalid staged effect');
    return {id,style,anchor:anchor.map((n,i)=>n+(i===1?0:.5)),parentKey};
  });
  return ({seconds,seed,viewer,parents})=>{
    const visible=effects.map(effect=>({...effect,
      distance:Math.hypot(...effect.anchor.map((n,i)=>n-viewer[i]))
    })).filter(effect=>effect.distance<RANGE&&(!effect.parentKey||parents.has(effect.parentKey)))
      .sort((a,b)=>b.distance-a.distance);
    const output=[];
    for(const {id,anchor,style} of visible){
      for(let i=0;i<style.count;i++){
        const r=hash(id,anchor,seed,i);
        const p=unit(seconds/style.life+r+i/style.count);
        particle(output,anchor,style,style.sample(p,r,seconds));
      }
    }
    return {instances:visible.length,vertices:new Float32Array(output)};
  };
}
