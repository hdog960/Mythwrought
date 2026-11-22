// The unchanged root npm test only globs tests/*.test.mjs; import the
// exclusively owned nested Creative Mode suite into that existing CI gate.
import './creative-mode/adapter-contract.test.mjs';
