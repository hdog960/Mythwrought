// Candidate content only. All effects require owner agreement before activation.
const plans=[
['attack','Blade Discipline','Precision','Duelist','accuracy','critical-control','riposte','Sweeping Assault','Vanguard','cleave-control','recovery','sweep','Weapon Reading','Guard Reading'],
['defense','Guard Discipline','Bulwark','Shieldbearer','block-efficiency','guard-stability','brace','Evasion','Warden','dodge-efficiency','recovery','sidestep','Armor Reading','Threat Reading'],
['strength','Power Discipline','Heavy Force','Juggernaut','physical-power','stagger-control','crush','Enduring Force','Titan','carry-efficiency','stamina-efficiency','heave','Weight Reading','Impact Reading'],
['archery','Bow Discipline','Longshot','Marksman','aim-stability','range-control','focused-shot','Skirmisher','Ranger','draw-efficiency','move-accuracy','quick-shot','Wind Reading','Target Reading'],
['sorcery','Spell Discipline','Arcane Focus','Spellweaver','spell-power','cast-stability','focus-cast','Elemental Flow','Invoker','mana-efficiency','cast-recovery','elemental-cast','Rune Reading','Element Reading'],
['constitution','Vital Discipline','Ironheart','Guardian','health-capacity','damage-resilience','fortify','Renewal','Survivor','recovery-efficiency','endurance','recover','Wound Reading','Fatigue Reading'],
['mining','Stonecraft','Deep Prospecting','Gemseeker','mineral-identification','gem-insight','survey-vein','Efficient Extraction','Stonebreaker','extraction-efficiency','tool-control','precision-cut','Vein Reading','Strata Reading'],
['woodcutting','Timbercraft','Forest Steward','Grovekeeper','tree-identification','harvest-control','survey-grove','Timber Harvest','Woodwright','cutting-efficiency','timber-control','selective-cut','Bark Reading','Canopy Reading'],
['fishing','Watercraft','Deepwater','Angler','fish-identification','depth-insight','survey-pool','Shore Fishing','Reelmaster','cast-control','reel-efficiency','steady-reel','Current Reading','Habitat Reading'],
['foraging','Wildcraft','Botany','Herbalist','plant-identification','herb-insight','survey-herbs','Resource Search','Gatherer','search-efficiency','harvest-control','selective-gather','Season Reading','Growth Reading'],
['hunting','Huntcraft','Stalker','Tracker','quarry-identification','approach-control','survey-quarry','Harvest','Provider','harvest-efficiency','resource-control','careful-harvest','Track Reading','Habitat Reading'],
['excavation','Earthcraft','Relic Study','Antiquarian','relic-identification','site-insight','survey-relic','Careful Digging','Excavator','dig-efficiency','recovery-control','careful-dig','Layer Reading','Ruin Reading'],
['agility','Footwork','Quickstep','Windrunner','acceleration-control','turn-control','quickstep','Endurance','Wayfarer','travel-efficiency','stamina-control','steady-stride','Route Reading','Terrain Reading'],
['survival','Wildernesscraft','Harsh Climate','Pathfinder','climate-resilience','hazard-insight','shelter-sense','Expedition','Trailwarden','resource-efficiency','endurance','expedition-focus','Weather Reading','Hazard Reading'],
['exploration','Wayfinding','Cartography','Cartographer','landmark-insight','map-clarity','survey-landmark','Expedition','Pioneer','route-insight','travel-control','survey-route','Horizon Reading','Depth Reading'],
['tracking','Signcraft','Trail Signs','Pathreader','track-identification','trail-insight','inspect-sign','Creature Signs','Scout','activity-insight','trail-control','survey-trail','Print Reading','Scent Reading'],
['climbing','Gripcraft','Vertical Route','Cragsman','grip-efficiency','ascent-control','steady-climb','Safe Descent','Ridgewalker','descent-control','ledge-insight','survey-ledge','Rock Reading','Ledge Reading'],
['diving','Water Discipline','Deep Dive','Deepwalker','breath-efficiency','depth-control','steady-dive','Aquatic Survey','Reefseeker','swim-control','water-insight','survey-depth','Depth Reading','Current Reading'],
['resonance','Runic Discipline','Generation','Runesmith','generation-insight','energy-efficiency','survey-generator','Networkcraft','Artificer','network-insight','delivery-control','survey-network','Rune Reading','Circuit Reading'],
['beast-mastery','Beast Lore','Companionship','Bondkeeper','bond-insight','handling-control','calm-beast','Mountcraft','Beastrider','ride-control','care-insight','survey-mount','Species Reading','Behavior Reading'],
['restoration','Healing Lore','Renewal','Mender','healing-control','recovery-efficiency','focused-mend','Protection','Lifewarden','support-control','resilience','protective-mend','Wound Reading','Remedy Reading'],
['mysticism','Mystic Lore','Arcane Inquiry','Seer','arcane-insight','ritual-control','survey-arcana','Spirit Inquiry','Oracle','spirit-insight','focus-control','survey-spirit','Symbol Reading','Omen Reading'],
['stealth','Concealment','Silent Movement','Shade','noise-control','approach-control','quiet-step','Shadowcraft','Phantom','visibility-control','escape-control','conceal','Cover Reading','Threat Reading'],
['attunement','Affinity Lore','Elemental Affinity','Elementalist','element-insight','affinity-control','element-focus','Runic Affinity','Runebound','rune-insight','focus-efficiency','rune-focus','Element Reading','Rune Reading']];
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
function create(p){const [key,root,a,ac,as,at,aa,b,bc,bs,bt,ba,side1,side2]=p, nodes=[],typedEffects=[],labels={};
  const add=(id,label,level,costs,requires,excludes,kind,payload)=>{const effect=key+':'+id;nodes.push({id,level,costs,requires:requires.map(([id,rank])=>({id,rank})),excludes,effect});typedEffects.push({id:effect,kind,contract:'fixture:'+key,payload});labels[id]=label;};
  const passive=(stat,basisPoints)=>({stat,basisPoints});
  add('foundation',root,4,[1,2,3],[],[],'passive',passive(key+'-control',100));
  add('path-a',a,16,[2,3,4],[['foundation',2]],[],'passive',passive(as,150));
  add('path-b',b,16,[2,3,4],[['foundation',2]],[],'passive',passive(bs,150));
  add('focus-a',a+' Focus',34,[3,4],[['path-a',2]],[],'passive',passive(at,200));
  add('focus-b',b+' Focus',34,[3,4],[['path-b',2]],[],'passive',passive(bt,200));
  add('capstone-a',ac,70,[5],[['focus-a',2],['path-a',3]],['capstone-b'],'active',{ability:aa});
  add('capstone-b',bc,70,[5],[['focus-b',2],['path-b',3]],['capstone-a'],'active',{ability:ba});
  add('insight-a',side1,25,[2,3],[['foundation',1]],[],'discovery',{discovery:key+'-insight-a'});
  add('insight-b',side2,50,[2,3],[['foundation',3]],[],'mastery',{milestone:key+'-insight-b'});
  return freeze({definition:{skill:'pm:'+key,nodes},typedEffects,labels});
}
export const CANDIDATE_TREES=freeze(plans.map(create));
export const getCandidateTree=skill=>CANDIDATE_TREES.find(t=>t.definition.skill===skill)??null;
