/* =========================================================
   Premium layer: realistic purple butterflies (flying + perched),
   chapter badges, gold filigree corners, 3D scroll tilt
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- shared SVG wing artwork (one definition, reused) ---------- */
  const defs = document.createElement("div");
  defs.setAttribute("aria-hidden", "true");
  defs.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  defs.innerHTML = `
  <svg width="0" height="0">
    <defs>
      <linearGradient id="bfFore" x1="0" y1=".6" x2="1" y2=".2">
        <stop offset="0" stop-color="#2c0f42"/>
        <stop offset=".16" stop-color="#7a45b8"/>
        <stop offset=".45" stop-color="#c7a2f3"/>
        <stop offset=".62" stop-color="#e9dcff"/>
        <stop offset=".8" stop-color="#9666d4"/>
        <stop offset="1" stop-color="#2a0e3e"/>
      </linearGradient>
      <linearGradient id="bfHind" x1="0" y1="0" x2=".9" y2="1">
        <stop offset="0" stop-color="#2c0f42"/>
        <stop offset=".22" stop-color="#6c3aa8"/>
        <stop offset=".55" stop-color="#d4b6f6"/>
        <stop offset=".78" stop-color="#8b58c8"/>
        <stop offset="1" stop-color="#240b36"/>
      </linearGradient>
      <radialGradient id="bfShine" cx=".55" cy=".35" r=".55">
        <stop offset="0" stop-color="#fff" stop-opacity=".65"/>
        <stop offset=".5" stop-color="#f3e9ff" stop-opacity=".15"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bfBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#1a0828"/><stop offset=".5" stop-color="#5b3482"/><stop offset="1" stop-color="#1a0828"/>
      </linearGradient>
      <radialGradient id="bfBase" cx="0" cy=".5" r=".55">
        <stop offset="0" stop-color="#14051f" stop-opacity=".95"/>
        <stop offset="1" stop-color="#14051f" stop-opacity="0"/>
      </radialGradient>
      <symbol id="bfWing" viewBox="0 0 60 80">
        <!-- hind wing: rounded, scalloped edge, eyespot -->
        <path d="M0 41 C14 39 33 41 44 51 C50 57 51 65 47 70 Q45 74 41 72 Q39 77 34 75 Q30 79 25 75 Q19 77 15 71 C9 63 3 54 0 47 Z"
              fill="url(#bfHind)" stroke="#170625" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M0 41 C14 39 33 41 44 51 C50 57 51 65 47 70 Q45 74 41 72 Q39 77 34 75 Q30 79 25 75 Q19 77 15 71 C9 63 3 54 0 47 Z" fill="url(#bfBase)"/>
        <g stroke="#1d0830" stroke-opacity=".5" stroke-width=".5" fill="none">
          <path d="M1 43 L42 55"/><path d="M1 44 L45 66"/><path d="M1 45 L36 73"/><path d="M1 46 L24 74"/><path d="M1 46 L14 69"/>
        </g>
        <circle cx="31" cy="61" r="4.6" fill="#1a0729"/>
        <circle cx="31" cy="61" r="3.3" fill="#c79cf5"/>
        <circle cx="31" cy="61" r="1.9" fill="#2a0e3e"/>
        <circle cx="30.3" cy="60.3" r=".8" fill="#fff"/>
        <g fill="#fff" fill-opacity=".92"><circle cx="45.5" cy="66" r="1.1"/><circle cx="40" cy="73.2" r="1"/><circle cx="33" cy="76.3" r="1"/><circle cx="24.5" cy="76" r=".9"/><circle cx="16.5" cy="71.5" r=".9"/></g>
        <!-- fore wing: triangular with pointed apex, dark margin, white markings -->
        <path d="M0 34 C3 20 11 7 29 2 C41 -1 54 -1 59 5 C62 11 57 21 50 29 C42 37 22 40 0 40 Z"
              fill="url(#bfFore)" stroke="#170625" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M0 34 C3 20 11 7 29 2 C41 -1 54 -1 59 5 C62 11 57 21 50 29 C42 37 22 40 0 40 Z" fill="url(#bfShine)"/>
        <path d="M0 34 C3 20 11 7 29 2 C41 -1 54 -1 59 5 C62 11 57 21 50 29 C42 37 22 40 0 40 Z" fill="url(#bfBase)"/>
        <path d="M40 1.5 C52 0 59 3 59 7 C58 13 54 19 49 25 C52 18 54 10 40 1.5 Z" fill="#170625" fill-opacity=".85"/>
        <g stroke="#1d0830" stroke-opacity=".5" stroke-width=".5" fill="none">
          <path d="M1 36 L30 4"/><path d="M1 37 L44 3"/><path d="M1 37 L56 9"/><path d="M1 38 L53 22"/><path d="M1 39 L42 33"/><path d="M12 27 L34 16"/>
        </g>
        <g fill="#fff"><circle cx="50" cy="4" r="1.2"/><circle cx="55" cy="7.5" r="1.1"/><circle cx="55.5" cy="12.5" r="1"/><circle cx="52.5" cy="18" r="1"/>
          <ellipse cx="44" cy="9" rx="2.6" ry="1.5" fill-opacity=".8" transform="rotate(-25 44 9)"/>
          <ellipse cx="47" cy="14" rx="2" ry="1.2" fill-opacity=".7" transform="rotate(-25 47 14)"/></g>
      </symbol>
    </defs>
  </svg>`;
  document.body.appendChild(defs);

  function makeButterfly(size, extraClass = "") {
    const b = document.createElement("div");
    b.className = `bfly ${extraClass}`;
    b.style.setProperty("--s", `${size}px`);
    b.setAttribute("aria-hidden", "true");
    b.innerHTML = `
      <div class="bfly-inner">
        <div class="wing wl"><svg viewBox="0 0 60 80"><use href="#bfWing"/></svg></div>
        <div class="wing wr"><svg viewBox="0 0 60 80"><use href="#bfWing"/></svg></div>
        <div class="bfly-body"><i></i></div>
      </div>`;
    return b;
  }

  /* ---------- perched butterflies on the frames ---------- */
  const perches = [
    { sel: "#countdown .page", top: "77%", left: "66%", size: 40, rot: -28 },
    { sel: "#invitation .card3d-stage", top: "-1%", left: "22%", size: 46, rot: -18 },
    { sel: "#couple .page", top: "4.5%", left: "60%", size: 44, rot: 24 },
    { sel: "#story .page", top: "29%", left: "64%", size: 38, rot: -22 },
    { sel: "#events .page", top: "61%", left: "70%", size: 40, rot: 30 },
    { sel: "#venue .page", top: "17%", left: "58%", size: 40, rot: 18 },
    { sel: "#rsvp .page", top: "73%", left: "12%", size: 42, rot: -26 },
    { sel: ".lux-footer", top: "8%", left: "60%", size: 38, rot: 20 },
  ];
  perches.forEach((p, i) => {
    const host = $(p.sel);
    if (!host) return;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    const b = makeButterfly(p.size, "perched");
    b.style.top = p.top;
    b.style.left = p.left;
    b.style.setProperty("--rot", `${p.rot}deg`);
    b.style.setProperty("--flap-delay", `${-(i * 0.7)}s`);
    // touch / hover: it flutters for a moment
    const startle = () => {
      b.classList.add("startled");
      clearTimeout(b._t);
      b._t = setTimeout(() => b.classList.remove("startled"), 1400);
    };
    b.addEventListener("pointerenter", startle);
    b.addEventListener("pointerdown", startle);
    host.appendChild(b);
  });

  /* ---------- free-flying butterflies ---------- */
  function startFlyers() {
    if (reduceMotion || startFlyers.done) return;
    startFlyers.done = true;
    const layer = document.createElement("div");
    layer.className = "bfly-layer";
    document.body.appendChild(layer);

    const W = () => window.innerWidth, H = () => window.innerHeight;
    const count = W() < 500 ? 3 : 4;
    const flyers = [];
    for (let i = 0; i < count; i++) {
      const size = 34 + Math.random() * 16;
      const el = makeButterfly(size, "flying");
      layer.appendChild(el);
      flyers.push({
        el, size,
        x: Math.random() * W(), y: H() + 40 + i * 60,       // rise in from below
        vx: 0, vy: -1.5,
        tx: 0, ty: 0, retarget: 0,
        phase: Math.random() * 10,
        depth: Math.random() * Math.PI * 2,
        glide: 0,
      });
    }
    function pickTarget(f) {
      const m = 30;
      f.tx = m + Math.random() * (W() - m * 2);
      f.ty = m + Math.random() * (H() - m * 2);
      f.retarget = 160 + Math.random() * 260;
    }
    flyers.forEach(pickTarget);

    let last = performance.now();
    function tick(now) {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      flyers.forEach((f) => {
        f.retarget -= dt;
        const dx = f.tx - f.x, dy = f.ty - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 40 || f.retarget <= 0) pickTarget(f);

        // occasionally glide with wings held open
        if (f.glide > 0) f.glide -= dt;
        else if (Math.random() < 0.004) f.glide = 40 + Math.random() * 50;
        const speed = f.glide > 0 ? 1.1 : 1.7;

        const ax = (dx / (dist || 1)) * speed - f.vx;
        const ay = (dy / (dist || 1)) * speed - f.vy;
        f.vx += ax * 0.025 * dt;
        f.vy += ay * 0.025 * dt;

        f.phase += 0.11 * dt;
        f.depth += 0.006 * dt;
        // fluttery side-to-side wobble perpendicular to travel
        const wob = Math.sin(f.phase) * 0.9;
        const nx = -f.vy, ny = f.vx, nl = Math.hypot(nx, ny) || 1;
        f.x += (f.vx + (nx / nl) * wob) * dt;
        f.y += (f.vy + (ny / nl) * wob + Math.sin(f.phase * 0.5) * 0.35) * dt;

        const heading = Math.atan2(f.vy, f.vx) * 180 / Math.PI + 90;
        const scale = 0.78 + (Math.sin(f.depth) + 1) * 0.2;      // nearer / farther
        f.el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) translate(-50%, -50%) rotate(${heading}deg) scale(${scale})`;
        f.el.style.opacity = 0.75 + scale * 0.25;
        f.el.classList.toggle("gliding", f.glide > 0);
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  // fly once the envelope has been opened (body unlocks)
  if (!document.body.classList.contains("is-locked")) startFlyers();
  else new MutationObserver((_, obs) => {
    if (!document.body.classList.contains("is-locked")) { obs.disconnect(); setTimeout(startFlyers, 900); }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* ---------- chapter badges I–VI ---------- */
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  $$(".page-head").forEach((h, i) => {
    const c = document.createElement("span");
    c.className = "chapter";
    c.textContent = numerals[i] || "";
    h.prepend(c);
  });

  /* ---------- gold filigree corners on every frame ---------- */
  $$(".page").forEach((p) => {
    ["tl", "tr", "bl", "br"].forEach((k) => {
      const s = document.createElement("span");
      s.className = `fili ${k}`;
      p.appendChild(s);
    });
  });

  /* frames stay fixed while scrolling (no scroll tilt) */
})();

/* =========================================================
   Background music — starts on the seal tap (a user gesture),
   pauses when the guest leaves the site, resumes on return
   ========================================================= */
(() => {
  "use strict";
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  const seal = document.getElementById("openInvite");
  if (!music || !btn) return;

  const TARGET_VOLUME = 0.7;
  let wanted = false;      // the guest wants music on
  let fadeTimer;

  function fadeTo(vol, ms, done) {
    clearInterval(fadeTimer);
    const start = music.volume, steps = 20, stepMs = ms / steps;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      music.volume = Math.min(1, Math.max(0, start + (vol - start) * (i / steps)));
      if (i >= steps) { clearInterval(fadeTimer); if (done) done(); }
    }, stepMs);
  }
  function sync() {
    const on = !music.paused;
    btn.classList.toggle("playing", on);
    btn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  function play() {
    wanted = true;
    music.volume = 0;
    const p = music.play();
    if (p && p.then) p.then(() => fadeTo(TARGET_VOLUME, 1500)).catch(sync);
    else fadeTo(TARGET_VOLUME, 1500);
  }
  function pause(fade = true) {
    if (music.paused) return;
    if (fade) fadeTo(0, 400, () => music.pause());
    else music.pause();
  }

  music.addEventListener("play", sync);
  music.addEventListener("pause", sync);

  // start with the letter opening
  if (seal) seal.addEventListener("click", () => {
    btn.classList.add("show");
    play();
  });

  // floating button: guest can turn it off / on
  btn.addEventListener("click", () => {
    if (music.paused) play();
    else { wanted = false; pause(); }
  });

  // leaving the site (tab hidden, app switched, page closed) → stop; coming back → resume
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause(false);
    else if (wanted) play();
  });
  window.addEventListener("pagehide", () => pause(false));
  window.addEventListener("blur", () => { if (document.hidden) pause(false); });
})();
