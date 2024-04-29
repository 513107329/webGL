import * as THREE from 'three'
import * as CANNON from 'cannon-es'
// 场景
const scene = new THREE.Scene()

// 平面
const planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.position.y = -5
plane.rotation.x = -Math.PI / 2
scene.add(plane)
// 光源
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directLight = new THREE.DirectionalLight(0xffffff, 1)
directLight.position.y = 20
directLight.castShadow = true
scene.add(directLight)

// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 10

// 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// physical world
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

const physicalPlane = new CANNON.Plane()
const planeWorldMaterial = new CANNON.Material('plane');
const groundBody = new CANNON.Body({
    mass: 0,
    shape: physicalPlane,
    material: planeWorldMaterial
  })
  groundBody.position.set(0, -5, 0)
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

world.addBody(groundBody)

const audio = new Audio('assets/audio/zj.mp3')
// 创建立方体
const cubeArr = []
const cubeWorldMaterial = new CANNON.Material('default');
function createCube() {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    cube.position.y = 5
    scene.add(cube)

    const physicalCube = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    const cubeBody = new CANNON.Body({
        mass: 1,
        shape: physicalCube,
        material: cubeWorldMaterial
    })
    cubeBody.position.set(0, 5, 0)
    cubeBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0,0,0))
    world.addBody(cubeBody)

    cubeBody.addEventListener('collide', function(e) {
        const impact =  e.contact.getImpactVelocityAlongNormal()
        if(impact > 0) {
            audio.currentTime = 0
            audio.play()
            audio.volume = impact / 100
        }
    })

    cubeArr.push({
        mesh: cube,
        body: cubeBody
    })
}
const defaultContactMaterial = new CANNON.ContactMaterial(
    cubeWorldMaterial,
    planeWorldMaterial
)
world.addContactMaterial(defaultContactMaterial)

document.addEventListener('click', () => {
    createCube()
})

// 动画
function animate() {
    world.fixedStep(1 / 60)
    cubeArr.forEach(item => {
        item.mesh.position.copy(item.body.position)
        item.mesh.quaternion.copy(item.body.quaternion)
    })
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()