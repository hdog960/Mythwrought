// Creature launch policy, not projectile physics or damage authority.
const definitions=Object.freeze({
 yeti:Object.freeze({id:'beast:yeti:ice-projectile',speed:10,radius:.18,range:12,gravity:0,lifeMs:1400}),
 cyclops:Object.freeze({id:'beast:cyclops:rock-projectile',speed:12,radius:.24,range:14,gravity:3,lifeMs:1600}),
 'storm-elemental':Object.freeze({id:'beast:storm-elemental:electric-projectile',speed:18,radius:.10,range:14,gravity:0,lifeMs:1000})
});
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const identity=s=>typeof s==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(s);
export function beastProjectilePolicy(species){return Object.hasOwn(definitions,species?.id)?definitions[species.id]:null;}
export function proposeBeastProjectile(actor,target,query,revision){
 const policy=beastProjectilePolicy(actor?.species),body=actor?.species?.body;
 if(!policy||!identity(actor.id)||!identity(target?.id)||actor.id===target.id||target.alive!==true||!point(actor.position)||!point(target.position)||!Number.isFinite(target.height)||target.height<.12||target.height>6)return null;
 try{
  const origin=[actor.position[0],actor.position[1]+body.height*.72,actor.position[2]];
  const aim=[target.position[0],target.position[1]+target.height*.65,target.position[2]];
  const delta=aim.map((v,i)=>v-origin[i]),length=Math.hypot(...delta);
  if(length<.1||length>policy.range||query.revision()!==revision||query.residentAt(origin)!==true||query.residentAt(aim)!==true||query.lineOfSight(origin,aim)!==true)return null;
  // The actual AV host still owns swept collision, launch authorization, target
  // traces and damage. No damage or hit is inferred from this proposal.
  const radius=policy.radius,probe={radius,height:radius*2,collision:'aabb'};
  if(query.volume([origin[0],origin[1]-radius,origin[2]],probe)!=='clear'||query.revision()!==revision)return null;
  const velocity=delta.map(v=>v*policy.speed/length);
  // Compensate nominal gravity for initial aim; collision owner remains final.
  velocity[1]+=policy.gravity*length/(2*policy.speed);
  return Object.freeze({version:1,sourceId:actor.id,targetId:target.id,definitionId:policy.id,terrainRevision:revision,
   origin:Object.freeze(origin),velocity:Object.freeze(velocity),radius,range:policy.range,gravity:policy.gravity,lifeMs:policy.lifeMs});
 }catch{return null;}
}
// Pass actual AV pool's launch capability and owner-supplied identity/sequence.
// No owner authorization or projectile identity is created by the creature.
export function launchBeastProjectile(pool,proposal,authorization){
 if(!proposal||!authorization||typeof pool?.launch!=='function')return false;
 const {identity,sequence}=authorization;
 if(!identity||identity.sourceId!==proposal.sourceId||identity.definitionId!==proposal.definitionId||!Number.isSafeInteger(sequence)||sequence<1)return false;
 return pool.launch({sequence,options:{identity,origin:proposal.origin,velocity:proposal.velocity,radius:proposal.radius,range:proposal.range,gravity:proposal.gravity,lifeMs:proposal.lifeMs}})===true;
}
