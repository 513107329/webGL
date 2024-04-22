import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import Three.js library

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

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
sphere.receiveShadow = false
scene.add(sphere);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true
scene.add(plane);
// Create axes
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

// Create a GUI
const gui = new dat.GUI();

// Add controls to the GUI

gui.add(sphere.rotation, 'x').min(0).max(10).step(0.1).name('x轴');
gui.add(sphere.rotation, 'y').min(0).max(10).step(0.1).name('y轴');
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)

const directLight = new THREE.DirectionalLight(0xffffff, 1);
directLight.position.set(10, 10, 10);
directLight.castShadow = true;
scene.add(directLight);

directLight.shadow.mapSize.width = 512;
directLight.shadow.mapSize.height = 512;
directLight.shadow.camera.near = 0.5;
directLight.shadow.camera.far = 50;

gui.add(directLight.shadow.camera, 'near').min(0).max(10).step(0.1).name('shadowCameraNear');
gui.add(directLight.shadow.camera, 'far').min(0).max(1000).step(1).name('shadowCameraFar');

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const helper = new THREE.CameraHelper( directLight.shadow.camera );
scene.add( helper );
// Update the rotation speed in the animate function
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();