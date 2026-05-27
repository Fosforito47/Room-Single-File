import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/*************************************
 * Canvas
 ************************************ */
const canvas = document.querySelector("canvas.webgl");

/*************************************
 * Scene
 ************************************ */
const scene = new THREE.Scene();

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
  camera.aspect = cameraAspect;
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
