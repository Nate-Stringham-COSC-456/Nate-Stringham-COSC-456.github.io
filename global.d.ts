/// <reference types="vite/client" />

declare module "*.glsl" {
  const shaderSource: string;
  export default shaderSource;
}

declare module "*.vert" {
  const shaderSource: string;
  export default shaderSource;
}

declare module "*.frag" {
  const shaderSource: string;
  export default shaderSource;
}
