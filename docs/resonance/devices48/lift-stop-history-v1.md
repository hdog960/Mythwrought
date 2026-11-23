# :48 D2 lift stop history v1 (source-only)

Consumes only the versioned `resonance48-lift-intertick-occupancy-v1` advisory outputs, at most 16 contiguous frames per world/lift. Captures stop/clear observations and bounded consecutive-clear count. Does **not** command movement, transport passengers, bind collision, infer power delivery, or authorize production. An obstruction on the latest frame requires stop; a later clear observation merely clears that advisory state. Historical first obstruction remains visible. A missing tick, forged authority, wrong world, or incompatible contract throws rather than guessing. A fresh window is required on world/lift changes.

This module never touches game actors, saves, renderer, or other owners' paths. :36 delivery receipts and a game-owned physics bridge remain mandatory for any future live lift. Three-size genuine WebGL2 and old-save regression still pending. No settlement work.
