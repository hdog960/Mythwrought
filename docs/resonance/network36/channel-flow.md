# :36 N1 channel-flow candidate
Contract: resonance-network36-flow-v1. Pure, deterministic directed finite-capacity max-flow prototype, source-only.
A channel's available throughput is a nonnegative integer per simulation tick. This candidate proves one source-to-sink transfer, including serial bottlenecks and parallel paths; it does NOT allocate a shared graph among many consumers or enforce per-edge reservations across independent calls.
Integration MUST NOT call it separately for multiple consumers without a shared residual-capacity ledger; doing so would duplicate channel capacity. Production solver, saves, renderer and chunk ownership are unchanged.
Tests: tests/resonance-network36-channel-flow.test.mjs. Browser/iPhone evidence outstanding. :24 contract exact-head handshake and :48 pulses remain separate.
