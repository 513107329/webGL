import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const gui = new GUI()

const scene = new THREE.Scene()

const sphereGeometry = new THREE.SphereGeometry(3, 20, 20)

const material = new THREE.PointsMaterial()
    // color: 0xffffff,
    // sizeAttenuation: true,
    // size: 0.05,
    // blending: THREE.AdditiveBlending,
    // alphaMap: xhTexture,
    // transparent: true
material.size = 0.1
material.vertexColors = true
material.sizeAttenuation = true
material.color.set(0xffffff)
material.depthTest = false
material.depthWrite = false
material.blending = THREE.AdditiveBlending
gui.add(material, 'vertexColors').name('vertexColors').onChange(() => {
    material.needsUpdate = true
})
gui.add(material, 'depthWrite').name('depthWrite').onChange(() => {
    material.needsUpdate = true
})

const loader = new THREE.TextureLoader()
const xhTexture = loader.load('assets/images/point/5.png')

// r128版本之后，贴图无法直接应用于几何体的粒子系统中
material.map = xhTexture

const points = new THREE.Points(sphereGeometry, material)

scene.add(points)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

camera.position.z = 5

scene.add(camera)

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

function animate() {
    orbitControls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()


// const pointsMaterial = new THREE.PointsMaterial({
//     size: 0.05,
//     sizeAttenuation: true,
//     vertexColors: THREE.VertexColors,
//     alphaMap: xhTexture,
//     transparent: true
// });

// const colors = [];
// for (let i = 0; i < sphereGeometry.vertices.length; i++) {
//     colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
// }
// sphereGeometry.colors = colors;

// const points = new THREE.Points(sphereGeometry, pointsMaterial);
// scene.add(points);