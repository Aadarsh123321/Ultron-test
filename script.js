/*
  Reconstructed from the supplied video.
  Separate JS file intentionally kept independent from HTML/CSS.
*/

let scene;
let camera;
let renderer;
let cloudParticles = [];
let rainParticles = [];
let flash;
let rain;
let rainGeo;
let rainCount = 15000;
let ambient;
let directionalLight;

const SMOKE_TEXTURE =
  "https://static.vecteezy.com/system/resources/previews/010/884/548/original/dense-fluffy-puffs-of-white-smoke-and-fog-on-transparent-background-abstract-smoke-clouds-movement-blurred-out-of-focus-smoking-blows-from-machine-dry-ice-fly-fluttering-in-air-effect-texture-png.png";

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  // CHANGED: 0x062d89 (blue) to 0xff0000 (red)
  flash = new THREE.PointLight(0xff0000, 30, 500, 1.7);
  flash.position.set(200, 300, 100);
  scene.add(flash);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // CHANGED: 0x11111f (dark blue) to 0x1f1111 (dark red)
  scene.fog = new THREE.FogExp2(0x1f1111, 0.002);
  renderer.setClearColor(scene.fog.color);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Rain field
  const positions = [];
  const sizes = [];

  rainGeo = new THREE.BufferGeometry();

  for (let i = 0; i < rainCount; i++) {
    positions.push(Math.random() * 400 - 200);
    positions.push(Math.random() * 500 - 250);
    positions.push(Math.random() * 400 - 200);
    sizes.push(30);
  }

  rainGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  rainGeo.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes, 1)
  );

  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });

  rain = new THREE.Points(rainGeo, rainMaterial);
  scene.add(rain);

  // Smoke texture and cloud planes.
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  loader.load(
    SMOKE_TEXTURE,
    function (texture) {
      const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });

      // ENHANCEMENT: Increased count from 25 to 45 for true volumetric density
      for (let p = 0; p < 45; p++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMaterial.clone());

        cloud.position.set(
          Math.random() * 1000 - 500,
          // ENHANCEMENT: Added variation to Y-axis so clouds form a thick 3D volume instead of a flat 2D sheet
          500 + (Math.random() * 200 - 100),
          // ENHANCEMENT: Spread them out further along the Z-axis for depth
          Math.random() * 1200 - 600
        );

        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.6;

        cloudParticles.push(cloud);
        scene.add(cloud);
      }

      animate();
      window.addEventListener("resize", onWindowResize, { passive: true });
    },
    undefined,
    function (error) {
      console.error("Smoke texture could not be loaded:", error);
      animate();
      window.addEventListener("resize", onWindowResize, { passive: true });
    }
  );
}

function animate() {
  requestAnimationFrame(animate);

  cloudParticles.forEach((p) => {
    p.rotation.z -= 0.002;
    // ENHANCEMENT: Move clouds slowly forward (Z-axis) to create a real 3D fly-through effect
    p.position.z += 0.5;
    // When clouds pass the camera, recycle them to the back of the storm
    if (p.position.z > 600) {
      p.position.z = -600;
      p.position.x = Math.random() * 1000 - 500;
    }
  });

  const sizeArray = rainGeo.attributes.size.array;
  for (let i = 0; i < sizeArray.length; i++) {
    sizeArray[i] += 0.3;
  }

  rainGeo.attributes.size.needsUpdate = true;

  rain.position.z -= 0.222;
  if (rain.position.z < -200) {
    rain.position.z = 0;
  }

  // Exact lightning logic from original code
  if (Math.random() > 0.93 || flash.power > 100) {
    if (flash.power < 100) {
      flash.position.set(
        Math.random() * 400,
        300 + Math.random() * 200,
        100
      );
    }
    flash.power = 50 + Math.random() * 500;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
