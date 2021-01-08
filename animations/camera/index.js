function init () {
  const scene = new THREE.Scene ();
  const gui = new dat.GUI ();
  const clock = new THREE.Clock ();

  const enableFog = false;

  if (enableFog) {
    scene.fog = new THREE.FogExp2 (0xffffff, 0.2);
  }

  const plane = getPlane (30);
  const directionalLight = getDirectionalLight (1);
  const sphere = getSphere (0.05);
  const boxGrid = getBoxGrid (10, 1.5);

  plane.name = 'plane-1';
  boxGrid.name = 'boxGrid';

  plane.rotation.x = Math.PI / 2;
  directionalLight.position.x = 13;
  directionalLight.position.y = 10;
  directionalLight.position.z = 10;
  directionalLight.intensity = 2;

  scene.add (plane);
  directionalLight.add (sphere);
  scene.add (directionalLight);
  scene.add (boxGrid);

  gui.add (directionalLight, 'intensity', 0, 10);
  gui.add (directionalLight.position, 'x', 0, 20);
  gui.add (directionalLight.position, 'y', 0, 20);
  gui.add (directionalLight.position, 'z', 0, 20);

  // const camera = new THREE.PerspectiveCamera (
  //   45,
  //   window.innerWidth / window.innerHeight,
  //   1,
  //   1000
  // );

  const camera = new THREE.OrthographicCamera (-15, 15, 15, -15, 1, 1000);

  camera.position.x = 10;
  camera.position.y = 18;
  camera.position.z = -18;

  camera.lookAt (new THREE.Vector3 (0, 0, 0));

  const renderer = new THREE.WebGLRenderer ();
  renderer.shadowMap.enabled = true;
  renderer.setSize (window.innerWidth, window.innerHeight);
  renderer.setClearColor ('rgb(120, 120, 120)');
  document.getElementById ('webgl').appendChild (renderer.domElement);

  const controls = new THREE.OrbitControls (camera, renderer.domElement);

  update (renderer, scene, camera, controls, clock);

  return scene;
}

function getBox (w, h, d) {
  const geometry = new THREE.BoxGeometry (w, h, d);
  const material = new THREE.MeshPhongMaterial ({
    color: 'rgb(120, 120, 120)',
  });
  const mesh = new THREE.Mesh (geometry, material);
  mesh.castShadow = true;

  return mesh;
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
  const geometry = new THREE.PlaneGeometry (size, size);
  const material = new THREE.MeshPhongMaterial ({
    color: 'rgb(120, 120, 120)',
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh (geometry, material);
  mesh.receiveShadow = true;

  return mesh;
}

function getSphere (size) {
  const geometry = new THREE.SphereGeometry (size, 24, 24);
  const material = new THREE.MeshBasicMaterial ({
    color: 'rgb(255, 255, 255)',
  });
  const mesh = new THREE.Mesh (geometry, material);

  return mesh;
}

function getPointLight (intensity) {
  const light = new THREE.PointLight (0xffffff, intensity);
  light.castShadow = true;

  return light;
}

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

function update (renderer, scene, camera, controls, clock) {
  renderer.render (scene, camera);

  controls.update ();

  const timeElapsed = clock.getElapsedTime ();

  const boxGrid = scene.getObjectByName ('boxGrid');
  boxGrid.children.forEach (function (child, index) {
    const x = timeElapsed * 5 + index;
    child.scale.y = (noise.simplex2 (x, x) + 1) / 2 + 0.001;
    child.position.y = child.scale.y / 2;
  });

  requestAnimationFrame (function () {
    update (renderer, scene, camera, controls, clock);
  });
}

const scene = init ();
