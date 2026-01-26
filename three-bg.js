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
      color: 0xffffff, // Start with white, will be updated in animation
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
      speedZ: (Math.random() - 0.5) * 0.0015,
      hueOffset: Math.random() * 360 // Random starting hue for each shape
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

  // Particles - also with color animation
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 2500;
  const positions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const particleHueOffsets = []; // Store hue offset for each particle

  for (let i = 0; i < particleCount; i++) {
    // Position
    positions[i * 3] = (Math.random() - 0.5) * 220;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 220;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    
    // Store random hue offset for this particle
    particleHueOffsets.push(Math.random() * 360);
    
    // Initial color (will be updated in animation)
    particleColors[i * 3] = 1;
    particleColors[i * 3 + 1] = 1;
    particleColors[i * 3 + 2] = 1;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    transparent: true,
    opacity: 0.2,
    vertexColors: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Mouse parallax tracking
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Time variable for color cycling
  let time = 0;

  // Animate
  function animate() {
    requestAnimationFrame(animate);

    time += 0.0005; // Slow color change speed

    // Rotate all shapes and update colors
    shapes.forEach(({ mesh, speedX, speedY, speedZ, hueOffset }) => {
      mesh.rotation.x += speedX;
      mesh.rotation.y += speedY;
      mesh.rotation.z += speedZ;
      
      // Calculate hue that cycles through the spectrum
      const hue = (time * 50 + hueOffset) % 360;
      
      // Convert HSL to RGB for a smooth color transition
      // Using pastel/light colors (high lightness)
      const color = new THREE.Color();
      color.setHSL(hue / 360, 0.6, 0.75); // saturation 0.6, lightness 0.75 for soft colors
      mesh.material.color = color;
    });

    // Update particle colors
    const colors = particleGeometry.attributes.color.array;
    for (let i = 0; i < particleCount; i++) {
      const hue = (time * 50 + particleHueOffsets[i]) % 360;
      const color = new THREE.Color();
      color.setHSL(hue / 360, 0.6, 0.75);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    particleGeometry.attributes.color.needsUpdate = true;

    // Slowly rotate particles
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.00015;

    // Smooth parallax effect
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;

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