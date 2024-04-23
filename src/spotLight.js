import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Import Three.js library

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

scene.add(camera);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = false;
scene.add(sphere);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);
// Create axes
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

// Create a GUI
const gui = new dat.GUI();

// Add controls to the GUI

gui.add(sphere.rotation, "x").min(0).max(10).step(0.1).name("x轴");
gui.add(sphere.rotation, "y").min(0).max(10).step(0.1).name("y轴");
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(10, 10, 10);
spotLight.castShadow = true;
scene.add(spotLight);

spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 30;
spotLight.distance = 0
spotLight.angle = Math.PI / 4
spotLight.penumbra = 0.5
spotLight.decay = 1
gui.add(spotLight, "distance").min(0).max(50).step(0.1).name("distance");
gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.1).name("angle");
gui.add(spotLight, "penumbra").min(0).max(1).step(0.1).name("penumbra");
gui.add(spotLight, "decay").min(0).max(1).step(0.1).name("decay");

gui
  .add(spotLight.shadow.camera, "near")
  .min(0)
  .max(10)
  .step(0.1)
  .name("shadowCameraNear")
  .onChange(() => {
    spotLight.shadow.camera.updateProjectionMatrix();
  });
gui
  .add(spotLight.shadow.camera, "far")
  .min(0)
  .max(50)
  .step(0.1)
  .name("shadowCameraFar")
  .onChange(() => {
    spotLight.shadow.camera.updateProjectionMatrix();
  });

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const helper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(helper);
// Update the rotation speed in the animate function
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
