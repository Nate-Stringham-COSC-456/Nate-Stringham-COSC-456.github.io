#version 300 es

in vec3 aPosition;
in vec4 aColor;

uniform mat4 uPerspective;
uniform mat4 uModelView;

out vec4 vColor;

void main() {
    // Move vertex to view
    vec4 mvPosition = uModelView * vec4(aPosition, 1);

    // Apply projection and send out
    gl_Position = uPerspective * mvPosition;

    vColor = aColor;
}
