import gsap from 'gsap'
import * as THREE from 'three'

const scene = new THREE.Scene()

const starGroup = new THREE.Group()
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
    starGroup.add(points)
    scene.add(starGroup)

    return points
}

const material = new THREE.PointsMaterial({})
material.size = params.size
material.vertexColors = true
material.sizeAttenuation = true

createPoints(count)

const loader = new THREE.TextureLoader()

// r128版本之后，贴图无法直接应用于几何体的粒子系统中
// material.map = xhTexture

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setClearColor(new THREE.Color('#bebebe'))

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.z = 10

scene.add(camera)

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

// 2、小球
// Create a sphere
const sphereGroup = new THREE.Group()
const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = false;
sphereGroup.add(sphere);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
sphereGroup.add(plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
sphereGroup.add(ambientLight);

const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;

smallBall.position.copy(pointLight.position);

smallBall.add(pointLight)
sphereGroup.add(smallBall)
sphereGroup.position.y = -30
scene.add(sphereGroup)

const arr = [starGroup, sphereGroup]
pointLight.distance = 1
pointLight.decay = 0

let curPage = 0
window.addEventListener('scroll', (e) => {
    const page = Number.parseInt(window.scrollY / window.innerHeight)
    if(page !== curPage) {
        curPage = page
        gsap.fromTo(`.page${curPage + 1} h1`, { x: -300 }, { x: 0, rotation: '+=360', duration: 2 })
        gsap.to(arr[curPage].rotation, { x: `+=${Math.random()}`, y: `+=${Math.random()}` })
    }
    camera.position.y = -(window.scrollY / window.innerHeight) * 30
})

const clock = new THREE.Clock()
function animate() {
    camera.updateProjectionMatrix()

    requestAnimationFrame(animate)

    const time = clock.getElapsedTime()
    starGroup.rotation.x = Math.cos(time) * 0.1
    starGroup.rotation.z = Math.sin(time) * 0.1

    smallBall.position.x = Math.sin(time) * 3;
    smallBall.position.z = Math.cos(time) * 3;
    smallBall.position.y = 2 + Math.sin(time * 10)
    sphereGroup.rotation.x = Math.cos(time) * 0.1
    sphereGroup.rotation.z = Math.sin(time) * 0.1

    renderer.render(scene, camera)
}

animate()