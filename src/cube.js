import * as THREE from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap/gsap-core'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// 新建Scene场景
const scene = new THREE.Scene({})

// 新建Renderer渲染器
const renderer = new THREE.WebGLRenderer()

// 新建Camera相机
/**
 * 75: 视野角度，
 * window.clientWidth / window.clientHeight: 宽高比
 * 0.1: 近平面，比此值还小，代表过于近平面，无法渲染
 * 1000: 远平面，比此值还大，代表过于远平面，无法渲染
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setClearColor(0xffffff, 1)

document.body.appendChild(renderer.domElement)

// 创建一个立方体
/**
 * width: 宽度
 * height: 高度
 * depth: 深度
 */
const geometry = new THREE.BoxGeometry(2,1,1)

// 创建一个材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

// 创建一个立方体
const cube = new THREE.Mesh(geometry, material)

// 添加控制
const params = { 
	color: '#ffff00',
	fn: () => {
		gsap.to(cube.position, {
			x: 5,
			yoyo: true,
			duration: 4
		})
	}
 }
 const gui = new dat.GUI({name: 'My GUI'})
const folder = gui.addFolder('设置')
folder.add(cube.position, 'x')
.min(0)
.max(5)
.step(0.01)
.name('MOVE X\'AXIS')
.onChange(value => console.log('值被修改:',value))
.onFinishChange(value => console.log('完全停下来:', value))
folder.addColor(params, 'color').name('SET COLOR').onChange(value => {
	cube.material.color.set(value)
})
folder.add(params, 'fn').name('SET ANIMATION')
folder.add(cube, 'visible').name('SET VISIBLE')
folder.add(cube.material, 'wireframe').name('SET MATERIAL')

// 将立方体添加到场景中
scene.add(cube)

// 设置相机位置，和上面设置的相机近平面和远平面有关，值越大的话，
// 渲染的物体显示的越小，反之亦然，当小于近平面或者大于远平面的话，
// 则无法看到物体
camera.position.z = 5

const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
// 渲染场景
function animate() {
	controls.update()
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();
// // webgl兼容性检查
// if(WebGL.isWebGLAvailable) {
//     animate()
// } else {
//     const error = WebGL.getWebGLErrorMessage()
//     document.body.appendChild(error)
// }

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(window.devicePixelRatio)
})

document.addEventListener('dblclick', () => {
	if(!document.fullscreenElement) {
		renderer.domElement.requestFullscreen()
	} else {
		document.exitFullscreen()
	}
})