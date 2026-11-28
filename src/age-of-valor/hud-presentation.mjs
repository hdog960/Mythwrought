// AV14 presentation model and provisional rail layout, no DOM mount.
export function layoutCombatRail({width,height,leftHanded=false,scale=1}){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<640||height<320||width>3000||height>1600||typeof leftHanded!=='boolean'||!Number.isFinite(scale)||scale<1||scale>1.25)throw Error('unsupported landscape');
 const size=Math.ceil(44*scale),gap=6,rail=2*size+gap+12;if(width-rail*2<300||height<3*size+2*gap+112)throw Error('insufficient safe area');
 const zones=['attack','block','parry','dodge','target','ability'];return Object.freeze({railWidth:rail,side:leftHanded?'left':'right',buttonSize:size,controls:Object.freeze(zones.map((zone,i)=>Object.freeze({zone,x:leftHanded?6+(i%2)*(size+gap):width-rail+6+(i%2)*(size+gap),y:6+Math.floor(i/2)*(size+gap),width:size,height:size,ariaLabel:zone==='attack'?'Attack: tap light, hold heavy':zone==='block'?'Hold to block':zone})))});
}
export function projectHudPresentation(view){
 if(view?.version!==1||!view.bars||!Array.isArray(view.effects)||!Array.isArray(view.cooldowns))throw Error('invalid HUD view');
 const labels={health:'Health',stamina:'Stamina',mana:'Mana'};
 const bars=Object.entries(labels).map(([id,label])=>{const b=view.bars[id];if(!b||!Number.isFinite(b.fraction)||b.fraction<0||b.fraction>1)throw Error('invalid bar');const scale=id==='health'?1:1000;return Object.freeze({id,label,value:b.current/scale,max:b.max/scale,percent:Math.round(b.fraction*100),accessibleText:label+' '+b.current/scale+' of '+b.max/scale});});
 return Object.freeze({mode:view.mode,bars:Object.freeze(bars),target:view.target,effects:view.effects,cooldowns:view.cooldowns});
}
