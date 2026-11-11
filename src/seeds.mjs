// Repeatable human-entered seed identifiers, independent from locale and platform.
// Numeric seeds wrap to signed 32-bit; text seeds use Unicode-normalized FNV-1a.
export const DEFAULT_WORLD_SEED=179;
export const SELECTED_SEED_KEY='mythwrought-v002-selected-seed';
export const LEGACY_WORLD_KEY='mythwrought-v001-world';
export function worldSeedFromText(input){
  const value=String(input).trim().normalize('NFC');
  if(!value||[...value].length>80)throw Error('Enter a seed of 1–80 characters');
  if(/^[+-]?\d+$/.test(value))return Number(BigInt.asIntN(32,BigInt(value)));
  let hash=2166136261;
  for(const c of value)hash=Math.imul(hash^c.codePointAt(0),16777619);
  return hash|0;
}
export function worldSlotKey(seed){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw Error('Invalid world seed');
  return 'mythwrought-v002-world-'+seed;
}
