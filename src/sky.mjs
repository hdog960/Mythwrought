// MYTHWROUGHT v0.03 - original low-cost high-fantasy daylight sky.
// Fullscreen triangle renders behind the real, editable voxel landscape.
// No web textures, borrowed assets, or expensive atmospheric ray marching.
export const SKY_VERTEX_SHADER = [
  '#version 300 es',
  'precision highp float;',
  'void main(){',
  'vec2 p=vec2(gl_VertexID==1?3.0:-1.0,gl_VertexID==2?3.0:-1.0);',
  'gl_Position=vec4(p,0.0,1.0);',
  '}'
].join('\n');
export const SKY_FRAGMENT_SHADER = [
  '#version 300 es',
  'precision highp float;',
  'uniform vec2 uResolution;',
  'uniform float uYaw,uPitch;',
  'out vec4 outColor;',
  'void main(){',
  'vec2 uv=gl_FragCoord.xy/uResolution;',
  'float horizon=clamp(.48-uPitch*.32,.16,.84);',
  'float high=clamp((uv.y-horizon+.03)/.63,0.0,1.0);',
  'vec3 warm=vec3(.80,.81,.73),blue=vec3(.29,.53,.79);',
  'vec3 sky=mix(warm,blue,smoothstep(0.0,1.0,high));',
  'float ridge=horizon+.015+.028*sin(uv.x*10.0+uYaw*.75)+.014*sin(uv.x*27.0+uYaw);',
  'float ridge2=horizon-.025+.025*sin(uv.x*17.0+uYaw*1.1)+.010*sin(uv.x*41.0+uYaw*.7);',
  'sky=mix(sky,vec3(.49,.61,.67),.38*(1.0-smoothstep(ridge-.006,ridge+.010,uv.y)));',
  'sky=mix(sky,vec3(.50,.53,.65),.26*(1.0-smoothstep(ridge2-.006,ridge2+.010,uv.y)));',
  'vec2 sunPos=vec2(.72+.13*sin(uYaw*.45),clamp(.77-uPitch*.25,.16,.95));',
  'float sunDistance=length((uv-sunPos)*vec2(uResolution.x/uResolution.y,1.0));',
  'float glow=1.0-smoothstep(.04,.30,sunDistance);',
  'sky=mix(sky,vec3(.94,.80,.55),.28*glow);',
  'float disc=1.0-smoothstep(.038,.046,sunDistance);',
  'sky=mix(sky,vec3(1.0,.94,.73),disc);',
  'vec2 cloudA=(uv-vec2(.27+.07*sin(uYaw*.25),.77-uPitch*.25))*vec2(1.0,6.0);',
  'vec2 cloudB=(uv-vec2(.56+.06*cos(uYaw*.3),.89-uPitch*.25))*vec2(1.0,7.0);',
  'float cloud=.43*(1.0-smoothstep(.08,.16,length(cloudA)))',
  '            +.33*(1.0-smoothstep(.06,.13,length(cloudB)));',
  // Lightweight original wispy cloud strokes add whimsical variation without
  // real-time cloud simulation, extra passes, textures, sky objects or downloads.
  'float strokeY=.73-uPitch*.25+.025*sin(uv.x*15.0+uYaw*.3)',
  '   +.013*sin(uv.x*31.0-uYaw*.22);',
  'float wisp=(1.0-smoothstep(.008,.034,abs(uv.y-strokeY)))',
  '  *(1.0-smoothstep(.13,.38,abs(uv.x-.46)));',
  'cloud+=.20*wisp;',
  'sky=mix(sky,vec3(.99,.96,.91),clamp(cloud,0.0,.63));',
  'outColor=vec4(sky,1.0);',
  '}'
].join('\n');
export const DISTANCE_FOG_COLOR=Object.freeze([.73,.82,.70]);
