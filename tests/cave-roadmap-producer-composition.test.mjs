// Source-authenticated cross-producer cave acceptance for roadmap #240.
// Real imported cave generators only; no production runtime activation or fake
// connected-socket fixtures. All outputs must be deterministic and edit-safe.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,worldKey} from '../src/voxel.mjs';
import {LEGACY_WORLD_MIN_Y,WORLD_MIN_Y} from '../src/depth.mjs';
import {descentCells,descentConnectivity} from '../src/underground-switchback-descent.mjs';
import {upperCaveCells,UPPER_SITES} from '../src/cave-approaches/upper-network.mjs';
import {deepCaveWorld,deepCaveEvidence} from '../src/deep-cave-network.mjs';
import {deepVaultWorld,deepVaultEvidence} from '../src/deep-vault-galleries.mjs';

for(const seed of [179,1,2026,-77]){
  test('source-exact cave producers preserve old-world data and stay disjoint seed '+seed,()=>{
    const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
    const reservation=descentCells();
    assert.ok(reservation.size>1000,'real :36 physical reservation required');
    for(const site of UPPER_SITES){
      const result=upperCaveCells({seed,site,descentReservation:reservation,
        protectedCells:new Set(),editedCells:new Set(),legacyCells:()=>null});
      assert.equal(result.ok,true,'actual :36 mask must permit upper cave '+site.name+': '+result.reason);
      assert.ok(result.cells.size>1000,site.name+' must contain real voxel geometry');
      for(const [key,id] of result.cells){
        const [,y]=key.split(',').map(Number);
        assert.ok(y<LEGACY_WORLD_MIN_Y&&y>=WORLD_MIN_Y,key);
        assert.equal(reservation.has(key),false,'overlap with real :36 descent at '+key);
        assert.ok(id===BLOCK.AIR||id===BLOCK.DEEPSTONE,'unknown material at '+key);
      }
      assert.equal(result.handoffProposal.connectedTo36,false,
        'a proposed socket must not be mislabeled connected');
    }
    const oldDeep=deepCaveWorld(world);
    const evidence=deepCaveEvidence(world);
    assert.equal(evidence.bands.length,4,'historic :24 four-band source survived');
    assert.ok(evidence.bands.every(b=>b.samples>0));
    const vault=deepVaultWorld(oldDeep);
    const vaults=deepVaultEvidence(oldDeep);
    assert.equal(vaults.length,4,'all :36 historic deep-vault bands survived');
    for(const b of vaults){
      assert.ok(b.air>0&&b.solid>0,'vault is a physical cavern');
      assert.equal(b.failures,0,'real :24/:36 vault connector is blocked at Y='+b.floor);
    }
    // Confirm legacy surface and player edits remain authoritative when a
    // candidate deep overlay is queried; this alone is NOT Home Screen proof.
    const k=worldKey(104,-75,84),baseline=world.get(104,-75,84);
    world.edits.set(k,BLOCK.STONE);
    assert.equal(vault.get(104,-75,84),BLOCK.STONE);
    world.edits.delete(k);
    assert.equal(world.get(104,-75,84),baseline);
    const descent=descentConnectivity(world);
    assert.equal(descent.connected,true,'full-depth :36 route fails physical walk trace');
    assert.equal(descent.surfaceConnected,false,'legacy surface opening is not yet integrated');
    assert.equal(JSON.stringify(world.save()),before,'read-only cave validation changed save bytes');
  });
}
