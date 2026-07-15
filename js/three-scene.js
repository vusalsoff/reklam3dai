const initThreeScene = () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 150;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = 200;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];
  const maxDistance = 35; 

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 300;     
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 300; 
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 100; 

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.2
    });
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const getThemeColor = () => {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 0x22d3ee : 0x2563eb;
  };

  const particleMaterial = new THREE.PointsMaterial({
    color: getThemeColor(),
    size: 2,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending 
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: getThemeColor(),
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });
  
  const lineGeometry = new THREE.BufferGeometry();
  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.05; 
    mouseY = (e.clientY - windowHalfY) * 0.05;
  });

  const observer = new MutationObserver(() => {
    const color = new THREE.Color(getThemeColor());
    particleMaterial.color = color;
    lineMaterial.color = color;
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const animate = () => {
    requestAnimationFrame(animate);

    targetX = mouseX;
    targetY = mouseY;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    const positions = particles.geometry.attributes.position.array;
    const linePositions = [];

    for (let i = 0; i < particleCount; i++) {
      let x = positions[i * 3];
      let y = positions[i * 3 + 1];
      let z = positions[i * 3 + 2];
      const vel = particleVelocities[i];

      x += vel.x; y += vel.y; z += vel.z;

      if (x > 150 || x < -150) vel.x *= -1;
      if (y > 150 || y < -150) vel.y *= -1;
      if (z > 50 || z < -50) vel.z *= -1;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      for (let j = i + 1; j < particleCount; j++) {
        const jx = positions[j * 3];
        const jy = positions[j * 3 + 1];
        const jz = positions[j * 3 + 2];
        const dist = Math.sqrt(Math.pow(x - jx, 2) + Math.pow(y - jy, 2) + Math.pow(z - jz, 2));

        if (dist < maxDistance) {
          linePositions.push(x, y, z, jx, jy, jz);
        }
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    lineMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

document.addEventListener('DOMContentLoaded', initThreeScene);
