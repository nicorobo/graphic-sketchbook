#version 300 es

precision highp float;

in vec4 f_color;
in vec3 v_lighting;
uniform vec4 u_color;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(f_color.rgb * v_lighting, 1);
}