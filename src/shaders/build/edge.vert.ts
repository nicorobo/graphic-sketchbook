export const edge_vert = "#version 300 es\nlayout(location = 0) in vec4 a_position;\nuniform mat4 u_mvp;\nvoid main() {\n  gl_Position = u_mvp * a_position;\n}";
