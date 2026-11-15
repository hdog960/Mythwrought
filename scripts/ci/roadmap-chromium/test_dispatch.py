"""Pure selector contract tests. No repository writes, network, or browser."""
import unittest
from orchestrate import LANES,choose

class ScopeTests(unittest.TestCase):
    def test_all_nine_for_new_infrastructure(self):
        self.assertEqual(choose(['.github/workflows/roadmap-chromium-acceptance.yml']),list(LANES))
        self.assertEqual(choose(['scripts/ci/roadmap-chromium/run_lane.py']),list(LANES))
    def test_only_one_owned_lane(self):
        self.assertEqual(choose(['tests/block-packs/pack-2/acceptance.test.mjs']),['pack-2'])
        self.assertEqual(choose(['docs/building-pool/roadmap-4/M1_CANDIDATE_ACCEPTANCE.md']),['roadmap-4'])
    def test_multiple_owned_lanes_deduplicated(self):
        paths=['src/building-pool/roadmap-3/m1.mjs','src/block-packs/pack-1/a.mjs',
               'src/building-pool/roadmap-3/m1.mjs']
        self.assertEqual(choose(paths),['pack-1','roadmap-3'])
    def test_unrecognized_scope_fails_closed(self):
        for paths in [[],['src/main.mjs'],['tests/block-packs/pack-6/x.test.mjs']]:
            with self.assertRaises(RuntimeError):choose(paths)

if __name__=='__main__':unittest.main()
