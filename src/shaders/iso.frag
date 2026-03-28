#version 300 es

precision highp float;

in vec3 v_normal;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  vec3 color = normalize(v_normal) * 0.5 + 0.5;
  // Just set the output to a constant reddish-purple
  outColor = vec4(color, 0.9);
}