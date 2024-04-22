import { AxesHelper, BoxGeometry, Clock, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { gsap } from "gsap";

for(let i = 0; i < 4; i++) {
    const scene = new Scene()
    const dom = document.getElementsByClassName(`grid_${i+1}`)[0]
    const camera = new PerspectiveCamera(75, dom.clientWidth / dom.clientHeight, 0.1, 1000);
    const geometry = new BoxGeometry(5,5,5)
    const material = new MeshBasicMaterial({ color: 0xffff00 })
    const cube = new Mesh(geometry, material)
    camera.position.z = 20
    scene.add(cube)

    const renderer = new WebGLRenderer()
    renderer.setSize(dom.clientWidth, dom.clientHeight)
    dom.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器阻尼
    controls.enableDamping = true

    const axesHelper = new AxesHelper(10)
    scene.add(axesHelper)

    // 缩放
    // cube.scale.set(2,3,1)

    // const clock = new Clock()
    function animate() {
        // 使用clock代替time参数
        // const delta = clock.getDelta()
        // const elapsed = clock.getElapsedTime()
        // if(elapsed > 5) clock.stop()
        // else console.log(delta, elapsed)
        requestAnimationFrame(animate);
        controls.update()
        // 旋转
        // cube.rotation.x += 0.01
        // cube.rotation.order = 'YXZ'
        // 修改物体位置，使用requestAnimationFrame的时间参数，实现平滑的动画效果
        // const t = (time / 1000) % 5
        // const t = elapsed % 5
        // const l = t  * 1
        // cube.position.x = l
        // if(cube.position.x >= 5)  cube.position.x = 0

        renderer.render(scene, camera)
    }

    // gsap设置动画
    const animation =  gsap.to(cube.position, { 
        x: 5,
        y: 0,
        duration: 4,
        ease: "slow(0.7,0.7,false)",
        repeat: 10,
        yoyo: true,
        onUpdate: animate,
        onStart: () => console.log('start'),
        onComplete: () => console.log('complete')
      });

      document.addEventListener('click', () => {
        if(animation.isActive()) {
            animation.pause()
        } else {
            animation.resume()
        }
      })

      gsap.to(cube.rotation, { 
        x: Math.PI,
        duration: 4,
        ease: "slow(0.7,0.7,false)",
        repeat: 10,
        yoyo: true,
        onUpdate: animate 
      });
}