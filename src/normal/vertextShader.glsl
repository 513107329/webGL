varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 modelPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(modelPosition, 1.0);
}