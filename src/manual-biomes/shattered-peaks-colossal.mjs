// SP2 crest trial. Use the same native source mask and clearance ceiling as
// the terrace source underneath; only the upper shape of broad peaks changes.
import { ShatteredPeaksTerraceWorld } from './shattered-peaks-terrace.mjs';

const CREST_START_Y = 202;
const CREST_FULL_Y = 219;
const CREST_LIFT = 14;
const CREST_MAX_Y = 240;

export class ShatteredPeaksColossalWorld extends ShatteredPeaksTerraceWorld {
  get terraceSourceVersion() { return 'sp2-colossal-crest-v1'; }

  _shapeSummit(rawTop) {
    const blend = Math.min(1, Math.max(0, (rawTop - CREST_START_Y) / (CREST_FULL_Y - CREST_START_Y)));
    const smooth = blend * blend * (3 - 2 * blend);
    return Math.min(CREST_MAX_Y, rawTop + Math.floor(CREST_LIFT * smooth));
  }
}
