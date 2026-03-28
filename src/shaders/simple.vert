#version 300 es
 
in vec4 a_position;
in vec4 a_color;
in vec4 a_normal;
out vec4 f_color;
out vec3 v_lighting;

uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_normal;

 
void main() {
    gl_Position = u_projection * u_modelView * a_position;
    f_color = a_color;
    vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    vec3 directionalLightColor = vec3(1, 1, 1);
    vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    vec4 transformedNormal = u_normal * vec4(a_normal);
    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    v_lighting = ambientLight + (directionalLightColor * directional);
}
