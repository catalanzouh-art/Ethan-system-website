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
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"], .ctp-submit');
  const isAr = window.ETTA?.isAr?.() || false;

  if (btn) {
    const span = btn.querySelector('span') || btn;
    span.textContent = isAr ? 'جارٍ الإرسال...' : 'Sending…';
    btn.disabled = true;
  }

  const data = {
    name:    form.querySelector('#input-name')?.value    || '',
    email:   form.querySelector('#input-email')?.value   || '',
    company: form.querySelector('#input-company')?.value || '',
    phone:   form.querySelector('#input-phone')?.value   || '',
    subject: form.querySelector('input[name="subject"]:checked')?.value || '',
    message: form.querySelector('#input-message')?.value || '',
  };

  fetch('https://ettasystems.com/contact.php', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body:    JSON.stringify(data),
  })
  .then(res => {
    const success = document.getElementById('form-success');
    if (res.ok) {
      if (success) {
        success.textContent = isAr
          ? success.dataset.ar || 'شكراً! تم إرسال رسالتك.'
          : success.dataset.en || 'Thank you! Your message has been sent.';
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 6000);
      }
      form.reset();
    } else {
      alert(isAr ? 'حدث خطأ، حاول مجدداً.' : 'Something went wrong. Please try again.');
    }
  })
  .catch(() => alert(isAr ? 'تعذر الإرسال، تحقق من اتصالك.' : 'Send failed. Check your connection.'))
  .finally(() => {
    if (btn) {
      const span = btn.querySelector('span') || btn;
      span.textContent = isAr ? 'إرسال الرسالة' : 'Send Message';
      btn.disabled = false;
    }
  });
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

  const labels = {
    pharma:   { en: 'Pharma Growth',    ar: 'نمو القطاع الدوائي' },
    food:     { en: 'F&B Growth',       ar: 'نمو الغذاء والمشروبات' },
    chemical: { en: 'Chemical Growth',  ar: 'نمو القطاع الكيميائي' }
  };

  function activate(key) {
    chips.forEach(c => c.classList.toggle('hpc-chip-active', c.dataset.industry === key));
    if (label && labels[key]) {
      label.textContent = document.body.classList.contains('ar') ? labels[key].ar : labels[key].en;
    }
    document.querySelectorAll('.hpc-panel').forEach(p =>
      p.classList.toggle('hpc-panel-active', p.id === 'hpc-' + key)
    );
  }

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
    pharma:   { en:'Pharma Growth',   ar:'نمو القطاع الدوائي',    h:[35,48,56,68,78,100] },
    food:     { en:'F&B Growth',      ar:'نمو الغذاء والمشروبات', h:[28,40,54,65,80,100] },
    chemical: { en:'Chemical Growth', ar:'نمو القطاع الكيميائي',  h:[38,50,60,72,84,100] }
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
  }

  function deactivate() {
    chips.forEach(c => c.classList.remove('story-chip-active'));
    bars.forEach(bar => { bar.style.height = '0%'; });
    if (label) label.textContent = '';
  }

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    /* On touch devices: tap to toggle */
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const already = chip.classList.contains('story-chip-active');
        deactivate();
        if (!already) activate(chip.dataset.industry);
      });
    });
  } else {
    /* On desktop: hover to show */
    chips.forEach(chip => {
      chip.addEventListener('mouseenter', () => activate(chip.dataset.industry));
      chip.addEventListener('mouseleave', deactivate);
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
