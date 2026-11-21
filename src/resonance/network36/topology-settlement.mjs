import {topologyStorageIslands} from './topology-islands.mjs';
import {settleStorageIslands} from './storage-islands.mjs';
export const TOPOLOGY_SETTLEMENT_CONTRACT='resonance-network36-topology-settlement-v1';
// Opt-in pure adapter: topology controls island membership; ledger controls energy.
// Does not route finite edge capacity or authorize activation of individual devices.
export function settleTopologyStorage(input={}) {
 const topology=topologyStorageIslands(input);
 const settled=settleStorageIslands({islands:topology.islands});
 const islands=topology.islands.map(island=>({
   id:island.id, production:island.production, consumption:island.consumption,
   ...settled.islands[island.id]
 }));
 return {contract:TOPOLOGY_SETTLEMENT_CONTRACT,islands,disconnected:[...topology.disconnected]};
}
