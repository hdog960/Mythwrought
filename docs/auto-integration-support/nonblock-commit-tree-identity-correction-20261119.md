# :12 Git commit/tree identity correction — 2026-11-19

Status: opt-in candidate only. NOT a production bridge or live persistence acceptance.

The prior witness erroneously required a Git **tree** SHA to equal the producer **commit** HEAD. Git commits and root trees are distinct objects. The validator now requires separately supplied `expectedHeads[lane]` (commit identity) and `commitTrees[lane]` (root tree identity), with `trees[lane].sha` matching the latter. Missing or mismatched commit-tree evidence fails closed.

The caller MUST independently retrieve each exact producer commit and extract its `commit.tree.sha`, then retrieve that root tree and its entries. The gate does not fetch GitHub itself, and a caller-supplied `commitTrees` map is **not cryptographic proof** that the tree belongs to the commit. The six-file 2026-11-19 manifest is a historical snapshot; current producer heads have moved and require refreshed tree membership and bytes.

Producer PR checkpoints observed in this run: :48 #226 `648533d4c796861ac4dbda20a54cf13beb99d932`; :24 #247 `94b0b2dacc9935706cc0f9d3934703514102803f`; :36 #249 `05d19fcc25b22a958ee452659a3e946af407ce8e`. Historical :12 #206 remains `aedabf1d3e6250f16e3495ec77bdc056fafc1f46`.

Acceptance still requires source-byte authentication, real :00 PICK/BREAK/TOMBSTONE/RELOAD, schema-1 backup compatibility, orientation-safe identity and genuine three-size Chromium WebGL2. No objects are registered or spawned, no production files touched.
