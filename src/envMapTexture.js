import * as THREE from 'three';
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';

const loader = new RGBELoader()

const scene = new THREE.Scene();

loader.loadAsync("assets/images/build/001.hdr").then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping; // 设置映射类型
    scene.background = texture; // 设置背景
    scene.environment = texture; // 设置环境贴图
})

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

const material = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0
})

const mesh = new THREE.Mesh(sphereGeometry, material)

scene.add(mesh)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 10
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

scene.add(ambientLight)

const directLight = new THREE.DirectionalLight(0xffffff, 1)
directLight.position.set(10,10,10)
scene.add(directLight)

document.body.appendChild(renderer.domElement)
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

function animate() {
    controls.update()
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()