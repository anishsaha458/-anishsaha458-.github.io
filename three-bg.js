// Script runs after DOM is loaded (placed at bottom of body)
const canvas = document.getElementById("bg");

if (!canvas) {
  console.error("Canvas element not found");
} else {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const shapes = [];

  // Helper function to create and add shapes
  function addShape(geometry, opacityBase = 0.12) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: opacityBase + Math.random() * 0.08
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(
      Math.random() * 160 - 80,
      Math.random() * 120 - 60,
      Math.random() * 100 - 70
    );
    
    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.rotation.z = Math.random() * Math.PI * 2;
    
    scene.add(mesh);
    shapes.push({ 
      mesh, 
      speedX: (Math.random() - 0.5) * 0.003, 
      speedY: (Math.random() - 0.5) * 0.002,
      speedZ: (Math.random() - 0.5) * 0.0015
    });
  }

  // Define all available shape types
  const shapeTypes = [
    // Boxes
    () => new THREE.BoxGeometry(6 + Math.random() * 6, 6 + Math.random() * 6, 6 + Math.random() * 6),
    // Spheres
    () => new THREE.SphereGeometry(4 + Math.random() * 4, 16, 16),
    // Cones
    () => new THREE.ConeGeometry(4 + Math.random() * 3, 8 + Math.random() * 6, 16),
    // Cylinders
    () => new THREE.CylinderGeometry(3 + Math.random() * 3, 3 + Math.random() * 3, 10 + Math.random() * 6, 16),
    // Tetrahedrons
    () => new THREE.TetrahedronGeometry(5 + Math.random() * 6),
    // Octahedrons
    () => new THREE.OctahedronGeometry(5 + Math.random() * 6),
    // Dodecahedrons
    () => new THREE.DodecahedronGeometry(5 + Math.random() * 6),
    // Icosahedrons
    () => new THREE.IcosahedronGeometry(5 + Math.random() * 6),
    // Torus
    () => new THREE.TorusGeometry(5 + Math.random() * 6, 1.5, 16, 32),
    // Torus Knots
    () => new THREE.TorusKnotGeometry(4 + Math.random() * 5, 1, 100, 16),
    // Rings
    () => new THREE.RingGeometry(3 + Math.random() * 3, 6 + Math.random() * 6, 16),
    // Circles
    () => new THREE.CircleGeometry(5 + Math.random() * 5, 32),
    // Planes
    () => new THREE.PlaneGeometry(10 + Math.random() * 9, 10 + Math.random() * 9, 8, 8)
  ];

  // Randomly select 3-4 shape types
  const numShapeTypes = 3 + Math.floor(Math.random() * 2); // 3 or 4
  const selectedShapeIndices = [];
  
  while (selectedShapeIndices.length < numShapeTypes) {
    const randomIndex = Math.floor(Math.random() * shapeTypes.length);
    if (!selectedShapeIndices.includes(randomIndex)) {
      selectedShapeIndices.push(randomIndex);
    }
  }

  // Generate multiple instances of each selected shape type
  selectedShapeIndices.forEach(index => {
    const numInstances = 3 + Math.floor(Math.random() * 3); // 3-5 instances
    for (let i = 0; i < numInstances; i++) {
      const geometry = shapeTypes[index]();
      addShape(geometry, index === 9 ? 0.1 : 0.12); // Lower opacity for torus knots
    }
  });

  // Particles
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 2500;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 220;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x000000,
    size: 0.15,
    transparent: true,
    opacity: 0.2
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Animate
  function animate() {
    requestAnimationFrame(animate);

    // Rotate all shapes
    shapes.forEach(({ mesh, speedX, speedY, speedZ }) => {
      mesh.rotation.x += speedX;
      mesh.rotation.y += speedY;
      mesh.rotation.z += speedZ;
    });

    // Slowly rotate particles
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.00015;

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