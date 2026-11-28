// FD3 logical graph v1; room slots and progression are NOT voxel geometry or live permissions.
const VERSION=1,W=6,H=5;
const ROLES=["gallery","guardroom","archive","crypt","workshop","sanctuary","junction","trap","puzzle","treasury"];
function rngFor(id){let n=2166136261;for(const c of id)n=Math.imul(n^c.charCodeAt(0),16777619);return max=>{n=(n+0x6d2b79f5)|0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)%max;};}

function digestGraph(graph){let n=14695981039346656037n;for(const c of JSON.stringify(graph))n=BigInt.asUintN(64,(n^BigInt(c.charCodeAt(0)))*1099511628211n);return "fd1:"+n.toString(16).padStart(16,"0");}

export function buildGraph(candidate){
 if(!candidate||candidate.version!==1||!Number.isInteger(candidate.seed)||candidate.seed!==(candidate.seed|0)||!Number.isInteger(candidate.rx)||!Number.isInteger(candidate.rz)||candidate.id!==`fd:v1:${candidate.seed}:${candidate.rx}:${candidate.rz}`||!Number.isInteger(candidate.floors)||candidate.floors<3||candidate.floors>7)throw Error("invalid candidate");
 const F=candidate.floors,rand=rngFor(candidate.id),total=80+rand(Math.min(180,F*30)-79),counts=Array(F).fill(Math.floor(total/F));for(let i=0;i<total%F;i++)counts[i]++;
 const secrets=Array(F).fill(0),secretTotal=5+rand(11);for(let i=0;i<secretTotal;i++){const options=secrets.map((n,f)=>n<Math.min(5,counts[f]-9)?f:-1).filter(f=>f>=0);secrets[options[rand(options.length)]]++;}
 const minis=Array(F).fill(0),miniTotal=3+rand(4);for(let i=0;i<miniTotal;i++){const options=minis.map((n,f)=>n<2?f:-1).filter(f=>f>=0);minis[options[rand(options.length)]]++;}
 const rooms=[],edges=[],keys=[],floors=[],edgePairs=new Set();let anchor=[0,2],previousExit=null;
 function edge(a,b,kind,keyId=null){const pair=[a.id,b.id].sort().join("|");if(edgePairs.has(pair))return false;edgePairs.add(pair);edges.push({id:`e${edges.length}`,a:a.id,b:b.id,kind,keyId});return true;}
 for(let f=0;f<F;f++){
  const cells=new Map(),core=[],local=[],cellKey=(x,z)=>x+","+z;
  function add(x,z,role,optional=false,secret=false,parent=null){
   const room={id:`r${f}.${local.length}`,floor:f,x,z,role,optional,secret};cells.set(cellKey(x,z),room);local.push(room);rooms.push(room);if(parent)edge(parent,room,secret?"hidden":"passage");return room;
  }
  function neighbors(room){return [[room.x-1,room.z],[room.x+1,room.z],[room.x,room.z-1],[room.x,room.z+1]].filter(([x,z])=>x>=0&&x<W&&z>=0&&z<H);}
  function grow(parents,role,opt,secret){const frontier=[];for(const p of parents)for(const [x,z] of neighbors(p))if(!cells.has(cellKey(x,z)))frontier.push({p,x,z});if(!frontier.length)throw Error("no frontier");const q=frontier[rand(frontier.length)];return add(q.x,q.z,role,opt,secret,q.p);}
  const entry=add(...anchor,f===0?"entrance":"landing");core.push(entry);
  const dx=entry.x===W-1?-1:entry.x===0?1:rand(2)?1:-1,dz=entry.z===H-1?-1:entry.z===0?1:rand(2)?1:-1;
  const a=add(entry.x+dx,entry.z,"hub",false,false,entry),b=add(entry.x+dx,entry.z+dz,"gallery",false,false,a),c=add(entry.x,entry.z+dz,"junction",false,false,b);edge(c,entry,"loop");core.push(a,b,c);
  const coreTarget=counts[f]-2-secrets[f];
  while(core.length<coreTarget)core.push(grow(core,ROLES[rand(ROLES.length)],false,false));
  const loopCandidates=[];for(const p of core)for(const [x,z] of neighbors(p)){const q=cells.get(cellKey(x,z));if(q&&p.id<q.id&&!edgePairs.has([p.id,q.id].sort().join("|")))loopCandidates.push([p,q]);}
  const extra=Math.min(loopCandidates.length,2+rand(4));for(let i=0;i<extra;i++){const [p,q]=loopCandidates.splice(rand(loopCandidates.length),1)[0];edge(p,q,"loop");}
  const selectable=core.slice(2);
  function take(){return selectable.splice(rand(selectable.length),1)[0];}
  // Reserve boss or stairs and keys in the connected nonoptional core.
  const exit=take();exit.role=f===F-1?"boss":"descent";
  let keyId=null;if(f<F-1){const kr=take();kr.role="key";keyId=`k${f}`;keys.push({id:keyId,room:kr.id,gateFloor:f+1});}
  for(let i=0;i<minis[f];i++)take().role="miniboss";
  const wing=grow(core,"optional-wing",true,false);const free=neighbors(wing).some(([x,z])=>!cells.has(cellKey(x,z)));grow(free?[wing]:core,"optional-wing",true,false);
  for(let i=0;i<secrets[f];i++)grow(local,"secret",true,true);
  if(previousExit)edge(previousExit,entry,"stair",`k${f-1}`);
  floors.push({floor:f,entry:entry.id,exit:exit.id,keyId});previousExit=exit;anchor=[exit.x,exit.z];
 }
 const graph={version:VERSION,dungeonId:candidate.id,seed:candidate.seed,floors,rooms,edges,keys,entrance:floors[0].entry,boss:floors.at(-1).exit};
 return Object.freeze({...graph,digest:digestGraph(graph)});
}

export function reachGraph(graph,{start=graph.entrance,keys=[],revealSecrets=false,allowOptional=true,collectKeys=false}={}){
 const have=new Set(keys),seen=new Set([start]),adj=new Map(graph.rooms.map(r=>[r.id,[]])),roomMap=new Map(graph.rooms.map(r=>[r.id,r])),keyByRoom=new Map(graph.keys.map(k=>[k.room,k.id]));
 if(!adj.has(start))throw Error("unknown start");
 for(const e of graph.edges){adj.get(e.a).push([e.b,e]);adj.get(e.b).push([e.a,e]);}
 let changed=true;while(changed){changed=false;for(const id of seen){
  const k=keyByRoom.get(id);if(collectKeys&&k&&!have.has(k)){have.add(k);changed=true;}
  for(const [to,e] of adj.get(id)){if(seen.has(to)||e.kind==="hidden"&&!revealSecrets||e.keyId&&!have.has(e.keyId)||!allowOptional&&roomMap.get(to).optional)continue;seen.add(to);changed=true;}
 }}
 return {rooms:seen,keys:have};
}

export function validateGraph(g){
 const fail=msg=>{throw Error("invalid graph: "+msg);};
 if(!g||g.version!==VERSION||!Array.isArray(g.rooms)||!Array.isArray(g.edges)||!Array.isArray(g.keys)||!Array.isArray(g.floors)||g.rooms.length<80||g.rooms.length>180||g.floors.length<3||g.floors.length>7||g.edges.length>540||g.keys.length!==g.floors.length-1)fail("bounds");
 const {digest,...body}=g;if(digest!==digestGraph(body))fail("digest");
 const rm=new Map(),positions=new Set(),pairs=new Set(),ei=new Set(),ki=new Map(),stairs=new Map();
 for(const q of g.rooms){const p=[q.floor,q.x,q.z].join(",");if(typeof q.id!=="string"||rm.has(q.id)||positions.has(p)||![q.floor,q.x,q.z].every(Number.isInteger)||q.floor<0||q.floor>=g.floors.length||q.x<0||q.x>=W||q.z<0||q.z>=H||typeof q.optional!=="boolean"||typeof q.secret!=="boolean"||q.secret&&!q.optional)fail("room");rm.set(q.id,q);positions.add(p);}
 const count=role=>g.rooms.filter(q=>q.role===role).length;
 if(count("entrance")!==1||count("boss")!==1||rm.get(g.entrance)?.role!=="entrance"||rm.get(g.boss)?.role!=="boss"||count("miniboss")<3||count("miniboss")>6||count("secret")<5||count("secret")>15||g.rooms.some(q=>q.secret!==(q.role==="secret")))fail("roles");
 for(const k of g.keys){if(ki.has(k.id)||rm.get(k.room)?.role!=="key"||rm.get(k.room)?.optional||rm.get(k.room)?.floor!==k.gateFloor-1||k.id!==`k${k.gateFloor-1}`)fail("key");ki.set(k.id,k);}
 for(const e of g.edges){const a=rm.get(e.a),b=rm.get(e.b),pair=[e.a,e.b].sort().join("|");if(!a||!b||a===b||pairs.has(pair)||ei.has(e.id)||!["passage","loop","hidden","stair"].includes(e.kind))fail("edge");pairs.add(pair);ei.add(e.id);
  if(e.kind==="stair"){const f=Math.max(a.floor,b.floor);if(Math.abs(a.floor-b.floor)!==1||a.x!==b.x||a.z!==b.z||a.optional||b.optional||e.keyId!==`k${f-1}`||!ki.has(e.keyId)||stairs.has(f))fail("stairs");stairs.set(f,e);}
  else if(a.floor!==b.floor||Math.abs(a.x-b.x)+Math.abs(a.z-b.z)!==1||e.keyId!==null||e.kind==="hidden"!== (a.secret||b.secret))fail("horizontal");
 }
 for(let f=0;f<g.floors.length;f++){const row=g.floors[f],a=rm.get(row.entry),b=rm.get(row.exit);if(row.floor!==f||a?.floor!==f||b?.floor!==f||a.optional||b.optional||a.id===b.id||a.role!==(f===0?"entrance":"landing")||b.role!==(f===g.floors.length-1?"boss":"descent")||row.keyId!==(f===g.floors.length-1?null:`k${f}`)||!g.edges.some(e=>e.kind==="loop"&&rm.get(e.a).floor===f)||!g.rooms.some(q=>q.floor===f&&q.role==="optional-wing"))fail("floor");
  if(f>0){const e=stairs.get(f);if(!e||![e.a,e.b].includes(row.entry)||![e.a,e.b].includes(g.floors[f-1].exit))fail("floor link");}
 }
 if(g.entrance!==g.floors[0].entry||g.boss!==g.floors.at(-1).exit)fail("endpoints");
 // Before each gate, its key must be accessible with earlier keys only;
 // later floors and all secret rooms must remain inaccessible.
 const prior=[];for(const row of g.floors.slice(0,-1)){
  const reached=reachGraph(g,{keys:prior,allowOptional:false}).rooms,k=ki.get(row.keyId);
  if(!reached.has(k.room)||[...reached].some(id=>rm.get(id).floor>row.floor))fail("gate progression");prior.push(k.id);
 }
 const normal=reachGraph(g,{allowOptional:false,collectKeys:true});if(!normal.rooms.has(g.boss)||g.rooms.some(q=>!q.optional&&!normal.rooms.has(q.id)))fail("mandatory reach");
 const revealed=reachGraph(g,{revealSecrets:true,collectKeys:true});if(revealed.rooms.size!==g.rooms.length)fail("full reach");
 const back=reachGraph(g,{start:g.boss,keys:[...revealed.keys],revealSecrets:true});if(!back.rooms.has(g.entrance)||back.rooms.size!==g.rooms.length)fail("return");
 return {rooms:g.rooms.length,floors:g.floors.length,loops:g.edges.filter(e=>e.kind==="loop").length,secrets:count("secret"),minibosses:count("miniboss"),keys:g.keys.length};
}

export function graphStateBinding(graph,{profile,sourceVersion}={}){
 validateGraph(graph);
 const token=v=>typeof v==="string"&&v.length>0&&v.length<=160&&/^[a-zA-Z0-9:_./-]+$/.test(v);
 if(!token(profile)||!token(sourceVersion))throw Error("invalid source binding");
 const ids=role=>graph.rooms.filter(r=>r.role===role).map(r=>r.id);
 return {identity:Object.freeze({seed:graph.seed,profile,sourceVersion,dungeonId:graph.dungeonId,layoutVersion:graph.version,layoutDigest:graph.digest}),catalog:{discovered:new Set(graph.rooms.map(r=>r.id)),openDoors:new Set(graph.edges.filter(e=>e.kind==="stair"||e.kind==="hidden").map(e=>e.id)),disarmedTraps:new Set(ids("trap").map(id=>`trap:${id}`)),solvedPuzzles:new Set(ids("puzzle").map(id=>`puzzle:${id}`)),defeatedBosses:new Set([...ids("boss"),...ids("miniboss")].map(id=>`encounter:${id}`)),claimedRewards:new Set([...ids("boss"),...ids("miniboss"),...ids("secret")].map(id=>`reward:${id}`))}};
}
