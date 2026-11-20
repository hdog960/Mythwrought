// Builder B Roadmap B 1B Wave6: original dry-harbor administrative office, no boats, water or gameplay enabled.
// Chosen only from the checksum-frozen B115 reserved 1B slots. Unregistered, no saves or world edits.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const TIDEHOLLOW_HARBOR_OFFICE_ID='r1:harbor-office:temperate:small:003';
export function buildTidehollowCrosswharfHarborOffice(){
 const b=sourcePlan('harbor-office','temperate','small',3,'Tidehollow Crosswharf Harbor Office',46,26,43);
 const wings=[[14,2,33,13],[4,10,19,33],[27,10,43,34],[12,29,36,40],[16,14,31,31],[2,28,13,39]],
  court=[21,19,25,24],foot=new Set(),roofs=new Map(),K=(x,z)=>x+','+z;
 for(const [x0,z0,x1,z1] of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)foot.add(K(x,z));
 for(let x=court[0];x<=court[2];x++)for(let z=court[1];z<=court[3];z++)foot.delete(K(x,z));
 const has=(x,z)=>foot.has(K(x,z));
 for(const k of foot){const[x,z]=k.split(',').map(Number);b.put(x,0,z,'foundation','live:stone');
  if(!has(x-1,z)||!has(x+1,z)||!has(x,z-1)||!has(x,z+1))
   for(let y=1;y<=7;y++)b.put(x,y,z,'wall','live:wood');
 }
 for(const [axis,fixed,lo,hi,gaps] of [
  ['x',19,14,33,[18,19,24,25,29,30]],
  ['x',27,13,33,[18,19,24,25,29,30]],
  ['z',29,12,37,[18,19,24,25,31,32]],
  ['z',15,14,33,[18,19,24,25,29,30]],
  ['z',25,27,43,[33,34,37,38]]
 ])for(let n=lo;n<=hi;n++){const x=axis==='x'?fixed:n,z=axis==='z'?fixed:n;
  if(!has(x,z)||gaps.includes(n))continue;
  for(let y=1;y<=4;y++)if(b.clear(x,y,z))b.put(x,y,z,'partition','live:wood');
 }
 for(const [x0,z0,x1,z1,base,label] of [
  [14,2,33,13,13,'north-register-long-weathervane'],
  [4,10,19,33,10,'west-low-archive-net-shed'],
  [27,10,43,34,15,'east-water-chart-signal-monitor'],
  [12,29,36,40,13,'south-bill-of-lading-twin-gable'],
  [16,14,31,31,17,'bridged-administrative-lantern-roof'],
  [2,28,13,39,9,'outside-rescue-kit-lean']
 ]){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z)||roofs.has(K(x,z)))continue;
   const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/5);
   roofs.set(K(x,z),y);
   if(b.clear(x,y-1,z))b.put(x,y-1,z,'support','live:wood','north',{physicalWeatherDeck:true,loadPending:true});
   b.put(x,y,z,'roof','pack3:023','north',{sourceOriginalMass:label,rainSealPending:true});
  }
 }
 for(const [x,z] of [[22,6],[31,6],[9,18],[11,29],[37,18],[39,29],[22,35],[32,35],[18,18],[29,18],[7,33]]){
  const y=roofs.get(K(x,z));if(!y)throw Error('Tidehollow roof post misses actual source '+K(x,z));
  b.support(x,z,y-1,'live:wood','tidehollow-independent-timber-post');
 }
 for(const [x,z,side] of [
  [20,2,'north'],[29,2,'north'],[4,19,'west'],[4,25,'west'],
  [43,19,'east'],[43,31,'east'],[18,40,'south'],[31,40,'south'],[2,34,'west']
 ]){if(!has(x,z))throw Error('Tidehollow glazed exterior off true footprint '+K(x,z));b.pane(x,z,side);}
 for(const room of [
  ['north-harbor-register',15,3,32,12],
  ['west-crew-record-archive',5,11,18,28],
  ['east-signal-and-chart-office',28,11,42,25],
  ['east-crate-supply-gallery',28,26,42,33],
  ['central-dry-wharf-reporting',17,15,30,30],
  ['south-port-assembly-room',13,30,35,39],
  ['low-west-rescue-kit-store',3,29,12,38]
 ])b.room(...room);
 for(const [from,to,x,z] of [
  ['outside','north-harbor-register',24,2],
  ['north-harbor-register','west-crew-record-archive',18,12],
  ['north-harbor-register','east-signal-and-chart-office',30,13],
  ['west-crew-record-archive','central-dry-wharf-reporting',19,22],
  ['east-signal-and-chart-office','central-dry-wharf-reporting',27,23],
  ['east-signal-and-chart-office','east-crate-supply-gallery',35,25],
  ['central-dry-wharf-reporting','south-port-assembly-room',24,29],
  ['south-port-assembly-room','low-west-rescue-kit-store',12,34],
  ['west-crew-record-archive','low-west-rescue-kit-store',9,28]
 ]){if(!has(x,z))throw Error('Tidehollow portal is on absent building plot '+K(x,z));b.opening(x,z);b.portal(from,to,x,z);}
 for(const [x,z,label] of [
  [25,7,'inert-voyage-registration'],[11,19,'inert-sail-crew-ledger'],
  [36,19,'inert-water-chart-rack'],[37,30,'inert-dry-crate-inventory'],
  [24,35,'inert-crosswharf-meeting-table'],[7,34,'inert-rescue-line-store']
 ])if(has(x,z)&&b.clear(x,1,z))b.fitting(x,z,label,'pack4:059');
 return b.finish('Six contrasting actual roof volumes and seven interlinked administrative wings around thirty truly absent-ground sunlit dry courtyard columns, port charts, public registry and low west rescue hut, with no water, boats, NPC, navigation or trading behavior enabled',{
  exclusiveAuthor:'Builder B Roadmap B 1B original Wave6',
  dryHarborSiteOnly:true,requiresActualWaterBoundarySurvey:true,realTerrainGradePreflight:false,
  boatSimulation:false,shippingEconomy:false,npcBehavior:false,waterPhysics:false,
  sourceOnly:true,creatorArtworkApproved:false,physicalPackABICertified:false,
  liveRegistered:false,worldPlacement:false,saveSchema1Written:false,productionDeployed:false
 });
}
