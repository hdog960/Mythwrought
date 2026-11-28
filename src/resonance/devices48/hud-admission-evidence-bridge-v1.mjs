/** Source-only bridge from deterministic HUD admission reports to evidence frames. */
import {VIEWPORTS48} from './viewport-admission-v1.mjs';
import {auditHudEvidenceSequence} from './hud-evidence-sequence-v1.mjs';
const validId = x => typeof x === 'string' && x.length > 0 && x.length <= 128 && /^[a-zA-Z0-9._:/-]+$/.test(x);
const own = (x,k) => Object.prototype.hasOwnProperty.call(x,k);
const plain = x => x !== null && typeof x === 'object' && (Object.getPrototypeOf(x) === Object.prototype || Object.getPrototypeOf(x) === null);
const int = x => Number.isSafeInteger(x) && x >= 0;
export function bridgeHudAdmissionEvidence({world,layout,tick,revision,reports}) {
  if (!validId(world) || !validId(layout) || !int(tick) || !int(revision) || !Array.isArray(reports) || reports.length !== 3) throw new TypeError('invalid evidence bridge input');
  const observations = reports.map(report => {
    if (!plain(report) || !['schema','revision','viewport','admitted','blockers','authority'].every(k=>own(report,k)) || Object.keys(report).length !== 6 ||
        report.schema !== 'resonance48-hud-admission-v1' || report.authority !== 'display-only' || report.revision !== revision || typeof report.admitted !== 'boolean' ||
        !plain(report.viewport) || Object.keys(report.viewport).length !== 2 || !int(report.viewport.width) || !int(report.viewport.height) ||
        !Array.isArray(report.blockers) || report.blockers.length > 16 || !report.blockers.every((x,i)=>int(x) && x < 32 && (i===0 || report.blockers[i-1] < x)) ||
        report.admitted !== (report.blockers.length === 0)) throw new TypeError('invalid or inconsistent admission report');
    const viewport = VIEWPORTS48.find(v=>v.width===report.viewport.width && v.height===report.viewport.height);
    if (!viewport) throw new TypeError('unsupported viewport');
    return {viewport:`${viewport.width}x${viewport.height}`,tick,revision,world,layout,safe:report.admitted,obstructions:report.blockers.map(n=>`reserved:${n}`)};
  });
  const evidence = auditHudEvidenceSequence({expectedWorld:world,expectedLayout:layout,observations});
  return Object.freeze({kind:'resonance48-admission-evidence-bridge-v1',authority:'display-only',provenance:'caller-supplied-unverified',safe:evidence.safe,evidence});
}
