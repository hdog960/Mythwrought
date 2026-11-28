// Source-only D6 evidence provenance gate. Never grants rendering, power or inventory authority.
export const REQUIRED_VIEWPORTS = Object.freeze(["667x375", "844x390", "932x430"]);
const plain = x => x !== null && typeof x === "object" && (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
const keys = (x, allowed) => Object.keys(x).every(k => allowed.includes(k));
const str = x => typeof x === "string" && x.length > 0 && x.length <= 128 && /^[a-zA-Z0-9._:/-]+$/.test(x);
const integer = x => Number.isSafeInteger(x) && x >= 0;
function snapshot(s) {
  if (!plain(s) || !keys(s, ["viewport","tick","revision","world","layout","safe","obstructions"]) ||
      !REQUIRED_VIEWPORTS.includes(s.viewport) || !integer(s.tick) || !integer(s.revision) ||
      !str(s.world) || !str(s.layout) || typeof s.safe !== "boolean" ||
      !Array.isArray(s.obstructions) || s.obstructions.length > 16 ||
      !s.obstructions.every(x => str(x))) throw new TypeError("invalid HUD observation");
  const obstructions = [...s.obstructions].sort();
  if (new Set(obstructions).size !== obstructions.length || s.safe !== (obstructions.length === 0))
    throw new TypeError("inconsistent HUD obstruction evidence");
  return Object.freeze({viewport:s.viewport,tick:s.tick,revision:s.revision,world:s.world,layout:s.layout,safe:s.safe,obstructions:Object.freeze(obstructions)});
}
export function auditHudEvidenceSequence(input) {
  if (!plain(input) || !keys(input,["observations","expectedWorld","expectedLayout"]) ||
      !str(input.expectedWorld) || !str(input.expectedLayout) ||
      !Array.isArray(input.observations) || input.observations.length === 0 || input.observations.length > 96)
    throw new TypeError("invalid evidence sequence");
  const groups = new Map();
  for (const raw of input.observations) {
    const s = snapshot(raw);
    if (s.world !== input.expectedWorld || s.layout !== input.expectedLayout)
      throw new TypeError("cross-world or layout evidence");
    const key = s.tick + ":" + s.revision;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  if (groups.size > 32) throw new RangeError("excess observation frames");
  const frames = [];
  for (const samples of groups.values()) {
    if (samples.length !== 3 || new Set(samples.map(s=>s.viewport)).size !== 3)
      throw new TypeError("missing or duplicate viewport");
    samples.sort((a,b)=>REQUIRED_VIEWPORTS.indexOf(a.viewport)-REQUIRED_VIEWPORTS.indexOf(b.viewport));
    frames.push(Object.freeze({tick:samples[0].tick,revision:samples[0].revision,
      safe:samples.every(s=>s.safe),samples:Object.freeze(samples)}));
  }
  frames.sort((a,b)=>a.tick-b.tick || a.revision-b.revision);
  for (let i=1;i<frames.length;i++)
    if (frames[i].tick <= frames[i-1].tick || frames[i].revision <= frames[i-1].revision)
      throw new TypeError("stale or conflicting HUD frame");
  return Object.freeze({kind:"resonance48-hud-evidence-v1",authority:"display-only",
    provenance:"caller-supplied-unverified",safe:frames.every(f=>f.safe),frames:Object.freeze(frames)});
}
