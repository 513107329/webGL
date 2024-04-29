import * as THREE from 'three'
import vertexShader from './normal/vertextShader.glsl'
import fragmentShader from './normal/fragmentShader.glsl'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { TextureLoader } from 'three'

const scene = new THREE.Scene()

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// texture
const loader = new TextureLoader()
const flagTexture = loader.load('./assets/images/texture/flag.png')

// Geometry
const planeGeometry = new THREE.PlaneGeometry(1, 1, 60, 60)

// Material
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTexture: {
            value: flagTexture
        },
        uAmplitude: {
            value: 0.5
        },
        uFrequency: {
            value: 8.0
        },
        uAngularVelocity: {
            value: 4.0
        },
        uTime: {
            value: 0
        }
    }
})

const mesh  = new THREE.Mesh(planeGeometry, shaderMaterial)

scene.add(mesh)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 5

document.body.appendChild(renderer.domElement)

const axesHelper = new THREE.AxesHelper()

scene.add(axesHelper)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

const clock = new THREE.Clock()
function animate() {
    orbitControls.update()
    const elapsedTime =clock.getElapsedTime()
    shaderMaterial.uniforms.uTime.value = elapsedTime
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()