import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";

/*************************************
 * Debug
 ************************************ */
const gui = new GUI();

/*************************************
 * Canvas
 ************************************ */
const canvas = document.querySelector("canvas.webgl");

/*************************************
 * Scene
 ************************************ */
const scene = new THREE.Scene();

/************Axis Helper *************/
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

/*************************************
 * Loaders
 ************************************ */

/*********Loading Manager *********/
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("Loading started");
};
loadingManager.onLoad = () => {
  console.log("Loading complete");
};
loadingManager.onProgress = () => {
  console.log("Loading Processing ");
};
loadingManager.onError = () => {
  console.log("Loading Error");
};

//Texture Loader
const textureLoader = new THREE.TextureLoader(loadingManager);

//Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/draco/");

//GLTF Loader
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

/*************************************
 * Materials
 ************************************ */
//Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //ad a basic red material

/************Load Model **************/
gltfLoader.load("/static/models/Room_Baked.glb", (gltf) => {
  console.log(gltf.scene);
  scene.add(gltf.scene); //Add the imported model scene to THREE.js scene

  //the 'traverse' method executes a callback function in all the objects
  gltf.scene.traverse((child) => {
    child.material = bakedMaterial;
  });
});

/*************************************
 * Sizes
 ************************************ */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const pixelRatio = Math.min(window.devicePixelRatio, 2);

/*************************************
 * Camera
 ************************************ */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  100
);
camera.position.set(10.7, 6.6, 10.1);

/*************************************
 * Controls
 ************************************ */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; //Smooth animation

/*************************************
 * Resize
 ************************************ */
window.addEventListener("resize", () => {
  //Update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera aspect
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update render
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(pixelRatio);
});

/*************************************
 * Renderer
 ************************************ */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(pixelRatio);

/*************************************
 * Animate Loop
 ************************************ */
//Clock() was deprecated use Timer() instead

// const clock = new THREE.Clock();

// const tick = () => {
//   const getEleapsedTime = clock.getElapsedTime;
//   console.log(tick);

//   //update controls
//   controls.update();

//   //render
//   renderer.render(scene, camera); //re render the scene in the next frame

//   //Call the tick again in the next frame in an infinit loop
//   window.requestAnimationFrame(tick);
// };

const timer = new THREE.Timer();

const tick = () => {
  timer.update();

  const getElapsedTime = timer.getElapsed();
  //   console.log(getElapsedTime);

  //update controls
  controls.update();

  //render
  renderer.render(scene, camera); //re render the scene in the next frame

  //Call the tick again in the next frame in an infinit loop
  window.requestAnimationFrame(tick);

  //   console.log(tick);
};

tick();

//Track Camera position when moving controls
controls.addEventListener("change", () => {
  console.log(camera.position);
});
