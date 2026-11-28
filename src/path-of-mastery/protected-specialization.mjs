import {createDurableSpecialization} from './durable-specialization.mjs';
import {createFixtureRecoveryPort} from './specialization-recovery.mjs';
import {fixtureRespecContext} from './outcome-contracts.mjs';
// Complete typed policy and full state validation at both recovery and allocation boundaries.
export function createProtectedFixtureSpecialization(options){
  const {scope,storage,readContext,typedEffects}=options;
  if(!Array.isArray(typedEffects)||typeof readContext!=='function')throw Error('Typed fixture required');
  const context=fixtureRespecContext(readContext);
  const validator=createDurableSpecialization({...options,readContext:context});
  const recovery=createFixtureRecoveryPort({scope,storage,readContext:context,validate:validator.validateSnapshot});
  const engine=createDurableSpecialization({...options,readContext:context,storage:recovery.port});
  return Object.freeze({engine,status:recovery.status,restoreBackup:recovery.restoreBackup});
}
