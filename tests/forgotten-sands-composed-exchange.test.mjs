import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {openP0CompositeFixture} from '../src/manual-biomes/forgotten-sands-composite-fixture.mjs';
import {prepareP0ComposedExchange} from '../src/manual-biomes/forgotten-sands-composed-exchange.mjs';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current source required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const [P,H,N,S,V,P2,I2,P3,M,L,C,B,E]=await Promise.all([
 'src/manual-biomes/profile-world.mjs','src/world-height.mjs','src/world-height-natural-contract.mjs','src/world-height-stream.mjs','src/voxel.mjs','src/pack2-world.mjs','src/pack2-integration.mjs','src/builder-assets/pack3-live.mjs','src/builder-assets/manual14-mesh.mjs','src/builder-assets/manual14-layer.mjs','src/builder-assets/manual-five-pack.mjs','src/world-height-budget.mjs','src/mobs/source-edit-epoch.mjs'].map(load));
const A=await load('src/pack5-integration/live-adapter.mjs');
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
test('actual mounted Pack3, manual14 and Pack5 source meshes veto exchanged owner; real edit and rollback epochs invalidate prior evidence',async()=>{
 const f=await openP0CompositeFixture(1,{P,H,N,reserved:()=>false,revision:()=>'detached-composed-r1'}),world=new P2.Pack2LiveWorld(f.world),s=storage();
 const p3=P3.createPack3LiveBridge(world,s),m=L.createManual14SavedBridge(world,s);
 world.manual14Layer=m.layer;world.manual14Collision=box=>m.collision(box);
 const p5=A.createPack5LiveAdapter(world,{storage:s,upperRebuild:()=>{}});world.pack5Layer=p5.layer;world.pack5Collision=box=>p5.collision(box);
 const revision=E.createMobSourceRevision(world),player={x:456,feet:16,z:-122};
 const legacy=V.chunkWindow(player.x,player.z,2).map(c=>({...c,section:0})),selected=()=>S.planHeightStream(world,player,legacy);
 const args=()=>({world,player,selected:selected(),H,V,I2,P3,M14:M,B,revision,farBytes:149868});
 const initial=prepareP0ComposedExchange(args());assert.equal(initial.plan.allowed,true);assert.ok(initial.plan.removed);assert.equal(initial.revalidate(selected(),player),true);
 const key=initial.plan.removed,row=selected().find(c=>H.runtimeMeshKey(c.cx,c.cz,c.section)===key);
 const cell=[row.cx*16+4,H.runtimeSectionBounds(row.section).minY+1,row.cz*16+4],results=[];
 const checkMutation=(name,place,remove)=>{
  const a=prepareP0ComposedExchange(args());assert.equal(a.plan.removed,key);
  const before=revision(),out=place();assert.ok(out===true||out?.ok,out?.reason);
  assert.notEqual(revision(),before);assert.equal(a.revalidate(selected(),player),false);assert.equal(H.upperOccupancy(world,key),true);
  const b=prepareP0ComposedExchange(args());assert.notEqual(b.plan.removed,key);
  // Inspect even if planner has dropped the occupied owner: the actual
  // full composed mesh witness must be nonempty.
  const bytes=b.inspect(row,key);assert.ok(bytes.solidBytes+bytes.waterBytes>0);
  assert.ok(remove());assert.equal(H.upperOccupancy(world,key),false);
  assert.equal(a.revalidate(selected(),player),false,'ABA must not resurrect old evidence');
  const c=prepareP0ComposedExchange(args());assert.equal(c.plan.removed,key);
  results.push({name,bytes,occupiedDenied:true,abaDenied:true,readmitted:true,epoch:revision()});
 };
 const rebuild=()=>{},remote={x:1000,feet:16,z:1000};
 checkMutation('Pack3',()=>p3.mutate({mode:'place',cell,id:116,orientation:0,player:remote,rebuild}),()=>p3.mutate({mode:'mine',cell,rebuild}).ok);
 const asset=C.MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===9);
 checkMutation('Manual14',()=>m.placeMany([{asset:asset.symbol,numericId:9,at:cell}]),()=>m.layer.remove(cell));
 checkMutation('Pack5',()=>p5.layer.place('pack5:080',cell,0),()=>p5.layer.remove(cell));
 assert.deepEqual(f.world.save().edits,[]);
 console.log('P0 COMPOSED EXCHANGE',JSON.stringify({key,cell,initialOwners:initial.plan.owners,inspected:initial.inspected,results,placementAuthority:false}));
});
