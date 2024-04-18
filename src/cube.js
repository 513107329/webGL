import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'

// 新建Scene场景
const scene = new THREE.Scene()

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

// 将立方体添加到场景中
scene.add(cube)

// 设置相机位置，和上面设置的相机近平面和远平面有关，值越大的话，
// 渲染的物体显示的越小，反之亦然，当小于近平面或者大于远平面的话，
// 则无法看到物体
camera.position.z = 5

// 渲染场景
function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();

// webgl兼容性检查
if(WebGL.isWebGLAvailable) {
    animate()
} else {
    const error = WebGL.getWebGLErrorMessage()
    document.body.appendChild(error)
}