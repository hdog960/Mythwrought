# Camera follow variable frame cadence correction

The source-only camera auditor compares consecutive segment velocities at their time midpoints. For adjacent frame intervals dt1 and dt2, the acceleration denominator is (dt1 + dt2)/2, not dt2. This prevents false acceleration readings on irregular mobile frame pacing.

The historical option name `maxJerk` remains for compatibility but its units are world-units/second² (acceleration), not mathematical jerk. No live camera hook, production movement edit, touch control change or save change is included.

Eight deterministic cadence cases cover 30/60/120 FPS, acceleration spikes and asymmetric intervals. These Node fixtures are synthetic, not Chromium/WebGL2 gameplay captures or physical iPhone evidence. Production camera telemetry and offline/save/landscape acceptance remain pending.
