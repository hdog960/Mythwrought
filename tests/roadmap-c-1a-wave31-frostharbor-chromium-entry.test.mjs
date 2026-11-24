// Isolated CI-only discoverability shim: the existing unchanged npm test script
// selects tests/*.test.mjs and does NOT discover nested 1A WebGL2 test modules.
// Imports the genuine source-specific Chromium suites, preserving every original
// GL/frame/image assertion. This is NOT a proxy or a mock, and never loosens tests.
// Also the detached sunlight test in tests/ is discovered by the same npm command.
// Requires real Chrome/CDP/WebGL2 and fails closed when unavailable.
import './building-pool/roadmap-1a/m3-inn-wave31-roadmap-c-webgl2.test.mjs';
