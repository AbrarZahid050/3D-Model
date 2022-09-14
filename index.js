import * as THREE from "./three.js-master/build/three.module.js";
import { GLTFLoader } from "./three.js-master/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "./three.js-master/examples/jsm/loaders/RGBELoader.js";

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

console.log("running...");

const loader = new GLTFLoader();
const rgbleLoader = new RGBELoader();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
// });
// const boxMesh = new THREE.Mesh(geometry, material);
// scene.add(boxMesh);

//Lights
// const light = new THREE.DirectionalLight(0xffffff, 10);
// light.position.set(100, 50, 1);
// scene.add(light);

// const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(ambientLight);

//boilerplate
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(0.8, 0.4, 2.5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

rgbleLoader.load("./sky.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  loader.load(
    "./carModel.glb",
    function (glb) {
      console.log(glb);
      const root = glb.scene;
      root.scale.set(0.5, 0.5, 0.5);
      scene.add(root);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error occurred ", error);
    }
  );
});

//renderer WEBGL
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
