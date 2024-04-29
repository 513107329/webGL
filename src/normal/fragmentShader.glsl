varying vec2 vUv;

void main() {
    // float x = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float y = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float val = x + y;
    float x = abs(vUv.x - 0.5);
    gl_FragColor = vec4(x, x, x, 1);
}