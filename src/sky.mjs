// MYTHWROUGHT S2 — original one-pass, inexpensive atmospheric sky.
// Fullscreen triangle behind editable voxel world: no textures, new draw calls,
// ray marching, S3 moons or stars. All palette/time inputs come from S1 clock.
export const SKY_VERTEX_SHADER=[
  '#version 300 es',
  'precision highp float;',
  'void main(){',
  'vec2 p=vec2(gl_VertexID==1?3.0:-1.0,gl_VertexID==2?3.0:-1.0);',
  'gl_Position=vec4(p,0.0,1.0);',
  '}'
].join('\n');
export const SKY_FRAGMENT_SHADER=[
  '#version 300 es',
  'precision highp float;',
  'uniform vec2 uResolution,uSunScreen;',
  'uniform float uYaw,uPitch,uSunVisibility;',
  'uniform vec3 uHorizon,uZenith,uCloud,uRidge,uSkyFog,uSunColor;',
  'out vec4 outColor;',
  'void main(){',
  'vec2 uv=gl_FragCoord.xy/uResolution;',
  'float horizon=clamp(.48-uPitch*.32,.16,.84);',
  'float high=clamp((uv.y-horizon+.03)/.63,0.0,1.0);',
  'vec3 sky=mix(uHorizon,uZenith,smoothstep(0.0,1.0,high));',
  // Haze is shared with actual terrain fog for a seamless distant horizon.
  'sky=mix(uSkyFog,sky,smoothstep(horizon-.12,horizon+.12,uv.y));',
  'float ridge=horizon+.015+.028*sin(uv.x*10.0+uYaw*.75)+.014*sin(uv.x*27.0+uYaw);',
  'float ridge2=horizon-.025+.025*sin(uv.x*17.0+uYaw*1.1)+.010*sin(uv.x*41.0+uYaw*.7);',
  'sky=mix(sky,uRidge,.38*(1.0-smoothstep(ridge-.006,ridge+.010,uv.y)));',
  'sky=mix(sky,uRidge*.88,.26*(1.0-smoothstep(ridge2-.006,ridge2+.010,uv.y)));',
  // A camera-projected 3D orbital sun: sky-space position changes with clock
  // AND player look direction. No stationary painted sun or extra triangles.
  'float sunDistance=length((uv-uSunScreen)*vec2(uResolution.x/uResolution.y,1.0));',
  'float glow=(1.0-smoothstep(.045,.29,sunDistance))*uSunVisibility;',
  'sky=mix(sky,uSunColor,.32*glow);',
  'float disc=(1.0-smoothstep(.035,.043,sunDistance))*uSunVisibility;',
  'sky=mix(sky,uSunColor,disc);',
  // Existing low-cost painterly cloud strokes stay static until S4.
  'vec2 cloudA=(uv-vec2(.27+.07*sin(uYaw*.25),.77-uPitch*.25))*vec2(1.0,6.0);',
  'vec2 cloudB=(uv-vec2(.56+.06*cos(uYaw*.3),.89-uPitch*.25))*vec2(1.0,7.0);',
  'float cloud=.43*(1.0-smoothstep(.08,.16,length(cloudA)))',
  '            +.33*(1.0-smoothstep(.06,.13,length(cloudB)));',
  'float strokeY=.73-uPitch*.25+.025*sin(uv.x*15.0+uYaw*.3)',
  '   +.013*sin(uv.x*31.0-uYaw*.22);',
  'float wisp=(1.0-smoothstep(.008,.034,abs(uv.y-strokeY)))',
  '  *(1.0-smoothstep(.13,.38,abs(uv.x-.46)));',
  'cloud+=.20*wisp;',
  'sky=mix(sky,uCloud,clamp(cloud,0.0,.63));',
  'outColor=vec4(clamp(sky,0.0,1.0),1.0);',
  '}'
].join('\n');
// Legacy export is retained for independent renderer contracts and previous
// importers, but live rendering now uses clock-synchronized fog each frame.
export const DISTANCE_FOG_COLOR=Object.freeze([.73,.82,.70]);
