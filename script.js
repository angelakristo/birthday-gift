/* =========================================================
   Birthday Gift — script.js
   Handles: the "open surprise" button, confetti animation,
   and gentle fade-in-on-scroll for each section.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- 1. "Open your surprise" button ----- */
  const openBtn = document.getElementById('openBtn');
  const messageSection = document.getElementById('message');

  if (openBtn && messageSection) {
    openBtn.addEventListener('click', () => {
      launchConfetti(80);

      setTimeout(() => {
        messageSection.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    });
  }

  /* ----- 2. Fade-in-on-scroll using IntersectionObserver ----- */
  // Any element with class "reveal" will fade in as it enters the viewport.
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.id === 'final') {
          setTimeout(() => launchConfetti(100), 500);
        }

        // Once revealed, stop watching it (saves performance)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
  });

  revealElements.forEach(el => observer.observe(el));

  /* ----- 3. Confetti function -----
     Creates colorful little squares that fall from the top of the screen.
     We use simple <div> elements styled with CSS — no external library.
  */
  const confettiContainer = document.getElementById('confetti');

  const confettiColors = [
    '#F4B6C2', // blush pink
    '#FADADD', // soft pink
    '#C8B6E2', // soft purple
    '#E8B86D', // gold
    '#FFF8F3', // cream
    '#FFFFFF'  // white
  ];

  function launchConfetti(pieces = 60) {
    if (!confettiContainer) return;

    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');

      piece.style.left = Math.random() * 100 + 'vw';

      piece.style.background = confettiColors[
        Math.floor(Math.random() * confettiColors.length)
      ];

      const size = 6 + Math.random() * 8;
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';

      if (Math.random() > 0.6) piece.style.borderRadius = '50%';

      const duration = 2.5 + Math.random() * 2;
      const delay = Math.random() * 0.6;
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = delay + 's';

      confettiContainer.appendChild(piece);

      // Remove the element once it has fallen, to keep the DOM clean
      setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
    }
  }

  /* ----- 4. Small touch: tilt memory cards slightly on hover -----
     Optional, gentle, purely decorative. Skipped on touch devices.
  */
  const memoryCards = document.querySelectorAll('.memory-card');
  memoryCards.forEach((card, index) => {
    // A tiny initial rotation so the cards look hand-placed
    const tilt = (index % 2 === 0 ? -1 : 1) * (Math.random() * 1.5 + 0.5);
    card.style.transform = `rotate(${tilt}deg)`;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'rotate(0deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotate(${tilt}deg)`;
    });
  });

  /* ----- 5. Certificate PDF download ----- */
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadCertificate);
  }

  function downloadCertificate() {
    // ── Edit these two constants to personalise the certificate ──
    const SISTER_NAME = 'Klimentina';
    const MY_NAME     = 'Angela';
    // ─────────────────────────────────────────────────────────────

    const PINK   = '#F4B6C2';
    const PURPLE = '#C8B6E2';
    const GOLD   = '#E8B86D';
    const TEXT   = '#4A3B47';
    const SOFT   = '#7A6A75';
    const CREAM  = '#FFF8F3';

    const doc = new jspdf.jsPDF('landscape', 'pt', 'a4');
    const W   = doc.internal.pageSize.getWidth();
    const H   = doc.internal.pageSize.getHeight();
    const cx  = W / 2;

    // Draws a simple cat paw print at (px, py) using filled circles
    function drawPaw(px, py, r, color) {
      doc.setFillColor(color);
      doc.circle(px, py, r, 'F');
      const tr = r * 0.42;
      doc.circle(px - r * 0.70, py - r * 1.02, tr, 'F');
      doc.circle(px - r * 0.22, py - r * 1.42, tr, 'F');
      doc.circle(px + r * 0.22, py - r * 1.42, tr, 'F');
      doc.circle(px + r * 0.70, py - r * 1.02, tr, 'F');
    }

    // — Background —
    doc.setFillColor(CREAM);
    doc.rect(0, 0, W, H, 'F');

    // — Outer border (gold, 3 pt) —
    doc.setDrawColor(GOLD);
    doc.setLineWidth(3);
    doc.rect(14, 14, W - 28, H - 28);

    // — Inner border (pink, 1.5 pt) —
    doc.setDrawColor(PINK);
    doc.setLineWidth(1.5);
    doc.rect(22, 22, W - 44, H - 44);

    // — Corner paw prints —
    drawPaw(52,     62,     8, PINK);
    drawPaw(W - 52, 62,     8, PINK);
    drawPaw(52,     H - 52, 8, PINK);
    drawPaw(W - 52, H - 52, 8, PINK);

    // — Top gold rule —
    doc.setDrawColor(GOLD);
    doc.setLineWidth(1);
    doc.line(70, 88, W - 70, 88);

    // — Certificate title —
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(TEXT);
    doc.text('Certificate for the Best Person, Sister and Cat-Mom in the Whole World', cx, 122, { align: 'center' });

    // — Subtitle —
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(SOFT);
    doc.text('This certificate is proudly awarded to', cx, 155, { align: 'center' });

    // — Sister's name (large, gold) —
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(40);
    doc.setTextColor(GOLD);
    doc.text(SISTER_NAME, cx, 202, { align: 'center' });

    // — Divider: pink rules flanking a centre paw —
    doc.setDrawColor(PINK);
    doc.setLineWidth(0.75);
    doc.line(80, 220, cx - 18, 220);
    doc.line(cx + 18, 220, W - 80, 220);
    drawPaw(cx, 223, 7, PURPLE);

    // — Body paragraph —
    const bodyLines = [
      'For being the kindest, funniest, most loved person in our whole world.',
      'For every laugh, every hug, and every moment that made life better.',
      'Today and always, you are celebrated.',
    ];
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(TEXT);
    doc.text(bodyLines, cx, 256, { align: 'center', lineHeightFactor: 1.85 });

    // — Date —
    const today = '13 May 2026';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(SOFT);
    doc.text(today, cx, 338, { align: 'center' });

    // — Bottom gold rule —
    doc.setDrawColor(GOLD);
    doc.setLineWidth(1);
    doc.line(70, 360, W - 70, 360);

    // — Left signature: [my name] —
    const sigY = 420;
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(19);
    doc.setTextColor(TEXT);
    doc.text(MY_NAME, W * 0.25, sigY, { align: 'center' });
    const lw = doc.getTextWidth(MY_NAME);
    doc.setDrawColor(PINK);
    doc.setLineWidth(0.75);
    doc.line(W * 0.25 - lw / 2, sigY + 7, W * 0.25 + lw / 2, sigY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(SOFT);
    doc.text('With all my love', W * 0.25, sigY + 22, { align: 'center' });

    // — Centre flourish paw —
    drawPaw(cx, sigY - 4, 11, PURPLE);

    // — Right signature: Hera (with a small drawn paw beside the name) —
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(19);
    doc.setTextColor(TEXT);
    doc.text('Hera', W * 0.75, sigY, { align: 'center' });
    const heraW = doc.getTextWidth('Hera');
    drawPaw(W * 0.75 + heraW / 2 + 14, sigY - 7, 6, PINK);
    const rLineW = heraW + 28;
    doc.setDrawColor(PINK);
    doc.setLineWidth(0.75);
    doc.line(W * 0.75 - rLineW / 2, sigY + 7, W * 0.75 + rLineW / 2, sigY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(SOFT);
    doc.text('Forever your kitty', W * 0.75, sigY + 22, { align: 'center' });

    // — Bottom paw trail (centre bottom) —
    const trailY = H - 44;
    for (let i = -2; i <= 2; i++) {
      drawPaw(cx + i * 28, trailY, 5, PINK);
    }

    doc.save('Birthday-Certificate.pdf');
  }

});
