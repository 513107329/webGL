import { TextureLoader } from "three";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('loading start')
}
loadingManager.onEnd = () => {
    console.log('loading end')
}

const divElement = document.createElement('div')
function addLoading(progress) {
    if(progress === 100) {
        document.body.removeChild(divElement)
        return
    }
    divElement.style.position = 'fixed'
    divElement.style.top = '0'
    divElement.style.left = '0'
    divElement.style.bottom = '0'
    divElement.style.right = '0'
    divElement.style.backgroundColor = 'rgba(0,0,0,0.5)'
    divElement.style.display = 'flex'
    divElement.style.justifyContent = 'center'
    divElement.style.color = '#fff'
    divElement.style.alignItems = 'center'
    divElement.textContent = progress + '%'
    document.body.appendChild(divElement)
}

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log('正在加载：', url)
    const progress = itemsLoaded / itemsTotal * 100
    console.log("加载进度:", itemsLoaded / itemsTotal * 100 + "%")
    addLoading(progress)
}

const loader = new TextureLoader(loadingManager);

const doorColorTexture = loader.load("assets/images/texture/color.png")

const alphaTexture = loader.load("assets/images/texture/alpha.jpeg")

const ambientTexture = loader.load("assets/images/texture/ambientOcclusion.jpeg")

const roughnessTexture = loader.load("assets/images/texture/roughness.jpeg")

const metalnessTexture = loader.load("assets/images/texture/metalness.jpeg")

const normalTexture = loader.load("assets/images/texture/normal.jpeg")

const displacementTexture = loader.load("assets/images/texture/height.jpeg")

const scene = new THREE.Scene()

const cubeGeometry = new THREE.BoxGeometry(5,5,5, 100, 100, 100)

const plane = new THREE.PlaneGeometry(5,5, 100, 100)

cubeGeometry.setAttribute('uv2', new THREE.Float32BufferAttribute(cubeGeometry.attributes.uv.array, 2))
plane.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.attributes.uv.array, 2))

const material = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: alphaTexture,
    transparent: true,
    aoMap: ambientTexture,
    side: THREE.DoubleSide,
    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture,
    normalMap: normalTexture,
    displacementMap: displacementTexture,
    displacementScale: 0.2
})

const mesh = new THREE.Mesh(cubeGeometry, material)

const planeMesh = new THREE.Mesh(plane, material)

scene.add(mesh)

planeMesh.position.x = 5

scene.add(planeMesh)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 10

const ambientLight = new THREE.AmbientLight(0xffffff, 1)

scene.add(ambientLight)

const directLight = new THREE.DirectionalLight(0xffffff, 1)

directLight.position.set(5,5,5)

scene.add(directLight)

const axesHelper = new THREE.AxesHelper(10)

scene.add(axesHelper)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true;

document.body.appendChild(renderer.domElement)

function animate() {
    controls.update()
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
}

animate()