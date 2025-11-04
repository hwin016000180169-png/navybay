/* ===========================
   1️⃣ Lenis 부드러운 스크롤
=========================== */
const lenis = new Lenis({
  duration: 1.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ===========================
   2️⃣ 마우스 유리효과 (intro 안에서만)
=========================== */
const cursor   = document.querySelector('.cursor-glass');
const glowText = document.querySelector('.glow-text');
const intro    = document.querySelector('.intro');
let rafId = null;

function handleMove(e) {
  if (!intro || !cursor) return;
  const rect = intro.getBoundingClientRect();
  const inIntro =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top  && e.clientY <= rect.bottom;

  if (inIntro) {
    cursor.style.opacity = '0.9';
    cursor.style.transform = `translate(${e.clientX - cursor.offsetWidth/2}px, ${e.clientY - cursor.offsetHeight/2}px)`;
  } else {
    cursor.style.opacity = '0';
  }

  if (glowText) {
    const t = glowText.getBoundingClientRect();
    const cx = t.left + t.width / 2;
    const cy = t.top + t.height / 2;
    const distance = Math.hypot(e.clientX - cx, e.clientY - cy);
    const maxDistance = 400;
    const intensity = Math.max(0, 1 - distance / maxDistance);
    const glowSize = 10 + intensity * 25;
    const glowColor = `rgba(255,155,177,${0.15 + intensity * 0.35})`;
    glowText.style.textShadow = `
      0 0 ${glowSize}px ${glowColor},
      0 0 ${glowSize * 10}px ${glowColor}
    `;
  }
}
document.addEventListener('mousemove', (e) => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => handleMove(e));
});

/* ===========================
   3️⃣ 점진적 배경 전환 (intro → sec2)
=========================== */
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const winH = window.innerHeight;
  const sec2 = document.querySelector('.sec2');

  // intro 절반쯤부터 전환 시작, sec2 시작 시 완성
  const start = winH * 0.5;
  const end = winH * 1.0;
  const progress = Math.min(Math.max((scrollTop - start) / (end - start), 0), 1);

  // 흰색 → 네이비 배경 opacity로 점진 전환
  document.body.style.background = "#ffffff";

  if (sec2) {
    sec2.style.setProperty("--bg-opacity", progress.toFixed(2));
  }

  // 메뉴 색상 전환
  const menuLinks = document.querySelectorAll('.menu ul li a');
  menuLinks.forEach((a) => {
    a.style.color = progress > 0.5 ? "#fff" : "#223a5e";
  });
});





/* ===========================
   SVG 싸인 애니메이션
=========================== */
window.addEventListener("DOMContentLoaded", () => {
  const paths = document.querySelectorAll("#swoosh-mark path");
  paths.forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = "none";
  });

  // 살짝 딜레이 후 싸인 시작
  setTimeout(() => {
    paths.forEach((p, i) => {
      p.style.transition = `stroke-dashoffset 2s ease-in-out ${i * 0.1}s`;
      p.style.strokeDashoffset = 0;
    });
  }, 300);
});