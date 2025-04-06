import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Optimized configuration for better performance
  const config = {
    particleCount: 40, // Reduced count for better performance
    particleBaseSize: 1.2,
    particleVariation: 0.8,
    particleBaseColor: '#61dafb',
    particleColorVariation: ['#00adb5', '#61dafb', '#4285f4'],
    lineColor: 'rgba(97, 218, 251, 0.12)',
    lineWidth: 0.3,
    lineDistance: 120, // Reduced distance
    speed: 0.2, // Slower movement
    respawnChance: 0.003,
    codeParticles: true,
    codeSymbols: ['0', '1', '{', '}', '<', '>', '()', '[]', ';']
  };

  const initParticles = (canvas) => {
    const ctx = canvas.getContext('2d');
    const particles = [];

    for (let i = 0; i < config.particleCount; i++) {
      particles.push(createParticle(canvas));
    }

    particlesRef.current = particles;
  };

  const createParticle = (canvas, x, y) => {
    const isCodeParticle = config.codeParticles && Math.random() > 0.7;
    const colorIndex = Math.floor(Math.random() * config.particleColorVariation.length);

    return {
      x: x !== undefined ? x : Math.random() * canvas.width,
      y: y !== undefined ? y : Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      size: config.particleBaseSize + Math.random() * config.particleVariation,
      color: config.particleColorVariation[colorIndex],
      alpha: Math.random() * 0.5 + 0.2,
      isCode: isCodeParticle,
      symbol: isCodeParticle ? config.codeSymbols[Math.floor(Math.random() * config.codeSymbols.length)] : null,
      symbolColor: config.particleColorVariation[colorIndex]
    };
  };

  const drawParticles = (canvas) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Process particles in batches for better performance
    const particleCount = particlesRef.current.length;

    // Draw connections with optimization
    for (let i = 0; i < particleCount; i++) {
      // Only check connections to nearby particles
      // This is a simple optimization that reduces quadratic complexity
      for (let j = i + 1; j < Math.min(i + 15, particleCount); j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.lineDistance) {
          const opacity = (1 - distance / config.lineDistance) * 0.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = config.lineColor.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particlesRef.current.forEach((particle, index) => {
      if (particle.isCode) {
        // Draw code symbols
        ctx.font = `${particle.size * 8}px JetBrains Mono`;
        ctx.fillStyle = particle.symbolColor;
        ctx.globalAlpha = particle.alpha * 0.8;
        ctx.fillText(particle.symbol, particle.x, particle.y);
        ctx.globalAlpha = 1;
      } else {
        // Draw circle particles
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Simple boundary handling for better performance
      if (particle.x < -20) particle.x = canvas.width + 20;
      if (particle.x > canvas.width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = canvas.height + 20;
      if (particle.y > canvas.height + 20) particle.y = -20;
    });

    animationRef.current = requestAnimationFrame(() => drawParticles(canvas));
  };

  const handleResize = () => {
    if (canvasRef.current) {
      // Get the parent element dimensions instead of window
      const parent = canvasRef.current.parentElement;
      if (parent) {
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
        initParticles(canvasRef.current);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const parent = canvasRef.current.parentElement;
      if (parent) {
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
      }

      initParticles(canvasRef.current);
      drawParticles(canvasRef.current);

      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0,
        animation: 'fadeIn 1.5s ease forwards 0.5s'
      }}
    />
  );
};

export default ParticleBackground;