#version 300 es

in vec3 aPosition;
in vec4 aColor;

uniform mat4 uPerspective;
uniform mat4 uModelView;

out vec4 vColor;

void main() {
    gl_Position = uPerspective * uModelView * vec4(aPosition, 1);

    vColor = aColor;
}
