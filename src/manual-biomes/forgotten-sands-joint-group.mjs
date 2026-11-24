// Offline detached joint monument research. No live writer, save API,
// road/settlement generation or external ownership authority.
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR,restoreFourRegionWorld} from './profile-world.mjs';
import {defineP0ModularSpan} from './forgotten-sands-modular-span.mjs';
import {beginP0GroundSurvey,p0FootprintContains,defineP0Footprint,createP0FootprintIndex} from './forgotten-sands-grounded-probe.mjs';
import {planP0OrientedApproach} from './forgotten-sands-oriented-approach.mjs';
import {beginP0NaturalConnection,walkP0NaturalConnection} from './forgotten-sands-natural-connection.mjs';
import {BLOCK,worldKey} from '../voxel.mjs';
const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
const finish=job=>{let r;do{r=job.step();}while(r.accepted===null);return r;};
// Mixed-size input is a bounded, aligned, disjoint exact-span layout,
// independently re-surveyed below. Never trust previous report metadata.
function jointSpec(input){
  if(!input.modules)return defineP0ModularSpan(input);
  if(!Array.isArray(input.modules)||input.modules.length!==3||!['x','z'].includes(input.axis))throw Error('Invalid mixed group');
  const modules=input.modules.map(defineP0Footprint),axis=input.axis;
  if(modules.some(m=>m.seed!==input.seed||![15,23,31].includes(m.size)))throw Error('Invalid mixed group source');
  const cross=axis==='x'?'z':'x',lo=axis==='x'?'minX':'minZ',hi=axis==='x'?'maxX':'maxZ';
  if(modules.some(m=>m[cross]!==modules[0][cross])||modules[2][hi]-modules[0][lo]+1!==111||
    modules[1][lo]-modules[0][hi]-1<9||modules[2][lo]-modules[1][hi]-1<9)throw Error('Invalid mixed group span');
  createP0FootprintIndex(modules,{clearance:8});
  return Object.freeze({seed:input.seed,axis,span:111,modules:Object.freeze(modules)});
}
const append=(a,b)=>{for(const n of b){const p=a.at(-1);if(p&&p.x===n.x&&p.z===n.z&&p.feet===n.feet)continue;a.push(n);}};
export function researchP0JointGroup(source,input,{reserved,ownerRevision}={}){
  if(!(source instanceof FourRegionWorld)||source.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
    typeof reserved!=='function'||typeof ownerRevision!=='function')throw Error('Explicit research source and reservation revision required');
  const epoch=ownerRevision();
  if(typeof epoch!=='string'||!epoch.length)throw Error('Invalid research owner revision');
  const save=JSON.stringify(source.save()),profile=source.generationProfile;
  const base=restoreFourRegionWorld(JSON.parse(save),profile),spec=jointSpec(input);
  const stale=()=>ownerRevision()!==epoch||source.generationProfile!==profile||JSON.stringify(source.save())!==save;
  // A missing, throwing or nonboolean owner answer never means free space.
  const veto=(x,z)=>{if(ownerRevision()!==epoch)return true;return reserved(x,z)!==false;};
  const deny=(reason,detail={})=>Object.freeze({accepted:false,reason,detail,placementAuthority:false});
  const reports=spec.modules.map(m=>finish(beginP0GroundSurvey(base,m,{reserved:veto,maxRelief:8})));
  if(reports.some(r=>!r.accepted))return deny('module-veto',reports.map(r=>r.reason));
  if(Math.max(...reports.map(r=>r.maxCap))-Math.min(...reports.map(r=>r.minCap))>8)return deny('combined-relief');
  const approaches=reports.map(r=>dirs.map((_,t)=>planP0OrientedApproach(base,r,t,{reserved:veto})).filter(a=>a.accepted));
  if(approaches.some(a=>!a.length))return deny('no-exterior-approach');
  const excluded=(x,z)=>spec.modules.some(m=>p0FootprintContains(m,x,z));
  const endpoint=a=>({x:Math.floor(a.start.x),z:Math.floor(a.start.z)});
  const edges=new Map();
  function edge(i,a,b){
    const key=[i,a.turn,b.turn].join(',');
    if(!edges.has(key))edges.set(key,finish(beginP0NaturalConnection(base,endpoint(a),endpoint(b),{reserved:veto,excluded,padding:8})));
    return edges.get(key);
  }
  function arm(r,a){
    const [dx,dz]=dirs[a.turn],nodes=[],radius=(r.site.size-1)/2;
    for(let d=0;d<=radius;d++)nodes.push({x:r.site.x+dx*d,z:r.site.z+dz*d,feet:r.floor+1});
    for(const {distance,top} of a.rows)nodes.push({x:r.site.x+dx*distance,z:r.site.z+dz*distance,feet:top+1});
    return nodes;
  }
  const combinations=[];
  for(const a of approaches[0])for(const b of approaches[1])for(const c of approaches[2])
    combinations.push([a,b,c]);
  combinations.sort((a,b)=>a.reduce((n,x)=>n+x.addedCells,0)-b.reduce((n,x)=>n+x.addedCells,0)||
    a[0].turn-b[0].turn||a[1].turn-b[1].turn||a[2].turn-b[2].turn);
  const failures={};let trials=0;
  for(const choices of combinations){
    trials++;
    if(stale())return deny('stale-research-source');
    const e0=edge(0,choices[0],choices[1]),e1=edge(1,choices[1],choices[2]);
    if(!e0.accepted||!e1.accepted){failures['corridor-veto']=(failures['corridor-veto']??0)+1;continue;}
    const proposed=(x,y,z)=>{
      let value=null;
      for(const a of choices){const p=a.proposedBlock(x,y,z);if(p===null)continue;
        if(value!==null)throw Error('Overlapping module proposal');value=p;}
      return value;
    };
    const get=(x,y,z)=>{
      const p=proposed(x,y,z),original=base.get(x,y,z);
      if(p!==null&&(original!==BLOCK.AIR||base.edits.has(worldKey(x,y,z))))throw Error('Original source overlap');
      return p??original;
    };
    const view=Object.freeze({seed:base.seed,get,generationProfile:base.generationProfile,
      edits:Object.freeze({has:k=>base.edits.has(k),get:k=>base.edits.get(k),get size(){return base.edits.size;}}),
      rotationAt:(x,y,z)=>base.rotationAt(x,y,z),_columnPlan:(x,z)=>new Map(base._columnPlan(x,z))});
    const arms=reports.map((r,i)=>arm(r,choices[i])),nodes=[];
    append(nodes,arms[0]);append(nodes,e0.nodes);append(nodes,[...arms[1]].reverse());
    append(nodes,arms[1]);append(nodes,e1.nodes);append(nodes,[...arms[2]].reverse());
    // Same physical state travels through all three chambers, without resets
    // between the two natural corridors. Reverse is independently walked.
    const f=walkP0NaturalConnection(view,nodes),b=walkP0NaturalConnection(view,[...nodes].reverse());
    if(!f.ok||!b.ok){const k=f.reason??b.reason;failures[k]=(failures[k]??0)+1;continue;}
    let proposedCells=0,apronCells=0;
    for(let i=0;i<3;i++){
      const m=reports[i].site,a=choices[i];
      for(let x=m.minX-8;x<=m.maxX+8;x++)for(let z=m.minZ-8;z<=m.maxZ+8;z++)
        for(let y=0;y<=reports[i].maxY;y++){
          const p=a.proposedBlock(x,y,z);if(p===null)continue;
          if(base.get(x,y,z)!==BLOCK.AIR||base.edits.has(worldKey(x,y,z))||veto(x,z))return deny('source-overlap-or-owner-veto',{x,y,z});
          proposedCells++;if(!p0FootprintContains(m,x,z))apronCells++;
        }
    }
    if(stale())return deny('stale-research-source');
    return Object.freeze({accepted:true,placementAuthority:false,continuousFoundation:false,span:111,
      turns:Object.freeze(choices.map(a=>a.turn)),trials,proposedCells,apronCells,addedPathCells:0,
      nodes:Object.freeze(nodes.map(Object.freeze)),forward:f.frames,back:b.frames,view,
      corridorNodes:Object.freeze([e0.nodes.length,e1.nodes.length]),snapshotCurrent:()=>!stale(),
      publicationStatus:()=>Object.freeze({authorized:false,reason:stale()?'stale-research-source':'live-owner-atomic-writer-not-installed'})});
  }
  return deny('no-joint-native-route',{trials,failures,edges:edges.size});
}
