function init () {
  const scene = new THREE.Scene ();

  // camera
  const camera = new THREE.PerspectiveCamera (
    45, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near clipping plane
    1000 // far clipping plane
  );
  camera.position.z = 30;
  camera.position.x = 0;
  camera.position.y = 20;
  camera.lookAt (new THREE.Vector3 (0, 0, 0));

  const particleMat = new THREE.PointsMaterial ({
    color: 'rgb(255, 255, 255)',
    size: 0.25,
    map: new THREE.TextureLoader ().load ('../../assets/textures/particle.jpg'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleGeo = new THREE.SphereGeometry (10, 64, 64);
  particleGeo.vertices.forEach (vertex => {
    vertex.x += Math.random () - 0.5;
    vertex.y += Math.random () - 0.5;
    vertex.z += Math.random () - 0.5;
  });
  const particleSystem = new THREE.Points (particleGeo, particleMat);
  particleSystem.name = 'particleSystem';

  scene.add (particleSystem);

  // renderer
  const renderer = new THREE.WebGLRenderer ();
  renderer.setSize (window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor ('rgb(20, 20, 20)');

  const controls = new THREE.OrbitControls (camera, renderer.domElement);

  document.getElementById ('webgl').appendChild (renderer.domElement);

  update (renderer, scene, camera, controls);

  return scene;
}

function update (renderer, scene, camera, controls) {
  controls.update ();
  renderer.render (scene, camera);

  const particleSystem = scene.getObjectByName ('particleSystem');
  particleSystem.rotation.y += 0.005;

  requestAnimationFrame (function () {
    update (renderer, scene, camera, controls);
  });
}

const scene = init ();
