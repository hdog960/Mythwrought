# Movement12 camera-follow evidence contract

This opt-in diagnostic accepts time-stamped player and camera positions in the same coordinate frame. It rejects missing samples, excessive player-camera distance, invalid timestamps, large sample gaps and abrupt camera acceleration. The acceleration threshold is expressed in world-units/second² (historical name maxJerk), not mathematical jerk. It deliberately does not infer camera offset, pitch, yaw or actual phone frame pacing. For an eye-height camera, subtract the intended eye offset before comparison.

The deterministic Node tests are synthetic contract tests, **not** real camera captures. Production camera telemetry and actual Chromium/WebGL2 at 667×375, 844×390 and 932×430 are still required. Do not attach this to production or modify controls, save data or flight without creator-authorized integration.
