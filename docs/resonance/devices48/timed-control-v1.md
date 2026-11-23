# :48 D2 timed-control preview v1

Source-only, opt-in deterministic button-to-timed-target control. The contract `resonance48.timed-control.v1` accepts `worldId`, `controlId`, `targetId`, sequential integer `tick`, boolean `pressed`, bounded `durationTicks` (1–600) and an **observed** 0/1 `observedGrant`. Press rising edges open or restart a bounded request window. Holding never repeats. Power shortage immediately makes `active=false` without extending the window. All returned states carry `activationAuthorized=false`, `authoritativeDelivery=false` and `productionBound=false`.

This is NOT a physical gate, door, timer actuator, real allocation, renderer, inventory, collision, save or world integration. No block IDs or production registration. A caller must not treat `active` as permission to move geometry or authorize energy. :36 must independently validate any delivery contract; this preview consumes only explicit caller-provided observations, not an authenticated :36 export. Fail-closed validation rejects skipped ticks, mismatched world/control/target, invalid grants and forged previous authority.

Test evidence: 11 native Node cases passed locally before committing; committed-head Actions and actual mobile WebGL2 remain to be checked. Production main and all historical drafts remain protected. No settlement work.

Next: inspect :36 versioned read-only delivery export by SHA, add a contract adapter only if its authority boundaries are documented, and request game-owner collision/save integration separately.
