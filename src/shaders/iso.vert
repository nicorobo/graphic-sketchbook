#version 300 es

layout(location = 0) in vec4 a_position;
layout(location = 1) in vec4 a_normal;

uniform mat4 u_mvp;
uniform mat4 u_model;  // model matrix only, for normal transform
uniform vec4 u_color;

out vec3 v_normal;

void main() {
  mat3 normalMatrix = transpose(inverse(mat3(u_model)));
  v_normal = normalize(normalMatrix * a_normal.xyz);
  gl_Position = u_mvp * a_position;
}