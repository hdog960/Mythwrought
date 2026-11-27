// Dependency-free fixtures; usable by Node runner or injected exact-source JS harness.
export function runLavaFixtures(lava,core=null){
  const {LAVA_DEFINITION:d,lavaQuantities:q,readLavaHeat:heat,createLavaVent:vent,visitLavaVent:visit,lavaExposure:exposure,proposeLavaCooling:cool,proposeWaterLava:react,WATER_LAVA_REACTION:rule,describeLavaQuench:ledger}=lava;
  const eq=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error("expected "+JSON.stringify(b)+", got "+JSON.stringify(a));};
  const throws=f=>{let ok=false;try{f();}catch{ok=true;}if(!ok)throw new Error("expected throw");};
  const cell=(id,units,quantities={})=>Object.freeze({x:0,y:0,z:0,id,units,quantities:Object.freeze(quantities)});
  const cases=[];
  const test=(name,fn)=>{fn();cases.push(name);};
  test("descriptor is slower than full-cell gravity",()=>eq(d,{id:"lava",gravityLimit:2,lateralLimit:1}));
  test("heat initialization and invalid heat rejection",()=>{eq(q(3,80),{"lava-heat":240});eq(heat(cell("lava",3,q(3))),240);eq(heat(cell("lava",1,{"lava-heat":101})),null);eq(heat(cell("lava",1,{other:1})),null);throws(()=>q(9));});
  test("finite default and explicit renewable opt-in",()=>{eq(vent({x:0,y:0,z:0}).remaining,8);throws(()=>vent({x:0,y:0,z:0,remaining:null}));throws(()=>vent({x:0,y:0,z:0,renewable:true}));eq(vent({x:0,y:0,z:0,renewable:true,remaining:null}).renewable,true);throws(()=>vent({x:0,y:257,z:0}));});
  test("vent rejects blocked insert without spending budget",()=>{const s=vent({x:0,y:0,z:0,remaining:3});const r=visit({getCell:()=>null,insert:()=>false},s);eq(r.inserted,0);eq(r.state,s);});
  test("vent skips foreign liquid and invalid lava quantity",()=>{const s=vent({x:0,y:0,z:0});for(const c of [cell("water",1),cell("lava",1,{other:1})])eq(visit({getCell:()=>c,insert:()=>{throw Error("should not insert");}},s).inserted,0);});
  test("vent clamps to free capacity and remaining resource",()=>{const s=vent({x:0,y:0,z:0,rate:8,remaining:3});let args;const r=visit({getCell:()=>cell("lava",7,q(7)),insert:(...a)=>{args=a;return true;}},s);eq(args,[0,0,0,"lava",1,q(1)]);eq(r.state.remaining,2);eq(r.state.emitted,1);eq(s.remaining,3);});
  test("cooling preserves heat and proposes partial material, not full block",()=>{const c=cell("lava",3,q(3,2));const p=cool(c,{lossPerUnit:4});eq([p.consumeLava,p.solidUnits,p.releasedHeat,p.nextHeat,p.fullVoxelCandidate],[3,3,6,0,false]);eq(heat(c),6);});
  test("warm cooling and exposure are read-only signals",()=>{const c=cell("lava",4,q(4,80)),p=cool(c);eq([p.consumeLava,p.releasedHeat,p.nextHeat],[0,16,304]);eq(exposure({cell:c,fill:0.5}),{id:"lava",fill:0.5,heat:320,heatPerUnit:80});eq(exposure({cell:c,fill:1}),null);eq(cool(c,{lossPerUnit:0}),null);});
  test("quench conservation and partial voxel safeguard",()=>{const a=cell("water",2),b=cell("lava",5,q(5,81)),p=react(a,b);eq(p,{consumeA:2,consumeB:2,product:"lava-quench"});eq(ledger({a,b,...p}),{waterUnits:2,steamUnits:2,lavaUnits:2,solidUnits:2,releasedHeat:162,remainingLavaHeat:243,fullVoxelCandidate:false});eq(ledger({a,b,...p,consumeA:1}),null);});
  test("unknown water or lava quantities fail closed",()=>{eq(react(cell("water",1,{other:1}),cell("lava",1,q(1))),null);eq(react(cell("water",1),cell("lava",1,{other:1})),null);});
  test("whole-cell cooling only marks a candidate",()=>{eq(cool(cell("lava",8,{})).fullVoxelCandidate,true);});
  test("vent snapshot version and overflow guards",()=>{const s=vent({x:1,y:-210,z:1,remaining:2,emitted:Number.MAX_SAFE_INTEGER});eq(visit({getCell:()=>null,insert:()=>{throw Error("overflow");}},s).inserted,0);eq(vent(JSON.parse(JSON.stringify(s))),s);throws(()=>vent({...s,version:2}));});
  if(core){
    const make=(open=()=>true,snapshot=null)=>core.createLiquidEngine({isLoaded:()=>true,isOpen:open,definitions:[{id:"water",gravityLimit:8,lateralLimit:8},d],reactionRules:[rule],snapshot});
    test("actual core: slow gravity and proportional heat transfer",()=>{const e=make();eq(e.insert(0,1,0,"lava",8,q(8)),true);e.tick(1);eq(e.getCell(0,0,0).units,2);eq(heat(e.getCell(0,0,0)),160);eq(e.getCell(0,1,0).units,6);eq(heat(e.getCell(0,1,0)),480);});
    test("actual core: lateral transfer bounded by one",()=>{const e=make((x,y,z)=>y===0&&z===0&&x>=0&&x<=1);e.insert(0,0,0,"lava",8,q(8));e.tick(1);eq(e.getCell(1,0,0).units,1);eq(heat(e.getCell(1,0,0)),80);});
    test("actual core: finite vent depletion and snapshot restoration",()=>{let e=make((x,y,z)=>x===0&&y===0&&z===0);let s=vent({x:0,y:0,z:0,rate:2,remaining:3});let r=visit(e,s);s=r.state;eq(r.inserted,2);e=make((x,y,z)=>x===0&&y===0&&z===0,JSON.parse(JSON.stringify(e.save())));s=vent(JSON.parse(JSON.stringify(s)));r=visit(e,s);eq(r.inserted,1);eq(visit(e,r.state).inserted,0);eq(e.getCell(0,0,0).units,3);eq(heat(e.getCell(0,0,0)),240);});
    test("actual core: reaction dispatch symmetric and nonmutating",()=>{const e=make();e.insert(0,0,0,"water",8);e.insert(1,0,0,"lava",8,q(8));const before=e.save();const p=e.proposeReaction(0,0,0,1,0,0),reverse=e.proposeReaction(1,0,0,0,0,0);eq(p,reverse);eq(ledger(p).solidUnits,8);eq(ledger(p).steamUnits,8);eq(e.save(),before);eq(e.proposeReaction(0,0,0,2,0,0),null);});
    test("actual core: 100 bounded ticks conserve finite mass and heat",()=>{const e=make((x,y,z)=>x>=-2&&x<=2&&z>=-2&&z<=2&&y>=0&&y<=3);e.insert(0,3,0,"lava",8,q(8,83));for(let i=0;i<100;i++)e.tick(4);const cs=e.save().cells;eq(cs.reduce((n,c)=>n+c.units,0),8);eq(cs.reduce((n,c)=>n+heat(c),0),664);});
  }
  return Object.freeze(cases);
}
