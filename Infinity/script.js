console.clear();

import { FragmentShader, Texture, Uniform, DollyCamera } from 'https://cdn.skypack.dev/wtc-gl@1.0.0-beta.51';
import { Vec2, Vec3, Mat4 } from "https://cdn.skypack.dev/wtc-math@1.0.17";

const fragment = fragShader.innerText;
const vertex = `#version 300 es
in vec3 position;
in vec2 uv;
out vec2 v_uv;
void main() {
gl_Position = vec4(position, 1.0);
v_uv = uv;
}
`

const camera = new DollyCamera({},{far:1000});

const cp = new Uniform({
  name: "cp",
  value: [50,50,100],
  kind: "vec3"
})

// Create the fragment shader wrapper
const FSWrapper = new FragmentShader({
  fragment,
  vertex,
  onBeforeRender: (t) => {
    camera.update();
    
    cp.value = camera.position.multiplyNew(new Vec3(-1,1,1)).array;
  }
});
FSWrapper.playing = false;

const { gl, uniforms } = FSWrapper;

camera.setPosition(100, 100, -200.);
uniforms.u_cp = cp;

// Create the texture
const texture = new Texture(gl, {
  wrapS: gl.REPEAT,
  wrapT: gl.REPEAT
});
// Load the image into the uniform
const img = new Image();
img.crossOrigin = "anonymous";
img.src = "https://assets.codepen.io/982762/noise.png";
img.onload = () => { FSWrapper.playing = true; (texture.image = img) };

uniforms.s_noise = new Uniform({
  name: "noise",
  value: texture,
  kind: "texture"
});