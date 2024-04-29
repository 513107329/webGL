import * as THREE from 'three'
import * as CANNON from 'cannon-es'
// 场景
const scene = new THREE.Scene()
// 球体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
sphere.position.y = 5
scene.add(sphere)

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
const radius = 1
const physicalSphere = new CANNON.Sphere(radius)
const sphereWorldMaterial = new CANNON.Material('default');
const sphereBody = new CANNON.Body({
    mass: 1,
    shape: physicalSphere,
    material: sphereWorldMaterial
})
sphereBody.position.set(0, 5, 0)

const physicalPlane = new CANNON.Plane()
const planeWorldMaterial = new CANNON.Material('plane');
const groundBody = new CANNON.Body({
    mass: 0,
    shape: physicalPlane,
    material: planeWorldMaterial
  })
  groundBody.position.set(0, -5, 0)
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

  const defaultContactMaterial = new CANNON.ContactMaterial(
    sphereWorldMaterial,
    planeWorldMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
  )

world.addBody(sphereBody)
world.addBody(groundBody)
world.addContactMaterial(defaultContactMaterial)

const audio = new Audio('assets/audio/zj.mp3')
sphereBody.addEventListener('collide', function(e) {
    const impact =  e.contact.getImpactVelocityAlongNormal()
    audio.currentTime = 0
    audio.play()
    audio.volume = impact / 20
})

// 动画
function animate() {
    world.fixedStep(1 / 60)
    sphere.position.copy(sphereBody.position)

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()