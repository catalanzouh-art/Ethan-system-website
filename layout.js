/* ═══════════════════════════════════════════════════════
   ETTA SYSTEMS — Shared Layout (Navbar + Footer)
   Injected into every page automatically.
═══════════════════════════════════════════════════════ */
(function () {

  /* ── NAV LINKS ────────────────────────────────────────── */
  const NAV_LINKS = [
    { href: 'index.html',    en: 'Home',     ar: 'الرئيسية' },
    { href: 'company.html',  en: 'Company',  ar: 'الشركة'   },
    { href: 'products.html', en: 'Products', ar: 'المنتجات' },
    { href: 'services.html', en: 'Services', ar: 'الخدمات'  },
    { href: 'partners.html', en: 'Partners', ar: 'الشركاء'  },
    { href: 'contact.html',  en: 'Contact',  ar: 'اتصل بنا' },
  ];

  /* ── DETECT ACTIVE PAGE ──────────────────────────────── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  /* ── BUILD NAVBAR ────────────────────────────────────── */
  const navLinksHTML = NAV_LINKS.map(l =>
    `<a href="${l.href}"
        class="nav-link${currentFile === l.href ? ' active' : ''}"
        data-en="${l.en}"
        data-ar="${l.ar}">${l.en}</a>`
  ).join('');

  const NAVBAR_HTML = `
<header class="navbar" id="navbar">
  <div class="container nav-inner">

    <a href="index.html" class="logo">
      <img src="images/logo.png" alt="Etta Systems" class="logo-img logo-img-white" />
      <img src="images/logo.png" alt="Etta Systems" class="logo-img logo-img-dark"  />
    </a>

    <div class="nav-actions">
      <button class="lang-btn" id="lang-btn" aria-label="Switch Language">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 2C12 2 8 7 8 12s4 10 4 10M12 2c0 0 4 5 4 10s-4 10-4 10M2 12h20"
                stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span id="lang-label">AR</span>
      </button>
      <a href="contact.html" class="btn btn-primary nav-cta"
         data-en="Get Started" data-ar="ابدأ الآن">Get Started</a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

  </div>
</header>

<nav class="nav-links" id="nav-links">${navLinksHTML}</nav>`;

  /* ── BUILD FOOTER ─────────────────────────────────────── */
  const FOOTER_HTML = `
<footer class="footer">

  <!-- Main footer body -->
  <div class="footer-body">
    <div class="container">
      <div class="footer-main-grid">

        <!-- Brand column -->
        <div class="footer-brand-col">
          <a href="index.html" class="footer-logo-link">
            <img src="images/logo.png" alt="Etta Systems" class="logo-img-footer" />
          </a>
          <p class="footer-desc"
             data-en="Trusted industrial technology partner since 1999 — delivering world-class control systems, pharmaceutical equipment and expert consultancies across the MENA region."
             data-ar="شريك تقني صناعي موثوق منذ ١٩٩٩ — نقدم أنظمة تحكم عالمية المستوى ومعدات دوائية واستشارات متخصصة في منطقة الشرق الأوسط وشمال أفريقيا.">
            Trusted industrial technology partner since 1999 — delivering world-class control systems, pharmaceutical equipment and expert consultancies across the MENA region.
          </p>
          <!-- Social -->
          <div class="footer-social-row">
            <a href="https://www.linkedin.com/company/4874260/" target="_blank" rel="noopener" class="footer-social-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        <!-- Company links -->
        <div class="footer-links-col">
          <h4 data-en="Company" data-ar="الشركة">Company</h4>
          <ul>
            <li><a href="index.html"    data-en="Home"     data-ar="الرئيسية">Home</a></li>
            <li><a href="company.html"  data-en="About Us" data-ar="من نحن">About Us</a></li>
            <li><a href="products.html" data-en="Products" data-ar="المنتجات">Products</a></li>
            <li><a href="services.html" data-en="Services" data-ar="الخدمات">Services</a></li>
            <li><a href="partners.html" data-en="Partners" data-ar="الشركاء">Partners</a></li>
            <li><a href="contact.html"  data-en="Contact"  data-ar="اتصل بنا">Contact</a></li>
          </ul>
        </div>

        <!-- Services links -->
        <div class="footer-links-col">
          <h4 data-en="Services" data-ar="الخدمات">Services</h4>
          <ul>
            <li><a href="services.html" data-en="Instruments Calibration" data-ar="معايرة الأجهزة">Instruments Calibration</a></li>
            <li><a href="services.html" data-en="GMP Consultancies"       data-ar="استشارات GMP">GMP Consultancies</a></li>
            <li><a href="services.html" data-en="Machinery Validation"    data-ar="تحقق الآلات">Machinery Validation</a></li>
            <li><a href="products.html" data-en="Control Systems"         data-ar="أنظمة التحكم">Control Systems</a></li>
            <li><a href="products.html" data-en="Pharma Machinery"        data-ar="آلات دوائية">Pharma Machinery</a></li>
          </ul>
        </div>

        <!-- Contact info -->
        <div class="footer-contact-col">
          <h4 data-en="Contact" data-ar="تواصل">Contact</h4>
          <div class="footer-contact-list">
            <a href="https://maps.google.com/?q=Damascus,Syria" target="_blank" rel="noopener" class="footer-contact-item">
              <svg viewBox="0 0 18 18" fill="none"><path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75c0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5zm0 7.13A2.38 2.38 0 1 1 9 4.37a2.38 2.38 0 0 1 0 4.75z" fill="#16B5A6" opacity=".7"/></svg>
              <span data-en="Al Bahsa St., Damascus — Syria" data-ar="شارع البحصة، دمشق — سوريا">Al Bahsa St., Damascus — Syria</span>
            </a>
            <a href="tel:+963933525517" class="footer-contact-item">
              <svg viewBox="0 0 18 18" fill="none"><path d="M5 3.5c-.3 0-.5.2-.5.5v.5C4.5 8.7 9.3 13.5 13.5 13.5h.5c.3 0 .5-.2.5-.5v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v.5c-.9-.4-1.9-1.1-2.7-1.9-.8-.8-1.5-1.8-1.9-2.7h.5c.3 0 .5-.2.5-.5v-2a.5.5 0 0 0-.5-.5H5z" fill="#16B5A6" opacity=".7"/></svg>
              <span dir="ltr">+963 933525517</span>
            </a>
            <a href="mailto:ncatalan@ettasystems.com" class="footer-contact-item">
              <svg viewBox="0 0 18 18" fill="none"><rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="#16B5A6" stroke-width="1.2" opacity=".7"/><path d="M1.5 6l7.5 5 7.5-5" stroke="#16B5A6" stroke-width="1.2" opacity=".7"/></svg>
              <span>ncatalan@ettasystems.com</span>
            </a>
            <a href="https://ettasystems.com/" target="_blank" rel="noopener" class="footer-contact-item">
              <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#16B5A6" stroke-width="1.2" opacity=".7"/><path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5M9 1.5c0 0 3 3.5 3 7.5s-3 7.5-3 7.5M1.5 9h15" stroke="#16B5A6" stroke-width="1.2" opacity=".7"/></svg>
              <span>ettasystems.com</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="footer-bottom-bar">
    <div class="container footer-bottom-inner">
      <p data-en="© 2025 ETTA SYSTEMS. All rights reserved."
         data-ar="© ٢٠٢٥ ETTA SYSTEMS. جميع الحقوق محفوظة.">
        © 2025 ETTA SYSTEMS. All rights reserved.
      </p>
      <div class="footer-bottom-tagline">
        <span class="footer-bottom-dot"></span>
        <span data-en="Smart Solutions. Better Systems. Advanced Future."
              data-ar="حلول ذكية. نظم أفضل. مستقبل متطور.">
          Smart Solutions. Better Systems. Advanced Future.
        </span>
      </div>
      <div class="footer-bottom-location">
        <svg viewBox="0 0 14 14" fill="none"><path d="M7 1C5 1 3.5 2.5 3.5 4.5c0 2.8 3.5 6.5 3.5 6.5s3.5-3.7 3.5-6.5C10.5 2.5 9 1 7 1zm0 4.5A1.5 1.5 0 1 1 7 2a1.5 1.5 0 0 1 0 3.5z" fill="rgba(22,181,166,.5)"/></svg>
        <span data-en="Damascus, Syria" data-ar="دمشق، سوريا">Damascus, Syria</span>
      </div>
    </div>
  </div>

</footer>

<button class="scroll-top" id="scroll-top" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>`;

  /* ── INJECT ───────────────────────────────────────────── */
  document.body.insertAdjacentHTML('afterbegin', NAVBAR_HTML);
  document.body.insertAdjacentHTML('beforeend',  FOOTER_HTML);

  /* ═══════════════════════════════════════════════════════
     LANGUAGE SYSTEM
  ═══════════════════════════════════════════════════════ */
  let currentLang = localStorage.getItem('etta-lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    const isAr = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
    document.body.classList.toggle('ar', isAr);

    const label = document.getElementById('lang-label');
    if (label) label.textContent = isAr ? 'EN' : 'AR';

    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      el.textContent = isAr ? el.dataset.ar : el.dataset.en;
    });
    document.querySelectorAll('select option[data-en][data-ar]').forEach(opt => {
      opt.textContent = isAr ? opt.dataset.ar : opt.dataset.en;
    });

    localStorage.setItem('etta-lang', lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, isAr } }));
  }

  document.getElementById('lang-btn').addEventListener('click', () => {
    applyLang(currentLang === 'en' ? 'ar' : 'en');
  });

  if (currentLang === 'ar') applyLang('ar');

  /* ═══════════════════════════════════════════════════════
     NAVBAR SCROLL
  ═══════════════════════════════════════════════════════ */
  const navbar      = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    navLinks.classList.toggle('scrolled', scrolled);
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  /* ═══════════════════════════════════════════════════════
     HAMBURGER MENU
  ═══════════════════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    })
  );

  /* ═══════════════════════════════════════════════════════
     SCROLL TO TOP
  ═══════════════════════════════════════════════════════ */
  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ═══════════════════════════════════════════════════════
     AOS — ANIMATE ON SCROLL
  ═══════════════════════════════════════════════════════ */
  const aosObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.aosDelay || 0);
      setTimeout(() => entry.target.classList.add('aos-animate'), delay);
      aosObs.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

  /* ── Expose globals for page scripts ────────────────── */
  window.ETTA = {
    lang: () => currentLang,
    applyLang,
    isAr: () => currentLang === 'ar',
  };

})();
