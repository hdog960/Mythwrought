// MYTHWROUGHT S3 — original one-pass sun, atmosphere and exactly three moons.
// Fullscreen triangle behind editable voxel world: no textures, new draw calls,
// ray marching or S4 stars. All time inputs come from S1 and lunar sidecars.
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
  // Only three source-original moons in the same existing fullscreen pass.
  'uniform vec2 uLunarScreen[3],uLunarPhase[3];',
  'uniform vec3 uLunarColor[3];',
  'uniform float uLunarRadius[3],uLunarVisibility[3];',
  'out vec4 outColor;',
  'void main(){',
  'vec2 uv=gl_FragCoord.xy/uResolution;',
  'float horizon=clamp(.48-uPitch*.32,.16,.84);',
  'float high=clamp((uv.y-horizon+.03)/.63,0.0,1.0);',
  // The original .80/.81/.73 daylight horizon remains a *live* color anchor.
  // S2 shifts that anchor smoothly to the time-of-day horizon each frame.
  'vec3 warm=vec3(.80,.81,.73);',
  'float gradient=smoothstep(0.0,1.0,high);',
  'vec3 sky=mix(warm,uZenith,gradient)+(uHorizon-warm)*(1.0-gradient);',
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
  // Bounded three-disc loop. A local branch skips expensive terminator math
  // for almost every fragment; no texture, transparency or second GPU pass.
  'for(int i=0;i<3;i++){',
  ' if(uLunarVisibility[i]<.001)continue;',
  ' vec2 local=(uv-uLunarScreen[i])*vec2(uResolution.x/uResolution.y,1.0)/uLunarRadius[i];',
  ' float r2=dot(local,local);',
  ' if(r2>6.76)continue;',
  ' float radius=sqrt(r2);',
  ' float halo=(1.0-smoothstep(1.10,2.6,radius))*.14*uLunarVisibility[i];',
  ' sky=mix(sky,uLunarColor[i],halo);',
  ' if(r2<1.09){',
  '   float z=sqrt(max(0.0,1.0-min(r2,1.0)));',
  '   float lit=smoothstep(-.09,.09,local.x*uLunarPhase[i].y+z*uLunarPhase[i].x);',
  '   float disc=1.0-smoothstep(.955,1.045,radius);',
  '   float pigment=.13+.87*lit;',
  '   sky=mix(sky,uLunarColor[i]*pigment,disc*uLunarVisibility[i]);',
  ' }',
  '}',
  'outColor=vec4(clamp(sky,0.0,1.0),1.0);',
  '}'
].join('\n');
// Legacy export is retained for independent renderer contracts and previous
// importers, but live rendering now uses clock-synchronized fog each frame.
export const DISTANCE_FOG_COLOR=Object.freeze([.73,.82,.70]);
