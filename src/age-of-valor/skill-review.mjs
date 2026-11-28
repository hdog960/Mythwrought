// Review-only fixture bridge. No live skill/XP authority.
export function projectReviewedSkillStats({identity,readOwnerReview,expectedRevision,base,health,resources,projectStats,reviewModifiers}){
 const keys=['worldId','profileId','sourceId','fixture'];
 if(!identity||identity.fixture!==true||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||!['worldId','profileId','sourceId'].every(k=>typeof identity[k]==='string'&&identity[k].length>0)||![readOwnerReview,projectStats,reviewModifiers].every(f=>typeof f==='function'))throw Error('fixture review only');
 const scope=Object.freeze(Object.fromEntries(keys.map(k=>[k,identity[k]]))),baseCopy=Object.freeze({...base}),hp=Object.freeze({...health}),rp=Object.freeze({...resources});
 const w=readOwnerReview();if(!w||w.version!==1||w.verified!==true||w.revision!==expectedRevision||!keys.every(k=>w.identity?.[k]===scope[k])||!Array.isArray(w.projections)||w.projections.length>216)throw Error('unverified skill review');
 const layer=reviewModifiers({projections:w.projections,base:baseCopy,conditionActive:()=>false});
 if(layer?.kind!=='fixture-review'||layer.authoritative!==false||!Array.isArray(layer.modifiers)||layer.modifiers.length>32||layer.modifiers.some(m=>!['accuracy','physicalAttack','magicalAttack'].includes(m.stat))||!Array.isArray(layer.unmapped))throw Error('invalid review layer');
 const after=readOwnerReview();if(after!==w)throw Error('review changed during projection');
 const output=projectStats({base:baseCopy,health:hp,resources:rp,layers:{skill:layer.modifiers}});
 return Object.freeze({kind:'fixture-review',authoritative:false,revision:expectedRevision,projected:output,unmapped:Object.freeze([...layer.unmapped])});
}
