import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const axesHelper = new THREE.AxesHelper(10);

for (let i = 0; i < 50; i++) {
  const bufferArray = new Float32Array(9);

  for (let j = 0; j < 9; j++) {
    const position = Math.random() * 5 - 2.5;
    bufferArray[j] = position;
  }
  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(bufferArray, 3)
  );
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
  });

  const triangle = new THREE.Mesh(bufferGeometry, material);

  scene.add(triangle);
}

const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(axesHelper);

camera.position.z = 10;

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement);


function animate(){
    controls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera);
}

animate()