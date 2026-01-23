// Script runs after DOM is loaded (placed at bottom of body)
const canvas = document.getElementById("bg");

if (!canvas) {
  console.error("Canvas element not found");
} else {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Geometry – plane with wireframe
  const geometry = new THREE.PlaneGeometry(10, 10, 30, 30);

  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Slight tilt for depth
  mesh.rotation.x = -0.4;
  mesh.rotation.y = 0.2;

  // Animate
  function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.z += 0.0008;
    mesh.rotation.y += 0.0004;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}