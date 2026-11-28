// SP4 material trial on the six-region physical source. Existing V8 blocks
// form tilted rock beds without changing the height, slope or save contracts.
import { MOUNTAIN_V8_MATERIAL as rock } from './mountain-v8-materials.mjs';
import { planMountainSubregionAt, ShatteredPeaksSubregionWorld } from './shattered-peaks-subregions.mjs';

const bedding = {
  'crown-peaks': rock.slate,
  'emerald-highlands': rock.scree,
  'broken-ridges': rock.slate,
  'ironpine-highlands': rock.gneiss,
  'crystal-escarpments': rock.gneiss,
  'skywater-basins': rock.slate
};

export class ShatteredPeaksStrataWorld extends ShatteredPeaksSubregionWorld {
  get terraceSourceVersion() { return 'sp4-native-tilted-beds-v1'; }

  _rockMaterial(y, x, z) {
    const original = super._rockMaterial(y);
    if (y < 20) return original;
    const angle = x * .055 + z * .033 + this.seed * .017;
    const bed = y + Math.round(3 * Math.sin(angle) + 2 * Math.cos(z * .058));
    const layer = ((bed % 13) + 13) % 13;
    if (layer > 3) return original;
    return bedding[planMountainSubregionAt(x, z, this.seed)] ?? original;
  }
}
