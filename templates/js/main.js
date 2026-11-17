/* =========================================================
   Ethan & Sophia — interactions
   ========================================================= */
(() => {
  "use strict";

  const WEDDING_DATE = new Date("2027-02-14T16:00:00");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Preloader ---------- */
  const hidePreloader = () => $("#preloader").classList.add("done");
  window.addEventListener("load", () => setTimeout(hidePreloader, 500));
  setTimeout(hidePreloader, 4000); // fallback if a slow asset delays "load"

  /* ---------- Letter-opening intro (fixed, full screen) ---------- */
  const intro = $("#intro");
  const env = $("#env");
  const envLetter = $("#envLetter");
  const photo = $("#ibPhoto");
  let opened = false;

  // envelope position inside images/envelope.jpg (736 × 1308)
  const IMG = { w: 736, h: 1308 };
  const ENV = { x: 51, y: 445, w: 634, h: 474 };

  // flap outline (percent of the envelope box): scalloped edge down to the wax seal
  const seal = { cx: 49.7, cy: 63.6, rx: 10.8, ry: 14.8 };
  const flapPts = [[0, 0], [100, 0], [100, 9], [97, 15], [93, 20], [88, 22], [83, 26], [78, 31], [72, 36], [66, 42], [61, 48]];
  // around the bottom of the seal, right → left
  for (let a = 10; a <= 170; a += 20) {
    const r = (a * Math.PI) / 180;
    flapPts.push([seal.cx + seal.rx * Math.cos(r), seal.cy + seal.ry * Math.sin(r)]);
  }
  flapPts.push([39, 48], [34, 42], [28, 36], [22, 31], [17, 26], [12, 22], [7, 20], [3, 15], [0, 9]);
  const poly = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})`;
  const edge = flapPts.slice(2);                                   // the scalloped lower edge only
  $(".flap-face.front", env).style.clipPath = poly(flapPts);
  $(".flap-face.back", env).style.clipPath = poly(flapPts.map(([x, y]) => [x, 100 - y]));
  $(".env-pocket", env).style.clipPath = poly([...edge, [0, 100], [100, 100]]);
  $(".env-pocket-under", env).style.clipPath = poly([[0, 6], [100, 6], ...edge]);

  function layout() {
    if (opened) return;
    const W = window.innerWidth, H = window.innerHeight;
    // phones: cover the screen; wide screens: fit the height (blurred copy fills the sides)
    const scale = W / H > 0.8 ? H / IMG.h * 1.05 : Math.max(W / IMG.w, H / IMG.h);
    const iw = IMG.w * scale, ih = IMG.h * scale;
    const ox = (W - iw) / 2, oy = (H - ih) / 2;
    Object.assign(photo.style, { left: `${ox}px`, top: `${oy}px`, width: `${iw}px`, height: `${ih}px` });
    Object.assign(env.style, {
      left: `${ox + ENV.x * scale}px`, top: `${oy + ENV.y * scale}px`,
      width: `${ENV.w * scale}px`, height: `${ENV.h * scale}px`,
    });
    env.style.setProperty("--iw", `${iw}px`);
    env.style.setProperty("--ih", `${ih}px`);
    env.style.setProperty("--ex", `${ENV.x * scale}px`);
    env.style.setProperty("--ey", `${ENV.y * scale}px`);
  }
  layout();
  window.addEventListener("resize", layout);

  // twinkling gold dust
  const dust = $("#ibSparkles");
  for (let i = 0; i < 34; i++) {
    const s = document.createElement("span");
    if (i % 4 === 0) s.className = "star";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty("--d", `${2.4 + Math.random() * 3}s`);
    s.style.setProperty("--delay", `${Math.random() * 4}s`);
    dust.appendChild(s);
  }

  function sealBurst() {
    const b = $(".env-seal", env);
    for (let i = 0; i < 30; i++) {
      const d = document.createElement("span");
      d.className = "burst-dot";
      d.style.left = b.style.left || "49.7%";
      d.style.top = "63.3%";
      const a = (i / 30) * Math.PI * 2, dist = 50 + Math.random() * 110;
      d.style.setProperty("--tx", `${Math.cos(a) * dist}px`);
      d.style.setProperty("--ty", `${Math.sin(a) * dist}px`);
      env.appendChild(d);
      setTimeout(() => d.remove(), 1100);
    }
  }

  function bringLetterForward() {
    const W = window.innerWidth, H = window.innerHeight;
    const r = envLetter.getBoundingClientRect();
    const target = Math.min(W * 0.86, (H * 0.84) / 1.5, 440);
    envLetter.style.setProperty("--sc", (target / r.width).toFixed(4));
    envLetter.style.setProperty("--dx", `${(W / 2 - (r.left + r.width / 2)).toFixed(1)}px`);
    envLetter.style.setProperty("--dy", `${(H / 2 - (r.top + r.height / 2)).toFixed(1)}px`);
    intro.classList.add("letter-front");
  }

  let autoEnter;
  function enterSite() {
    if (intro.classList.contains("opening")) return;
    clearTimeout(autoEnter);
    intro.classList.add("opening");
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    startReveals();
    petals.burst();
    setTimeout(() => intro.remove(), 1400);
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    const fast = reduceMotion;
    const t = fast ? [0, 50, 100, 150, 200] : [0, 350, 1300, 2700, 3900];
    intro.classList.add("seal-broken");                         // 1. seal breaks
    if (!fast) sealBurst();
    setTimeout(() => intro.classList.add("flap-open"), t[1]);   // 2. flap swings open
    setTimeout(() => intro.classList.add("letter-out"), t[2]);  // 3. letter slides out
    setTimeout(bringLetterForward, t[3]);                       // 4. letter comes to the front
    setTimeout(() => {                                          // 5. letter unfolds
      intro.classList.add("unfold");
      setTimeout(() => {
        intro.classList.add("can-enter");
        autoEnter = setTimeout(enterSite, fast ? 600 : 2000);   // 6. into the website (letter shows 2s)
      }, fast ? 50 : 1700);
    }, t[4]);
  }
  $("#openInvite").addEventListener("click", (e) => { e.stopPropagation(); openInvitation(); });
  intro.addEventListener("click", () => { if (intro.classList.contains("can-enter")) enterSite(); });

  /* ---------- Scroll reveal ---------- */
  function startReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = parseInt(el.dataset.delay || "0", 10);
        setTimeout(() => el.classList.add("in"), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- Scroll-driven effects (rAF throttled) ---------- */
  const progress = $(".scroll-progress span");
  const backTop = $(".back-top");
  const parallaxEls = $$("[data-parallax]");
  const timeline = $("#timeline");
  const timelineFill = $(".timeline-fill");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    backTop.classList.toggle("show", y > vh * 0.8);

    // section backgrounds stay fixed while scrolling (no parallax)

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      timelineFill.style.height = `${pct * 100}%`;
    }

    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();


  /* ---------- Hero: letters, fireflies, 3D depth ---------- */
  const hero = $("#home");
  const heroTilt = $("#heroTilt");
  const heroLayers = $$("[data-depth]", hero);

  // split the names into letters for the 3D reveal + foil shimmer
  let letterIndex = 0;
  $$("[data-split]", hero).forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    [...text].forEach((c) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      s.style.setProperty("--i", letterIndex++);
      s.setAttribute("aria-hidden", "true");
      el.appendChild(s);
    });
    if (el.closest(".hero-names") && letterIndex === text.length) letterIndex += 2; // pause for "&"
  });

  // golden fireflies drifting up through the garden
  const ff = $("#fireflies");
  const ffCount = reduceMotion ? 0 : (window.innerWidth < 768 ? 16 : 32);
  for (let i = 0; i < ffCount; i++) {
    const f = document.createElement("span");
    f.className = "firefly";
    f.style.left = `${Math.random() * 100}%`;
    f.style.setProperty("--s", `${2 + Math.random() * 4}px`);
    f.style.setProperty("--sx", `${(Math.random() - 0.5) * 120}px`);
    f.style.setProperty("--t", `${12 + Math.random() * 14}s`);
    f.style.setProperty("--b", `${1.5 + Math.random() * 2.5}s`);
    f.style.setProperty("--delay", `${-Math.random() * 20}s`);
    ff.appendChild(f);
  }

  // mouse: content tilts, background layers drift at different depths
  if (finePointer && !reduceMotion) {
    hero.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      heroTilt.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
      heroLayers.forEach((l) => {
        const d = parseFloat(l.dataset.depth);
        l.style.translate = `${-x * d}px ${-y * d}px`;
      });
    });
    hero.addEventListener("mouseleave", () => {
      heroTilt.style.transform = "";
      heroLayers.forEach((l) => { l.style.translate = ""; });
    });
  }

  // days-to-go pill
  const heroDays = $("#heroDays");
  heroDays.textContent = Math.max(0, Math.ceil((WEDDING_DATE - new Date()) / 864e5));

  /* ---------- Countdown ---------- */
  const units = {
    days: $('[data-unit="days"]'),
    hours: $('[data-unit="hours"]'),
    minutes: $('[data-unit="minutes"]'),
    seconds: $('[data-unit="seconds"]'),
  };
  function setUnit(el, val) {
    const txt = String(val).padStart(2, "0");
    if (el.textContent === txt) return;
    el.textContent = txt;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }
  function tickCountdown() {
    let diff = Math.max(0, WEDDING_DATE - new Date());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    setUnit(units.days, d); setUnit(units.hours, h); setUnit(units.minutes, m); setUnit(units.seconds, s);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- Save the date (.ics) ---------- */
  $("#addToCalendar").addEventListener("click", (e) => {
    e.preventDefault();
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ethan & Sophia//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:ethan-sophia-20270214@wedding",
      "DTSTAMP:20261117T000000Z",
      "DTSTART:20270214T150000Z",
      "DTEND:20270214T230000Z",
      "SUMMARY:Ethan & Sophia's Wedding",
      "LOCATION:Lavender Palace Gardens\\, 21 Wisteria Lane\\, Lake Como",
      "DESCRIPTION:Ceremony at 4 PM\\, reception at 7 PM. We can't wait to celebrate with you!",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "ethan-sophia-wedding.ics" });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  /* ---------- 3D invitation card: tilt + flip ---------- */
  const card = $("#inviteCard");
  const toggleCard = () => card.classList.toggle("flipped");
  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(); }
  });
  if (finePointer && !reduceMotion) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.classList.add("tracking");
      const dir = card.classList.contains("flipped") ? -1 : 1;
      card.style.setProperty("--ry", `${(px - 0.5) * 22 * dir}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * 18}deg`);
      $$(".card3d-shine", card).forEach((s) => {
        s.style.setProperty("--mx", `${px * 100}%`);
        s.style.setProperty("--my", `${py * 100}%`);
      });
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("tracking");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
    // Keep the flip itself smooth even while tracking
    card.addEventListener("click", () => {
      card.classList.remove("tracking");
    });
  }

  /* ---------- Generic 3D tilt cards ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- Event cards: tap to flip on touch devices ---------- */
  $$(".event-flip").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      if (finePointer && !el.classList.contains("mini")) return;
      el.classList.toggle("flipped");
    });
  });

  /* ---------- Love story: swipeable 3D card stack ---------- */
  const storyStack = $("#storyStack");
  if (storyStack) {
    const cards = $$(".story-card", storyStack);
    const dotsHost = $("#storyDots");
    let current = 0;
    cards.forEach((_, i) => {
      const d = document.createElement("span");
      d.addEventListener("click", () => showStory(i));
      dotsHost.appendChild(d);
    });
    const dots = $$("span", dotsHost);
    function showStory(n) {
      current = (n + cards.length) % cards.length;
      cards.forEach((c, i) => {
        let off = i - current;
        if (off < -1) off += cards.length;           // wrap so the stack feels endless
        if (off > cards.length - 2) off -= cards.length;
        const a = Math.abs(off);
        c.style.transform = off === 0
          ? "translate3d(0,0,0) rotateY(0)"
          : `translate3d(${off * 34}%, ${a * 10}px, ${-a * 140}px) rotateY(${-off * 28}deg)`;
        c.style.opacity = a > 1 ? 0 : (a === 1 ? 0.55 : 1);
        c.style.zIndex = 10 - a;
        c.style.pointerEvents = off === 0 ? "auto" : "none";
      });
      dots.forEach((d, i) => d.classList.toggle("on", i === current));
    }
    $("#storyNext").addEventListener("click", () => showStory(current + 1));
    $("#storyPrev").addEventListener("click", () => showStory(current - 1));
    let sx = null;
    storyStack.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    window.addEventListener("pointerup", (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 40) showStory(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
    showStory(0);
  }

  /* ---------- 3D gallery ring ---------- */
  const stage = $(".ring-stage");
  const ring = $("#galleryRing");
  const items = $$(".ring-item", ring);
  const step = 360 / items.length;
  let rotation = 0;
  let target = 0;
  let radius = 420;
  let autoSpin = !reduceMotion;
  let resumeTimer;

  function layoutRing() {
    radius = parseFloat(getComputedStyle(stage).getPropertyValue("--radius")) || 420;
    items.forEach((it, i) => { it.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`; });
  }
  function pauseAuto() {
    autoSpin = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { autoSpin = !reduceMotion; }, 4000);
  }
  function renderRing() {
    if (autoSpin) target -= 0.12;
    rotation += (target - rotation) * 0.08;
    ring.style.transform = `translateZ(${-radius}px) rotateY(${rotation}deg)`;
    requestAnimationFrame(renderRing);
  }
  layoutRing();
  window.addEventListener("resize", layoutRing);
  requestAnimationFrame(renderRing);

  $("#ringNext").addEventListener("click", () => { pauseAuto(); target = Math.round(target / step) * step - step; });
  $("#ringPrev").addEventListener("click", () => { pauseAuto(); target = Math.round(target / step) * step + step; });

  let dragStartX = 0, dragStartTarget = 0, dragging = false, moved = 0;
  stage.addEventListener("pointerdown", (e) => {
    dragging = true; moved = 0;
    dragStartX = e.clientX; dragStartTarget = target;
    stage.classList.add("dragging");
    pauseAuto();
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    moved = Math.max(moved, Math.abs(dx));
    target = dragStartTarget + dx * 0.35;
  });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("dragging");
    pauseAuto();
  });

  const lightbox = new bootstrap.Modal($("#lightbox"));
  items.forEach((it) => {
    it.addEventListener("click", () => {
      if (moved > 6) return;
      $("#lightboxImg").src = it.dataset.src;
      $("#lightboxImg").alt = it.querySelector("img").alt;
      lightbox.show();
    });
  });

  /* ---------- RSVP form ---------- */
  const form = $("#rsvpForm");
  const attendOnly = $$(".attend-only");
  $$('input[name="attend"]').forEach((r) => r.addEventListener("change", () => {
    const yes = $("#attendYes").checked;
    attendOnly.forEach((el) => el.classList.toggle("hidden", !yes));
  }));

  const rsvpModal = new bootstrap.Modal($("#rsvpModal"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const name = $("#guestName").value.trim().split(" ")[0];
    const yes = $("#attendYes").checked;
    $("#rsvpTitle").textContent = yes ? `Thank you, ${name}!` : `We'll miss you, ${name}`;
    $("#rsvpMsg").textContent = yes
      ? "Your RSVP is received. We can't wait to celebrate with you on 14 February!"
      : "Thank you for letting us know. You'll be in our hearts on our special day.";
    rsvpModal.show();
    if (yes) petals.burst();
    form.reset();
    form.classList.remove("was-validated");
    attendOnly.forEach((el) => el.classList.remove("hidden"));
  });

  /* ---------- Custom cursor ---------- */
  if (finePointer) {
    const dot = $(".cursor-dot");
    const ringEl = $(".cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      document.body.classList.add("has-cursor");
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ringEl.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener("mouseover", (e) => {
      const hot = e.target.closest("a, button, .card3d, .event-flip, .ring-item, label, input, select, textarea");
      document.body.classList.toggle("cursor-hover", !!hot);
    });
  }

  /* ---------- Falling petals (canvas) ---------- */
  const petals = (() => {
    const canvas = $("#petals");
    const ctx = canvas.getContext("2d");
    const colors = ["#d8c2f0", "#b79ad9", "#efe6f9", "#9b6fd0", "#f1dca2"];
    let w, h, list = [];
    const BASE = reduceMotion ? 0 : Math.min(14, Math.round(window.innerWidth / 80));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(burst) {
      return {
        x: Math.random() * w,
        y: burst ? -20 - Math.random() * h * 0.6 : Math.random() * -h,
        r: 5 + Math.random() * 6,
        vy: 0.6 + Math.random() * 1.2,
        vx: -0.4 + Math.random() * 0.8,
        rot: Math.random() * Math.PI * 2,
        vr: -0.03 + Math.random() * 0.06,
        sway: Math.random() * Math.PI * 2,
        color: colors[(Math.random() * colors.length) | 0],
        alpha: 0.45 + Math.random() * 0.35,
        temp: burst,
      };
    }
    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.6 + 0.4 * Math.abs(Math.sin(p.sway)));
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r, -p.r, p.r * 0.8, p.r * 0.6, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.8, p.r * 0.6, -p.r, -p.r, 0, -p.r);
      ctx.fill();
      ctx.restore();
    }
    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.sway += 0.02;
        p.x += p.vx + Math.sin(p.sway) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 20) {
          if (p.temp) { list.splice(i, 1); continue; }
          Object.assign(p, make(false), { y: -20 });
        }
        drawPetal(p);
      }
      requestAnimationFrame(loop);
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < BASE; i++) list.push(make(false));
    requestAnimationFrame(loop);

    return {
      burst() {
        if (reduceMotion) return;
        for (let i = 0; i < 18; i++) list.push(make(true));
      },
    };
  })();
})();
