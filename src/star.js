import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const gui = new GUI()

const scene = new THREE.Scene()

const geometry = new THREE.BufferGeometry()
const count = 10000
const params = {
    branch: 5,
    size: 0.05,
    radius: 5,
    rotateScale: 0.3,
    startColor: '#ff0000',
    endColor: '#ffffff'
}

function generateColor(alpha) {
    const color = new THREE.Color(params.startColor)
    const moveColor = color.clone().lerp(new THREE.Color(params.endColor), alpha)
    return moveColor
}

function createPoints(count) {
    const position = new Float32Array(count * 3)
    const color = new Float32Array(count * 3)

    for(let i=0; i<count; i++) {
        const distance = params.radius * Math.random() * Math.pow(Math.random(), 3)
        const angel = ((Math.PI * 2) / params.branch) * (i % params.branch)
        const randomX = Math.pow(Math.random() * 2 - 1, 3) * (5 - distance) / 5
        const randomY = Math.pow(Math.random() * 2 - 1, 3) * (5 - distance) / 5
        const randomZ = Math.pow(Math.random() * 2 - 1, 3) * (5 - distance) / 5

        position[i*3] = Math.cos(angel + distance * params.rotateScale) * distance + randomX
        position[i*3 + 1] = 0 + randomY
        position[i*3 + 2] = Math.sin(angel + distance * params.rotateScale) * distance + randomZ

        const moveColor = generateColor(distance / params.radius)
        color[i*3] = moveColor.r
        color[i*3 + 1] = moveColor.g
        color[i*3 + 2] = moveColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    return points
}

const material = new THREE.PointsMaterial({})
material.size = params.size
// material.vertexColors = true
material.sizeAttenuation = true
gui.add(material, 'vertexColors').name('vertexColors').onChange(() => {
    material.needsUpdate = true
})
gui.add(material, 'depthWrite').name('depthWrite').onChange(() => {
    material.needsUpdate = true
})

const points1 = createPoints(count)

const loader = new THREE.TextureLoader()
const xhTexture = loader.load('assets/images/point/6.png')

// r128版本之后，贴图无法直接应用于几何体的粒子系统中
// material.map = xhTexture

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

camera.position.z = 10

scene.add(camera)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

function animate() {
    orbitControls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()