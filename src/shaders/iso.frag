#version 300 es

precision highp float;

in vec3 v_normal;
uniform vec4 u_color;
out vec4 outColor;
 
void main() {
  vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
  float ambient = 0.3;
  float diffuse = max(dot(normalize(v_normal), lightDir), 0.0);
  float light = ambient + (1.0 - ambient) * diffuse;
  outColor = vec4(u_color.rgb * light, u_color.a);
}