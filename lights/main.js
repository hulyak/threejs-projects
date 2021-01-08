// console.log (THREE);

function init () {
  const scene = new THREE.Scene ();
  const gui = new dat.GUI ();

  const enableFog = false;
  //Adding fog to the scene
  if (enableFog) {
    scene.fog = new THREE.FogExp2 (0xffffff, 0.2); //color and density
  }

  // const box = getBox (1, 1, 1);
  const plane = getPlane (30);
  const directionalLight = getDirectionalLight (1); //we can use pointLight, spotLight too
  const sphere = getSphere (0.05);
  const boxGrid = getBoxGrid (10, 1.5);
  const helper = new THREE.CameraHelper (directionalLight.shadow.camera);
  // const ambientLight = getAmbientLight(1);

  plane.name = 'plane-1';

  // box.position.y = box.geometry.parameters.height / 2; //get the height
  plane.rotation.x = Math.PI / 2;
  // directionalLight.position.x = 13;
  directionalLight.position.y = 4;
  // directionalLight.position.z = 10;
  directionalLight.intensity = 2;
  // plane.rotation.y = 1;

  //ui controller
  gui.add (directionalLight, 'intensity', 0, 10); //range
  gui.add (directionalLight.position, 'x', 0, 20);
  gui.add (directionalLight.position, 'y', 0, 20);
  gui.add (directionalLight.position, 'z', 0, 20);
  // gui.add(directionalLight, 'penumbra', 0, 1)  //for spotLight

  // plane.add (box); //box is the child of plane
  // scene.add(box);
  scene.add (plane);
  directionalLight.add (sphere);
  scene.add (directionalLight);
  scene.add (boxGrid);
  scene.add (helper);
  // scene.add(ambientLight);

  const camera = new THREE.PerspectiveCamera (
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5; //position, rotation, scale

  camera.lookAt (new THREE.Vector3 (0, 0, 0));

  const renderer = new THREE.WebGLRenderer ({antialias: true});

  renderer.shadowMap.enabled = true;

  renderer.setSize (window.innerHeight, window.innerHeight);

  //we can set colors with CSS
  renderer.setClearColor ('rgb(120,120,120)');

  document.getElementById ('webgl').appendChild (renderer.domElement);

  //orbit controls
  const controls = new THREE.OrbitControls (camera, renderer.domElement);

  update (renderer, scene, camera, controls);
  return scene;
}

function getBox (w, h, d) {
  //width-height-depth
  const geometry = new THREE.BoxGeometry (w, h, d);
  const material = new THREE.MeshPhongMaterial ({color: 'rgb(120,120,120)'});
  const cube = new THREE.Mesh (geometry, material);
  cube.castShadow = true;
  return cube;
}

function getBoxGrid (amount, separationMultiplier) {
  const group = new THREE.Group ();

  for (let i = 0; i < amount; i++) {
    const obj = getBox (1, 1, 1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;
    group.add (obj);
    for (let j = 1; j < amount; j++) {
      const obj = getBox (1, 1, 1);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.position.z = j * separationMultiplier;
      group.add (obj);
    }
  }

  group.position.x = -(separationMultiplier * (amount - 1)) / 2;
  group.position.z = -(separationMultiplier * (amount - 1)) / 2;

  return group;
}

function getPlane (size) {
  //width and height signatures
  const geometry = new THREE.PlaneGeometry (size, size);
  const material = new THREE.MeshPhongMaterial ({
    color: 'rgb(120,120,120)',
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh (geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function getSphere (size) {
  const geometry = new THREE.SphereGeometry (size, 24, 24); //width-height
  const material = new THREE.MeshBasicMaterial ({color: 'rgb(255,255,255)'});
  const cube = new THREE.Mesh (geometry, material);

  return cube;
}

//light types
function getPointLight (intensity) {
  const light = new THREE.PointLight (0xffffff, intensity);
  light.castShadow = true;
  return light;
}

//spotlight, shadow maps
function getSpotLight (intensity) {
  const light = new THREE.SpotLight (0xffffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

function getDirectionalLight (intensity) {
  const light = new THREE.DirectionalLight (0xffffff, intensity);
  light.castShadow = true;

  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;

  return light;
}

function getAmbientLight (intensity) {
  const light = new THREE.AmbientLight ('rgb(10,30,50)', intensity);

  return light;
}

function update (renderer, scene, camera, controls) {
  renderer.render (scene, camera);
  //animation happens in update loop
  controls.update ();

  //   const plane = scene.getObjectByName ('plane-1');

  //   plane.rotation.y += 0.001; //speed
  //   plane.rotation.z += 0.001;

  // scene.traverse((child) => {
  //   chil.scale.x += 0.001;
  // })

  requestAnimationFrame (() => {
    //browser calls a  function to update an animation before the next repaint.
    update (renderer, scene, camera, controls); //recursion
  });
}

const scene = init ();
