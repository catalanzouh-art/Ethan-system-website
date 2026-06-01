/* ═══════════════════════════════════════════════════════
   ETTA SYSTEMS — Page-Specific Scripts
   layout.js handles: navbar, footer, language, AOS, scroll-top
   This file handles: tabs, forms, counters, page-specific UI
═══════════════════════════════════════════════════════ */

/* ─── PRODUCT TABS (products.html) ─────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) {
      target.classList.add('active');
      // Re-trigger AOS for newly visible elements
      target.querySelectorAll('[data-aos]').forEach(el => {
        if (!el.classList.contains('aos-animate')) el.classList.add('aos-animate');
      });
    }
  });
});

/* ─── CONTACT FORM ──────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"], .ctp-submit');
  const isAr = window.ETTA?.isAr?.() || false;

  if (btn) {
    const span = btn.querySelector('span') || btn;
    span.textContent = isAr ? 'جارٍ الإرسال...' : 'Sending…';
    btn.disabled = true;
  }

  setTimeout(() => {
    const success = document.getElementById('form-success');
    if (success) {
      success.textContent = isAr
        ? success.dataset.ar || 'شكراً! تم إرسال رسالتك.'
        : success.dataset.en || 'Thank you! Your message has been sent.';
      success.classList.add('show');
    }
    e.target.reset();
    if (btn) {
      const span = btn.querySelector('span') || btn;
      span.textContent = isAr ? 'إرسال الرسالة' : 'Send Message';
      btn.disabled = false;
    }

    setTimeout(() => success?.classList.remove('show'), 6000);
  }, 1200);
}

/* Re-apply form button label on language change */
document.addEventListener('langchange', ({ detail: { lang } }) => {
  const btn = document.querySelector('#contact-form button[type="submit"]');
  if (btn && !btn.disabled) {
    btn.textContent = lang === 'ar' ? 'إرسال الرسالة' : 'Send Message';
  }

  // Update input placeholders
  const ph = {
    'input-name':    { en: 'e.g. John Doe',         ar: 'مثال: محمد علي' },
    'input-email':   { en: 'your@email.com',         ar: 'بريدك@الإلكتروني.com' },
    'input-company': { en: 'Your Company',            ar: 'شركتك' },
    'input-phone':   { en: '+963 XXX XXXX',           ar: '+963 XXX XXXX' },
    'input-message': { en: 'Tell us about your project or inquiry…', ar: 'أخبرنا عن مشروعك أو استفسارك…' },
  };
  Object.entries(ph).forEach(([id, v]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = lang === 'ar' ? v.ar : v.en;
  });
});

/* ─── COUNTER ANIMATION (index.html stats) ─────────────── */
(function initCounters() {
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statObs.unobserve(entry.target);

      const valEl = entry.target.querySelector('.stat-value');
      if (!valEl) return;
      const target = parseInt(valEl.dataset.count);
      if (isNaN(target)) return;

      const hasPlus = valEl.innerHTML.includes('class="plus"');
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        valEl.innerHTML = current + (hasPlus ? '<span class="plus">+</span>' : '');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach(el => statObs.observe(el));
})();

/* ─── INIT PLACEHOLDERS ─────────────────────────────────── */
(function setPlaceholders() {
  const isAr = window.ETTA?.isAr?.() || false;
  const ph = {
    'input-name':    { en: 'e.g. John Doe',          ar: 'مثال: محمد علي' },
    'input-email':   { en: 'your@email.com',          ar: 'بريدك@الإلكتروني.com' },
    'input-company': { en: 'Your Company',             ar: 'شركتك' },
    'input-phone':   { en: '+963 XXX XXXX',            ar: '+963 XXX XXXX' },
    'input-message': { en: 'Tell us about your project or inquiry…', ar: 'أخبرنا عن مشروعك أو استفسارك…' },
  };
  Object.entries(ph).forEach(([id, v]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = isAr ? v.ar : v.en;
  });
})();
