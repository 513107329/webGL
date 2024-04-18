import { 
    Scene, 
    PerspectiveCamera, 
    WebGLRenderer, 
    LineBasicMaterial,
    BufferGeometry,
    Line,
    Vector3
} from "three";

const scene = new Scene()
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

camera.position.z = 100

camera.lookAt(0,0,0)

const material = new LineBasicMaterial({ color: 0x0000ff });

const points = [];
points.push(new Vector3(-10, 0, 10))
points.push(new Vector3(0, 10, 0))
points.push(new Vector3(10, 0, 0))
points.push(new Vector3(10, 0, 10))
points.push(new Vector3(0, 10, 10))
points.push(new Vector3(-10, 0, 0))
points.push(new Vector3(-10, 0, 10))

const geometry = new BufferGeometry().setFromPoints(points)

const line = new Line(geometry, material)

scene.add(line)

renderer.render(scene, camera)