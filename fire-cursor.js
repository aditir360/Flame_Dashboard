
(function () {
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !matchMedia("(pointer: fine)").matches
  ) return;

  const canvas = document.createElement("canvas");
  canvas.id = "fire-cursor";
  canvas.setAttribute("aria-hidden", "true");

  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 99999;
  `;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  let particles = [];
  let mouse = { x: -100, y: -100, active: false };
  let last = { x: -100, y: -100, time: 0 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    const distance = Math.hypot(dx, dy);
    const speed = Math.min(distance / 12, 2.5);

    const count = Math.min(Math.floor(distance / 4), 9);

    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count, 1);

      particles.push({
        x: last.x + dx * t,
        y: last.y + dy * t,
        vx: (Math.random() - 0.5) * (0.8 + speed),
        vy: -Math.random() * (1.5 + speed),
        size: 1.5 + Math.random() * (2.5 + speed),
        life: 1,
        decay: 0.018 + Math.random() * 0.025,
        hue: 22 + Math.random() * 30
      });
    }

    last.x = e.clientX;
    last.y = e.clientY;
    last.time = performance.now();
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    mouse.active = false;
  });

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Soft glow following the cursor
    if (mouse.active) {
      const glow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 34
      );

      glow.addColorStop(0, "rgba(255,130,35,0.13)");
      glow.addColorStop(0.4, "rgba(255,75,10,0.07)");
      glow.addColorStop(1, "rgba(255,50,0,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ember particles
    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.025;
      p.vx *= 0.985;
      p.life -= p.decay;

      if (p.life <= 0) return false;

      const radius = p.size * p.life;
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, radius * 2.5
      );

      gradient.addColorStop(
        0,
        `hsla(${p.hue},100%,75%,${p.life})`
      );
      gradient.addColorStop(
        0.35,
        `hsla(${p.hue},100%,55%,${p.life * 0.7})`
      );
      gradient.addColorStop(
        1,
        `hsla(${p.hue},100%,40%,0)`
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    if (particles.length > 180) {
      particles.splice(0, particles.length - 180);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
