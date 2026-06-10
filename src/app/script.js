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
  35,
  sizes.width / sizes.height,
  0.1,
  200
);
camera.position.set(18.17, 8.04, 16.74);

/*************************************
 * Controls
 ************************************ */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; //Smooth animation
controls.dampingFactor = 0.05;
controls.minDistance = 12;
controls.maxDistance = 35;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = Math.PI / 2;

controls.update;

/*********Controls Orbit GUI Debbuger *********/
const limits = gui.addFolder("Limits");
limits
  .add(controls, "minDistance")
  .min(0)
  .max(100)
  .step(0.1)
  .name("Zoom min distance")
  .onChange(() => {
    controls.update();
  });

limits
  .add(controls, "maxDistance")
  .min(0)
  .max(100)
  .step(0.1)
  .name("Zoom max distance")
  .onChange(() => {
    controls.update();
  });

limits
  .add(controls, "minPolarAngle")
  .min(0)
  .max(Math.PI)
  .step(0.1)
  .name("Vertical scroll min")
  .onChange(() => {
    controls.update();
  });

limits
  .add(controls, "maxPolarAngle")
  .min(0)
  .max(Math.PI)
  .step(0.1)
  .name("Vertical Scroll max")
  .onChange(() => {
    controls.update();
  });

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
//Basic material
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //ad a basic red material

// //Baked Material
// const bakedTexture = textureLoader.load("/static/textures/Night_Texture_1.jpg");
// bakedTexture.colorSpace = THREE.SRGBColorSpace; //specify the texture color space
// const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
// bakedTexture.flipY = false; //flip texture in the vertical axis

//Create a object with the realtive path of our baked textures
const enviromentMap = {
  texture_1: textureLoader.load("/static/textures/Night_Texture_1.jpg"),
  texture_2: textureLoader.load("/static/textures/Texture_Night_2.jpg"),
  texture_3: textureLoader.load("/static/textures/Texture_Night_3.jpg"),
};

//Create an empty object to store our Mesh Basic Material
const bakedMaterials = {};

//Iterate thru every key pair on our object usin the method 'Object.entrie'
//The Object.entries() method returns an array of the key/value pairs of an object.
Object.entries(enviromentMap).forEach(([key, textureObj]) => {
  textureObj.colorSpace = THREE.SRGBColorSpace; //Change color space to SRGB
  textureObj.flipY = false; //flip texture
  bakedMaterials[key] = new THREE.MeshBasicMaterial({ map: textureObj }); //push the new Mesh Material Object into the empty s using the same key
});

/************Load Model **************/
//Create a new group to add all our meshes
const meshGroup = new THREE.Group();
meshGroup.position.set(-0.01, -4, -0.3);
scene.add(meshGroup); //add the group to the scene

gltfLoader.load("/static/models/First_Bake.glb", (gltf) => {
  console.log(gltf.scene);
  //   scene.add(gltf.scene); //Add the imported model scene to THREE.js scene
  meshGroup.add(gltf.scene); //Add the import model to the THREE group

  //the 'traverse' method executes a callback function in all the objects
  gltf.scene.traverse((child) => {
    child.material = bakedMaterials.texture_1;
  });
});

gltfLoader.load("/static/models/Second_Bake.glb", (gltf) => {
  console.log(gltf.scene);
  //   scene.add(gltf.scene);
  meshGroup.add(gltf.scene);

  gltf.scene.traverse((child) => {
    child.material = bakedMaterials.texture_2;
  });
});
gltfLoader.load("/static/models/Third_Bake.glb", (gltf) => {
  console.log(gltf.scene);
  //   scene.add(gltf.scene);
  meshGroup.add(gltf.scene);

  gltf.scene.traverse((child) => {
    child.material = bakedMaterials.texture_3;
  });
});

meshGroup.position.set(3.6, -0.8, 4.1);

/************GUI Debugger for Models **************/
//Create a  ne Debug folder and add the model postion(x,y,z)
const folder = gui.addFolder("Model Position");
folder.add(meshGroup.position, "x").min(-10).max(10).step(0.1).name("Target X");

folder.add(meshGroup.position, "y").min(-10).max(10).step(0.1).name("Target Y");

folder.add(meshGroup.position, "z").min(-10).max(10).step(0.1).name("Target Z");

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
