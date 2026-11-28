// Acid B: configurable, disabled-by-default resource transaction proposals.
// No global recipes, item IDs, chemistry, machine state or inventory mutation.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const symbol=s=>typeof s==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(s);
const keys=(o,names)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&
  Object.keys(o).length===names.length&&names.every(k=>Object.hasOwn(o,k));
const liquids=new Set(['water','lava','acid','amber-sap','liquid-resonance']);
const material=s=>symbol(s)&&!liquids.has(s);
function acidPayload(c,readAcidStrength){
  if(!keys(c,['id','units','quantities'])||c.id!=='acid'||!int(c.units,1,8)||
    !c.quantities||typeof c.quantities!=='object'||Array.isArray(c.quantities))return null;
  const q=Object.entries(c.quantities);
  if(q.length>8||q.some(([k,v])=>!/^[a-z][a-z0-9-]{0,31}$/.test(k)||!int(v,1,2**40)))return null;
  const payload=Object.freeze({id:'acid',units:c.units,quantities:Object.freeze(Object.fromEntries(q.sort(([a],[b])=>a<b?-1:a>b?1:0)))});
  const strength=readAcidStrength({...payload,x:0,y:0,z:0});
  return int(strength,0,1000)?Object.freeze({payload,strength}):null;
}
const stack=(s,id,cap)=>keys(s,['id','units'])&&s.id===id&&int(s.units,0,cap);
const makeStack=(id,units)=>Object.freeze({id,units});
export function createAcidResourceProcessing({readAcidStrength,canProcess,enabled=false,
  policyId='disabled',recipes=[],maxRecipes=32,maxStack=65536}={}){
  if(typeof readAcidStrength!=='function'||typeof canProcess!=='function'||typeof enabled!=='boolean'||
    !symbol(policyId)||(enabled&&policyId==='disabled')||!int(maxRecipes,1,128)||!int(maxStack,1,1000000)||
    !Array.isArray(recipes)||recipes.length>maxRecipes)throw new TypeError('Invalid resource processing policy');
  const catalog=new Map();
  for(const r of recipes){
    if(!keys(r,['id','kind','input','inputUnits','output','outputUnits','acidUnits','minStrength'])||
      !symbol(r.id)||catalog.has(r.id)||!['mineral-processing','alchemy'].includes(r.kind)||
      !material(r.input)||!material(r.output)||r.input===r.output||
      !int(r.inputUnits,1,maxStack)||!int(r.outputUnits,1,maxStack)||!int(r.acidUnits,1,8)||
      !int(r.minStrength,1,1000))throw new TypeError('Invalid explicit resource recipe');
    catalog.set(r.id,Object.freeze({...r}));
  }
  const list=Object.freeze([...catalog.values()]);
  function stage({recipeId,revision,canister,input,output}={}){
    if(!symbol(recipeId)||!int(revision,0,Number.MAX_SAFE_INTEGER-1))throw new TypeError('Invalid processing request');
    const recipe=catalog.get(recipeId);
    if(!enabled||!recipe)return null;
    if(!stack(input,recipe.input,maxStack)||!stack(output,recipe.output,maxStack))throw new TypeError('Invalid material stacks');
    if(canister===null)return null;
    const acid=acidPayload(canister,readAcidStrength);
    if(!acid)throw new TypeError('Invalid acid payload');
    // Whole canister only: no new dilution, solute splitting or conversion rule.
    if(acid.payload.units!==recipe.acidUnits||acid.strength<recipe.minStrength||
      input.units<recipe.inputUnits||output.units>maxStack-recipe.outputUnits)return null;
    const before=Object.freeze({canister:acid.payload,input:makeStack(input.id,input.units),output:makeStack(output.id,output.units)});
    if(canProcess(Object.freeze({policyId,recipe,revision,before}))!==true)return null;
    const after=Object.freeze({canister:null,input:makeStack(input.id,input.units-recipe.inputUnits),
      output:makeStack(output.id,output.units+recipe.outputUnits)});
    // Accounting only, NOT a second liquid, usable item, or chemical result.
    // The host assigns a unique receipt ID and atomically persists it with the
    // inventory edit. No automatic product allocation or live mutation here.
    const reagentReceipt=Object.freeze({kind:'acid-reagent-consumption',recipeId,acid:acid.payload});
    return Object.freeze({policyId,recipe,expectedRevision:revision,before,after,reagentReceipt});
  }
  return Object.freeze({recipes:list,stage});
}
