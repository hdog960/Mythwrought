// Cave Completion Roadmap #240: execute nested producer tests in root npm test.
// The historical verification workflow selects full mode for multi-source
// integration and otherwise omits tests nested under tests/*/.
// Importing these real producer suites avoids falsely claiming acceptance
// based on generic Node/Chromium checks alone.
import './cave-approaches/upper-network.test.mjs';
import './underground-depth/bedrock-whisper-gallery.test.mjs';
import './underground-depth/refuge-fault-reservation.test.mjs';
