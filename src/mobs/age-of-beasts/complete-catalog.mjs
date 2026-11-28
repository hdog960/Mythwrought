// Lazy immutable candidate-only catalog. Not a live roster authority.
import {APPROVED} from './roster-contract.mjs';
import {createCompleteCandidateIndex} from './catalog-index.mjs';
import {plainsCandidate} from './plains-candidates.mjs';
import {desertCandidate} from './desert-candidates.mjs';
import {snowCandidate} from './snow-candidates.mjs';
import {forestCandidate} from './forest-candidates.mjs';
import {alpineCandidate} from './alpine-candidates.mjs';
import {caveCandidate} from './cave-candidates.mjs';
const factories={meadow:plainsCandidate,desert:desertCandidate,snow:snowCandidate,forest:forestCandidate,alpine:alpineCandidate,cave:caveCandidate};
let cached;
export function completeBeastCandidateCatalog(){
 if(cached)return cached;
 const candidates=Object.freeze(APPROVED.map(s=>factories[s.biome](s.id)));
 const index=createCompleteCandidateIndex(candidates.map(c=>c.record),candidates.map(c=>c.capability));
 const byId=new Map(candidates.map(c=>[c.record.id,c]));
 cached=Object.freeze({index,candidates,get:id=>byId.get(id)});
 return cached;
}
