import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// ******* Setting up Shapes
// Create sphere
// geometry is just shape
const geometry = new THREE.SphereGeometry(3, 64, 64);
// material is how the object should look like
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.4
});
// mesh is combination of geometry n material
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

console.log(mesh.position);

// ******* Setting up Lights
// const light = new THREE.HemisphereLight(0xffffbb, 0x0, 1);
const light = new THREE.PointLight(0xffffff, 150, 100);
light.position.set(0, 10, 10);

scene.add(light);

// ******* Setting up Camera
// Camera: the thing which we see on the screen is what the camera is looking at!
// it can be different types like orthographic n perspective
// 1st parameter: Field of View (45 is standard; greater than 50, distortion will happen at the edges)
// 2nd, 3rd parameter: Aspect Ratio of the camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
// these numbers can be of anything like meters, centi-meters, kms, : depending on what ur working on!
scene.add(camera);

// ******* Setting up Renderer
// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// ******* Setting up Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;

// Initially, we won't be able to see the sphere becoz the camera n sphere are overlapping each other

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.width) * 255),
      150,
    ];
    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    })
  }
});
