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
camera.position.z = 10;

scene.add(camera);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
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

const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;
// scene.add(pointLight);

smallBall.position.copy(pointLight.position);

smallBall.add(pointLight)
scene.add(smallBall)

// pointLight.shadow.mapSize.width = 2048;
// pointLight.shadow.mapSize.height = 2048;
// pointLight.shadow.camera.fov = 45;
pointLight.distance = 1
pointLight.decay = 0
gui.add(pointLight, "distance").min(0).max(50).step(0.1).name("distance");
gui.add(pointLight, "decay").min(0).max(1).step(0.1).name("decay");

const helper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(helper);

gui
  .add(pointLight.shadow.camera, "fov")
  .min(0)
  .max(90)
  .step(0.1)
  .name("fov")
  .onChange(() => {
    helper.update()
    pointLight.shadow.camera.updateProjectionMatrix();
  });
gui
  .add(pointLight.shadow.camera, "near")
  .min(0)
  .max(10)
  .step(0.1)
  .name("shadowCameraNear")
  .onChange(() => {
    pointLight.shadow.camera.updateProjectionMatrix();
  });
gui
  .add(pointLight.shadow.camera, "far")
  .min(0)
  .max(50)
  .step(0.1)
  .name("shadowCameraFar")
  .onChange(() => {
    pointLight.shadow.camera.updateProjectionMatrix();
  });

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const clock = new THREE.Clock();
// Update the rotation speed in the animate function
function animate() {
    const time = clock.getElapsedTime();
    smallBall.position.x = Math.sin(time) * 3;
    smallBall.position.z = Math.cos(time) * 3;
    smallBall.position.y = 2 + Math.sin(time * 10)
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
