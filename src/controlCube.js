import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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

    new OrbitControls(camera, renderer.domElement)

    dom.appendChild(renderer.domElement)

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera)
    }

    animate()
}