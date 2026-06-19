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
const MAILER_URL = 'backend/contact.php';

async function handleSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('button[type="submit"], .ctp-submit');
  const isAr    = window.ETTA?.isAr?.() || false;
  const success = document.getElementById('form-success');
  const btnSpan = btn?.querySelector('span') || btn;

  if (btn) {
    btnSpan.textContent = isAr ? 'جارٍ الإرسال...' : 'Sending…';
    btn.disabled = true;
  }

  const payload = {
    name:    document.getElementById('input-name')?.value.trim(),
    email:   document.getElementById('input-email')?.value.trim(),
    company: document.getElementById('input-company')?.value.trim(),
    phone:   document.getElementById('input-phone')?.value.trim(),
    subject: form.querySelector('input[name="subject"]:checked')?.value || 'other',
    message: document.getElementById('input-message')?.value.trim(),
  };

  try {
    const res = await fetch(MAILER_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error('Mailer error:', data.error || res.status);
      throw new Error(data.error || 'Server error');
    }

    if (success) {
      success.textContent = isAr
        ? success.dataset.ar || 'شكراً! تم إرسال رسالتك. سنتواصل معك خلال ٢٤ ساعة.'
        : success.dataset.en || 'Thank you! Your message has been sent. We\'ll be in touch within 24 hours.';
      success.style.color = '';
      success.classList.add('show');
    }
    form.reset();
    setTimeout(() => success?.classList.remove('show'), 6000);

  } catch {
    if (success) {
      success.textContent = isAr
        ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرةً.'
        : 'Something went wrong. Please try again or email us directly.';
      success.style.color = '#e53e3e';
      success.classList.add('show');
      setTimeout(() => { success.classList.remove('show'); success.style.color = ''; }, 6000);
    }
  } finally {
    if (btn) {
      btnSpan.textContent = isAr ? 'إرسال الرسالة' : 'Send Message';
      btn.disabled = false;
    }
  }
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

/* ─── HOME INDUSTRY CHIPS (index.html) ──────────────────── */
(function initHomeChips() {
  const chips = document.querySelectorAll('.hpc-chip[data-industry]');
  const label = document.getElementById('hpc-chart-label');
  if (!chips.length) return;

  const datasets = {
    // Pharma MENA: ~$3B(1999) → $55B(2025) — slow start, sharp post-2009 rise
    pharma:   { en: 'Pharma Growth — MENA',   ar: 'نمو قطاع الأدوية في المنطقة',       h: [6,11,22,40,62,100] },
    // F&B MENA: mature market, consistent growth ~$80B → $220B
    food:     { en: 'F&B Growth — MENA',       ar: 'نمو قطاع الغذاء في المنطقة',         h: [25,35,48,62,78,100] },
    // Chemical MENA: petrochemical base, steady industrial growth
    chemical: { en: 'Chemical Growth — MENA',  ar: 'نمو القطاع الكيميائي في المنطقة',    h: [18,28,42,58,76,100] }
  };

  const lineEls = {
    pharma:   document.getElementById('hpc-lp'),
    food:     document.getElementById('hpc-lf'),
    chemical: document.getElementById('hpc-lc'),
  };

  const bars = Array.from(document.querySelectorAll('#hpc-bars .hpc-bar'));

  function activate(key) {
    const d = datasets[key];
    if (!d) return;

    chips.forEach(c => c.classList.toggle('hpc-chip-active', c.dataset.industry === key));

    if (label) label.textContent = document.body.classList.contains('ar') ? d.ar : d.en;

    bars.forEach((bar, i) => {
      bar.style.height = d.h[i] + '%';
      bar.classList.toggle('hpc-bar-active', i === bars.length - 1);
    });

    Object.entries(lineEls).forEach(([k, el]) => {
      if (!el) return;
      el.classList.remove('hpc-iline-active', 'hpc-iline-dim');
      el.classList.add(k === key ? 'hpc-iline-active' : 'hpc-iline-dim');
    });
  }

  activate('pharma');
  chips.forEach(chip => chip.addEventListener('click', () => activate(chip.dataset.industry)));
})();

/* ─── INDUSTRY CHART (company.html) ─────────────────────── */
(function initIndustryChart() {
  const chips     = document.querySelectorAll('.story-chip[data-industry]');
  const container = document.getElementById('industry-bars');
  const label     = document.getElementById('chart-label');
  if (!chips.length || !container) return;

  const years = ['1999','2004','2009','2014','2019','2025'];

  const datasets = {
    pharma:   { en:'Pharma Growth — MENA',   ar:'نمو قطاع الأدوية في المنطقة',       h:[6,11,22,40,62,100] },
    food:     { en:'F&B Growth — MENA',       ar:'نمو قطاع الغذاء في المنطقة',         h:[25,35,48,62,78,100] },
    chemical: { en:'Chemical Growth — MENA',  ar:'نمو القطاع الكيميائي في المنطقة',    h:[18,28,42,58,76,100] }
  };

  const lineEls = {
    pharma:   document.getElementById('scl-p'),
    food:     document.getElementById('scl-f'),
    chemical: document.getElementById('scl-c'),
  };

  /* Build bars once */
  const bars = years.map((yr, i) => {
    const bar  = document.createElement('div');
    const isLast = i === years.length - 1;
    bar.className = 'story-bar' + (isLast ? ' story-bar-active' : '');
    bar.style.cssText = 'height:0%;transition:height .7s cubic-bezier(.4,0,.2,1)';
    const span = document.createElement('span');
    span.textContent = yr;
    bar.appendChild(span);
    container.appendChild(bar);
    return bar;
  });

  function activate(key) {
    const entry = datasets[key];
    if (!entry) return;
    if (label) {
      label.dataset.en  = entry.en;
      label.dataset.ar  = entry.ar;
      label.textContent = document.body.classList.contains('ar') ? entry.ar : entry.en;
    }
    bars.forEach((bar, i) => {
      bar.style.height = entry.h[i] + '%';
      bar.classList.toggle('story-bar-active', i === bars.length - 1);
    });
    chips.forEach(c => c.classList.toggle('story-chip-active', c.dataset.industry === key));
    Object.entries(lineEls).forEach(([k, el]) => {
      if (!el) return;
      el.classList.remove('scl-iline-active');
      el.classList.toggle('scl-iline-active', k === key);
    });
  }

  function deactivate() {
    chips.forEach(c => c.classList.remove('story-chip-active'));
    bars.forEach(bar => { bar.style.height = '0%'; });
    if (label) label.textContent = '';
    Object.values(lineEls).forEach(el => el?.classList.remove('scl-iline-active'));
  }

  /* Default: show pharma on load */
  setTimeout(() => activate('pharma'), 300);

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const already = chip.classList.contains('story-chip-active');
        deactivate();
        if (!already) activate(chip.dataset.industry);
      });
    });
  } else {
    chips.forEach(chip => {
      chip.addEventListener('mouseenter', () => activate(chip.dataset.industry));
      chip.addEventListener('mouseleave', () => activate('pharma'));
    });
  }
})();

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

/* ─── VISIT COUNTER (index.html) ────────────────────────── */
(function initVisitCounter() {
  const el = document.getElementById('visit-counter');
  if (!el) return;

  const alreadyCounted = sessionStorage.getItem('etta_visit_counted');
  const method = alreadyCounted ? 'GET' : 'POST';

  fetch('https://ettasystems.com/counter.php', { method })
    .then(r => r.json())
    .then(data => {
      if (!alreadyCounted) sessionStorage.setItem('etta_visit_counted', '1');
      const target = data.count || 0;
      const duration = 1600;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(tick);
    })
    .catch(() => { el.textContent = '—'; });
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
