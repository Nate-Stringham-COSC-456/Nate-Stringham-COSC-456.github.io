import { initShaders } from "../../src/init-shaders";

const vertexShaderSource = `#version 300 es

    in vec4 aPosition;

    void main()
    {
      gl_Position = aPosition;
    }
`;

const fragmentShaderSource = `#version 300 es

    precision mediump float;

    out vec4  fColor;

    void main()
    {
        fColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }
`;

const canvas = document.querySelector("canvas")!;

const gl = canvas.getContext("webgl2");

if (gl == undefined) {
  throw new Error("WebGL2 not supported");
}

const points = new Float32Array([-1, -1, 0, 1, 1, -1]);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1, 1, 1, 1);

const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
