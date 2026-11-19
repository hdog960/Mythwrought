// MYTHWROUGHT S4 — original one-pass sun, atmosphere, three moons, stars and clouds.
// Fullscreen triangle behind editable voxel world: no textures, new draw calls,
// ray marching or weather. All time inputs come from S1 and lunar sidecars.
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
  // Thousands of virtual source-original stars sampled per-fragment from
  // one fixed celestial lattice; no vertex lists, textures or new pass.
  'uniform float uStarVisibility,uTwinkleAngle;',
  'uniform vec2 uCloudShiftA,uCloudShiftB;',
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
  // Deterministic fixed celestial panorama. One hash lookup yields ~10k
  // virtual stars across 384x192 sky cells without per-star loops/draws.
  'if(uStarVisibility>.001&&uv.y>horizon+.025){',
  ' vec2 stellarUV=vec2(fract(uYaw/6.283185307+.5+(uv.x-.5)*uResolution.x/uResolution.y*.24),',
  ' clamp(.5+uPitch/3.14159265+(uv.y-.5)*.52,0.0,.99999));',
  ' vec2 stellarGrid=stellarUV*vec2(384.0,192.0);',
  ' vec2 starId=floor(stellarGrid);',
  ' vec2 h=fract(starId*vec2(.1031,.103));',
  ' h+=dot(h,h.yx+33.33);',
  ' float starSeed=fract((h.x+h.y)*h.x);',
  ' float nebula=1.0-smoothstep(.05,.24,abs(fract(stellarUV.y+stellarUV.x*.32)-.49));',
  ' sky=mix(sky,vec3(.30,.25,.49),nebula*.060*uStarVisibility);',
  ' if(starSeed>.86){',
  '  vec2 offset=fract(vec2(starSeed*19.17,starSeed*31.73))*.68+.16;',
  '  vec2 dp=fract(stellarGrid)-offset;',
  '  float radiusSquared=dot(dp,dp);',
  '  if(radiusSquared<.49){',
  '   float rad=sqrt(radiusSquared);',
  '   float kernel=1.0-smoothstep(.07,.29,rad);',
  '   float halo=(1.0-smoothstep(.20,.68,rad))*.19;',
  '   float twinkle=.87+.13*sin(uTwinkleAngle+starSeed*46.0);',
  '   float warm=fract(starSeed*13.7);',
  '   vec3 pigment=mix(vec3(.69,.83,1.0),vec3(1.0,.88,.68),warm);',
  '   pigment=mix(pigment,vec3(.84,.73,1.0),smoothstep(.80,.98,warm)*.6);',
  '   float strength=(.35+.65*fract(starSeed*71.0))*twinkle*uStarVisibility;',
  '   sky=clamp(sky+pigment*strength*(kernel+halo),0.0,1.0);',
  '  }',
  ' }',
  '}',
  // Preserve the S2 low-cost painterly cloud families. S4 advances their
  // positions through S1's phase and adds a second translucent high veil.
  'vec2 cloudA=(uv-vec2(.27+.07*sin(uYaw*.25)+uCloudShiftA.x,',
  ' .77-uPitch*.25+uCloudShiftA.y))*vec2(1.0,6.0);',
  'vec2 cloudB=(uv-vec2(.56+.06*cos(uYaw*.3)+uCloudShiftB.x,',
  ' .89-uPitch*.25+uCloudShiftB.y))*vec2(1.0,7.0);',
  'float cloud=.43*(1.0-smoothstep(.08,.16,length(cloudA)))',
  '            +.33*(1.0-smoothstep(.06,.13,length(cloudB)));',
  'float strokeY=.73-uPitch*.25+uCloudShiftA.y+.025*sin(uv.x*15.0+uYaw*.3)',
  '   +.013*sin(uv.x*31.0-uYaw*.22);',
  'float wisp=(1.0-smoothstep(.008,.034,abs(uv.y-strokeY)))',
  '  *(1.0-smoothstep(.13,.38,abs(uv.x-.46-uCloudShiftA.x)));',
  'cloud+=.20*wisp;',
  'float veilY=.865-uPitch*.22+uCloudShiftB.y+.012*sin(uv.x*20.0+uYaw*.23);',
  'float veil=(1.0-smoothstep(.008,.037,abs(uv.y-veilY)))',
  '  *(1.0-smoothstep(.19,.48,abs(uv.x-.52-uCloudShiftB.x)));',
  'cloud+=.17*veil;',
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
