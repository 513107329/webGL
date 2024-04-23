import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const gui = new GUI()

const scene = new THREE.Scene()

const geometry = new THREE.BufferGeometry()
const count = 1000

function createPoints(count) {
    const position = []
    const color = []

    for(let i=0; i<count; i++) {
        const x = Math.random() * 6 - 3
        const y = Math.random() * 6 - 3
        const z = Math.random() * 6 - 3

        position[i*3] = x
        position[i*3 + 1] = y
        position[i*3 + 2] = z

        color[i*3] = Math.random()
        color[i*3 + 1] = Math.random()
        color[i*3 + 2] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3))
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    return points
}

const material = new THREE.PointsMaterial()
material.size = 0.1
material.vertexColors = true
material.sizeAttenuation = true
material.depthTest = false
material.depthWrite = false
material.blending = THREE.AdditiveBlending
gui.add(material, 'vertexColors').name('vertexColors').onChange(() => {
    material.needsUpdate = true
})
gui.add(material, 'depthWrite').name('depthWrite').onChange(() => {
    material.needsUpdate = true
})

const points1 = createPoints(1000)
const points2 = createPoints(1000)
const points3 = createPoints(1000)

const loader = new THREE.TextureLoader()
const xhTexture = loader.load('assets/images/point/5.png')

// r128版本之后，贴图无法直接应用于几何体的粒子系统中
material.map = xhTexture

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4)

gui.add(camera, 'far').min(0).max(20).step(0.01).name('Farest').onChange(() => {
    camera.updateProjectionMatrix()
})

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

camera.position.z = 5

scene.add(camera)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

function animate() {
    orbitControls.update()
    requestAnimationFrame(animate)

    points1.rotation.x += 0.01
    points2.rotation.x += 0.01
    points2.rotation.z += 0.01
    points3.rotation.x += 0.01
    points3.rotation.z += 0.02
    renderer.render(scene, camera)
}

animate()