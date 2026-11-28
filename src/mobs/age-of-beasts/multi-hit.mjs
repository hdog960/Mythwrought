// AB11 per-species multi-hit timing. Uses existing damage owner for every
// accepted hit. No independent HP, statuses, projectile engine or XP.
const profiles=Object.freeze({
 chimera:Object.freeze({prefix:'chimera-strike',weights:Object.freeze([.35,.35,.30]),interval:8}),
 'abyssal-hydra':Object.freeze({prefix:'hydra-bite',weights:Object.freeze([.35,.325,.325]),interval:9})
});
export function multiHitProfile(record){
 const profile=profiles[record?.id],damage=record?.combat?.damage;
 if(!profile||!Number.isInteger(damage)||damage<3||damage>100000)return null;
 const first=Math.round(damage*profile.weights[0]),second=Math.round(damage*profile.weights[1]);
 return Object.freeze({prefix:profile.prefix,interval:profile.interval,amounts:Object.freeze([first,second,damage-first-second])});
}
