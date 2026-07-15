// ==========================================
// Circuit Line Background Animation (Canvas)
// ==========================================
const canvas = document.getElementById('circuit-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const connectionDistance = 140;

  function initCanvas() {
    const isBody = canvas.parentElement.tagName.toLowerCase() === 'body';
    width = canvas.width = isBody ? window.innerWidth : canvas.parentElement.offsetWidth;
    height = canvas.height = isBody ? window.innerHeight : canvas.parentElement.offsetHeight;
    particles = [];
    const numParticles = window.innerWidth < 768 ? 40 : 80;
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5
      });
    }
  }

  function drawCircuit() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      
      // Draw Node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.6)'; // Primary color nodes
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 70, 229, ${0.4 * (1 - dist/connectionDistance)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawCircuit);
  }

  window.addEventListener('resize', initCanvas);
  initCanvas();
  drawCircuit();
}
