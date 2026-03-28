#version 300 es
 
layout(location = 0) in vec4 a_position;
layout(location = 1) in vec4 a_normal;

uniform mat4 u_mvp;
uniform mat3 u_normal;
uniform vec4 u_color;

// out vec4 v_color;
out vec3 v_normal;
 
void main() {
    v_normal = normalize(u_normal * a_normal.xyz);
    gl_Position = u_mvp * a_position;
}
