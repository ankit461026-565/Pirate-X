import { useEffect, useRef } from 'react';

/**
 * Lightweight canvas-based particle system for fog/embers atmosphere.
 * Renders floating particles that drift upward with gentle horizontal sway.
 */
export function ParticleBackground({
  density = 40,
  color = 'rgba(212, 168, 60, 0.15)',
  mode = 'fog',
}: {
  density?: number;
  color?: string;
  mode?: 'fog' | 'embers';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      sway: number;
      swaySpeed: number;
      phase: number;
    };

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initParticles() {
      if (!canvas) return;
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: mode === 'embers'
            ? canvas.height + Math.random() * 100
            : Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: mode === 'embers' ? -(0.3 + Math.random() * 0.8) : -(0.1 + Math.random() * 0.3),
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          sway: Math.random() * 20,
          swaySpeed: 0.005 + Math.random() * 0.01,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.phase += p.swaySpeed;
        p.x += p.vx + Math.sin(p.phase) * 0.3;
        p.y += p.vy;

        if (mode === 'embers') {
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
        } else {
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    const handleResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, color, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
