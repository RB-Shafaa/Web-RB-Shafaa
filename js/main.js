/* =========================================================
   RUMAH BELAJAR SHAFAA — script.js
   Vanilla JS: theme switcher, smooth nav, slider, reveal,
   counter, typing, PPDB form, gallery, blog, modal, toast.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader')?.classList.add('is-hidden'), 400);
  });

  /* ---------- Year ---------- */
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Isi Tahun Otomatis di Footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------- Theme ---------- */
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('shafaa-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  on(themeToggle, 'click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', now);
    localStorage.setItem('shafaa-theme', now);
    toast(now === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif');
  });

  /* ---------- Navbar scroll + active link ---------- */
  const navbar = $('#navbar');
  const progress = $('#scrollProgress');
  const navLinks = $$('.nav__link');
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  let lastScrollTop = 0;
  const scrollThreshold = 50;

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > 20);

    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = ((y / h) * 100).toFixed(2) + '%';

    // Active link
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop - 120 <= y) current = s.id;
    }
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));

    // Back to top
    $('#toTop').classList.toggle('is-visible', y > 500);

    // Auto Hide/Show Navbar on Scroll
    if (y <= scrollThreshold) {
      navbar.classList.remove('is-hidden');
    } else {
      if (y > lastScrollTop) {
        navbar.classList.add('is-hidden');
      } else {
        navbar.classList.remove('is-hidden');
      }
    }

    lastScrollTop = y <= 0 ? 0 : y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = $('#hamburger');
  const nav = $('#nav');

  function lockBodyScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
    document.documentElement.style.overflow = lock ? 'hidden' : '';
  }
  
  on(hamburger, 'click', () => {
    const open = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    lockBodyScroll(open);
  });

  navLinks.forEach(a => on(a, 'click', () => {
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    lockBodyScroll(false);
  }));

  /* ---------- Search ---------- */
  const searchBtn = $('#searchBtn');
  const searchOv = $('#searchOverlay');
  const searchInput = $('#searchInput');
  const searchRes = $('#searchResults');
  const closeSearch = $('#closeSearch');
  const searchIndex = [
    { title: 'Home', href: '#home', desc: 'Beranda Rumah Belajar Shafaa' },
    { title: 'Sambutan Kepala Sekolah', href: '#sambutan', desc: 'Salam & pengantar dari Kepala Sekolah' },
    { title: 'Profil Sekolah', href: '#profil', desc: 'Sejarah, visi, misi, guru, fasilitas' },
    { title: 'Kurikulum & Akademik', href: '#akademik', desc: 'Kurikulum, jadwal, kalender, prestasi' },
    { title: 'SPMB Online', href: '#ppdb', desc: 'Pendaftaran siswa baru' },
    { title: 'Galeri', href: '#galeri', desc: 'Momen kegiatan Shafaa' },
    { title: 'Blog', href: '#blog', desc: 'Artikel & insight pendidikan' },
    { title: 'Kontak', href: '#kontak', desc: 'Alamat, telepon, email, sosial media' },
  ];
  on(searchBtn, 'click', () => { searchOv.classList.add('is-open'); setTimeout(() => searchInput.focus(), 200); });
  on(closeSearch, 'click', () => searchOv.classList.remove('is-open'));
  const renderSearchResults = () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchRes.innerHTML = ''; return; }
    const found = searchIndex.filter(i => (i.title + i.desc).toLowerCase().includes(q));
    searchRes.innerHTML = found.length
      ? found.map(f => `<a href="${f.href}"><b>${f.title}</b><br/><small style="color:var(--muted)">${f.desc}</small></a>`).join('')
      : '<p class="no-res">Tidak ada hasil ditemukan.</p>';
  };
  on(searchInput, 'input', renderSearchResults);
  searchRes.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    searchOv.classList.remove('is-open');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') searchOv.classList.remove('is-open'); });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Counter animation ---------- */
  const counters = $$('[data-counter]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.counter;
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('id-ID') + (target >= 100 ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Typing effect ---------- */
  const typingEl = $('#typing');
  const words = ['Sholeh', 'Cerdas', 'Intelek'];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    if (!typingEl) return;
    const w = words[wi];
    typingEl.textContent = w.substring(0, ci);
    if (!deleting && ci < w.length) { ci++; setTimeout(type, 90); }
    else if (deleting && ci > 0) { ci--; setTimeout(type, 40); }
    else {
      deleting = !deleting;
      if (!deleting) wi = (wi + 1) % words.length;
      setTimeout(type, deleting ? 1200 : 300);
    }
  }
  type();
  /* ---------- Gambar Awal ----------*/
  document.addEventListener("DOMContentLoaded", () => {
    const offlineImageSrc = 'images/Modal Gambar Tidak Tersedia.png';

    const images = document.querySelectorAll('img.check-offline');

    images.forEach(img => {
      if (!navigator.onLine) {
        img.src = offlineImageSrc;
      }

      img.onerror = function () {
        this.onerror = null;
        this.src = offlineImageSrc;
      };
    });
  });
  /* ---------- Slider ---------- */
  const track = $('#sliderTrack'); const slides = $$('.slide', track);
  const dotsWrap = $('#sliderDots');
  let idx = 0;
  const offlineImageSrc = 'images/Modal Gambar Tidak Tersedia.png';

  function updateSlideImages() {
    slides.forEach(slide => {
      const img = slide.querySelector('img.check-offline');
      if (img) {
        if (!img.dataset.src && !img.src.includes('Modal Gambar Tidak Tersedia.png')) {
          img.dataset.src = img.src;
        }

        if (!navigator.onLine) {
          img.src = offlineImageSrc;
        } else if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        img.onerror = function () {
          this.onerror = null;
          this.src = offlineImageSrc;
        };
      }
    });
  }

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    if (i === 0) b.classList.add('is-active');
    on(b, 'click', () => go(i));
    dotsWrap.appendChild(b);
  });

  function go(i) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    $$('#sliderDots button').forEach((d, di) => d.classList.toggle('is-active', di === idx));

    updateSlideImages();
  }

  on($('#prevSlide'), 'click', () => go(idx - 1));
  on($('#nextSlide'), 'click', () => go(idx + 1));

  let slideTimer = setInterval(() => go(idx + 1), 5000);

  $('#slider')?.addEventListener('mouseenter', () => clearInterval(slideTimer));
  $('#slider')?.addEventListener('mouseleave', () => slideTimer = setInterval(() => go(idx + 1), 5000));

  updateSlideImages();

  /* ---------- Teachers data ---------- */
  /*const teachers = [
    { name: 'Ust. Sri Rahayu, S.Pd.', subj: 'Matematika', cat: 'Sains', email: 'sri@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Mulyani', subj: 'Fisika', cat: 'Sains', email: 'mulyani@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Dasinih', subj: 'Fiqih', cat: 'Agama', email: 'dasinih@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Citra Arum Sari', subj: 'Bahasa Inggris', cat: 'Bahasa', email: 'citra@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Luvita Rahayu', subj: 'Bahasa Arab', cat: 'Bahasa', email: 'luvita@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Putri Wulandari', subj: 'Sejarah', cat: 'Sosial', email: 'putri@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Mariyah Qitbiyah', subj: 'Biologi', cat: 'Sains', email: 'mariyah@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
    { name: 'Ust. Anisatur Rohmah', subj: 'Ekonomi', cat: 'Sosial', email: 'anisatur@shafaa.sch.id', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70' },
  ];
  const tgrid = $('#teachersGrid');
  function renderTeachers(cat = 'all') {
    if (!tgrid) return;
    tgrid.innerHTML = teachers.filter(t => cat === 'all' || t.cat === cat).map(t => `
      <article class="glass-card teacher-card" data-reveal>
        <img loading="lazy" alt="Foto ${t.name}" src="${t.img}" />
        <b>${t.name}</b>
        <div class="subj">${t.subj}</div>
        <div class="em">${t.email}</div>
      </article>`).join('');
    $$('#teachersGrid [data-reveal]').forEach(el => { el.classList.add('is-visible'); });
  }
  renderTeachers();
  $$('#teacherFilter .chip').forEach(c => on(c, 'click', () => {
    $$('#teacherFilter .chip').forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    renderTeachers(c.dataset.subject);
  }));*/

  const teachers = [
    { name: 'Ust. Sri Rahayu, S.Pd.', subj: 'Matematika', cat: 'Sains', email: '' },
    { name: 'Ust. Mulyani', subj: 'Fisika', cat: 'Sains', email: '' },
    { name: 'Ust. Dasinih', subj: 'Fiqih', cat: 'Agama', email: '' },
    { name: 'Ust. Citra Arum Sari', subj: 'Bahasa Inggris', cat: 'Bahasa', email: '' },
    { name: 'Ust. Luvita Rahayu', subj: 'Bahasa Arab', cat: 'Bahasa', email: '' },
    { name: 'Ust. Putri Wulandari', subj: 'Sejarah', cat: 'Sosial', email: '' },
    { name: 'Ust. Mariyah Qitbiyah', subj: 'Biologi', cat: 'Sains', email: '' },
    { name: 'Ust. Anisatur Rohmah', subj: 'Ekonomi', cat: 'Sosial', email: '' },
  ];
  const tgrid = $('#teachersGrid');
  function renderTeachers(cat = 'all') {
    if (!tgrid) return;
    tgrid.innerHTML = teachers.filter(t => cat === 'all' || t.cat === cat).map(t => `
      <article class="glass-card teacher-card" data-reveal>
        <div class="teacher-avatar-icon">
          <i class="fa-solid fa-circle-user" aria-hidden="true"></i>
        </div>
        <b>${t.name}</b>
        <div class="subj">${t.subj}</div>
        <div class="em">${t.email}</div>
      </article>`).join('');
    $$('#teachersGrid [data-reveal]').forEach(el => { el.classList.add('is-visible'); });
  }
  renderTeachers();
  $$('#teacherFilter .chip').forEach(c => on(c, 'click', () => {
    $$('#teacherFilter .chip').forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    renderTeachers(c.dataset.subject);
  }));

  /* ---------- Gallery Data ---------- */
  const galleryImages = [
    { cat: 'Kegiatan', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Wisuda', src: 'https://lh3.googleusercontent.com/d/11bg5o_Q_Wge-_I7xl9c7s04B7HoOkWjp' },
    { cat: 'Upacara', src: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Ekstrakurikuler', src: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Wisuda', src: 'https://lh3.googleusercontent.com/d/15cEVBAbmAIHUaj7jjUEQ1V63LogGYb4D' },
    { cat: 'Kegiatan', src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Lomba', src: 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Kegiatan', src: 'https://lh3.googleusercontent.com/d/1MvK9iWtnzLad2C4ttUev-QzkrrgGhebu' },
    { cat: 'Wisuda', src: 'https://lh3.googleusercontent.com/d/1rO-8Ns8UpE-49lsnZPbtcqubxHbkIaf4' },
    { cat: 'Ekstrakurikuler', src: 'https://lh3.googleusercontent.com/d/1wuGd6d2pjWiUuNptD3DCvXDsD1ptjnMo' },
    { cat: 'Upacara', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Lomba', src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Wisuda', src: 'https://lh3.googleusercontent.com/d/1TCqHsD_YLsxilBiYdRG_0d1omDkfqKNb' },
    { cat: 'Kegiatan', src: 'https://lh3.googleusercontent.com/d/1tydDKOMLFL1sDS2ktA0B9fatq6bmBu7S' },
  ];

  const masonryElement = $('#masonry');

  /* ---------- Lightbox Baru ---------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  let lbList = [], lbIndex = 0;

  function openLightbox(list, i) {
    lbList = list;
    lbIndex = i;
    lbImg.src = list[i].src;

    lbImg.onerror = function () {
      this.onerror = null;
      this.src = 'images/Modal Gambar Tidak Tersedia.png';
    };

    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  on($('#lbClose'), 'click', closeLightbox);

  on($('#lbPrev'), 'click', () => {
    lbIndex = (lbIndex - 1 + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
  });

  on($('#lbNext'), 'click', () => {
    lbIndex = (lbIndex + 1) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') $('#lbPrev').click();
    if (e.key === 'ArrowRight') $('#lbNext').click();
  });

  /* -------- Gallery Render Functions -------- */
  function renderGallery(cat = 'all') {
    const list = galleryImages.filter(g => cat === 'all' || g.cat === cat);

    if (list.length === 0) {
      masonryElement.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #6b7280; padding: 40px;">Belum ada foto untuk kategori ini.</p>`;
      return;
    }

    masonryElement.innerHTML = list.map((g, i) => `
    <div class="item" data-index="${i}">
        <span class="cat">${g.cat}</span>
        <img loading="lazy" alt="${g.cat}" src="${g.src}" onerror="this.onerror=null; this.src='images/Modal Gambar Tidak Tersedia.png';" />
    </div>`).join('');

    $$('#masonry .item').forEach((it, i) => on(it, 'click', () => openLightbox(list, i)));
  }

  renderGallery();

  /* -------- Filter System -------- */
  $$('#galleryFilter .chip').forEach(c => on(c, 'click', () => {
    $$('#galleryFilter .chip').forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    renderGallery(c.dataset.cat);
  }));

  /* ---------- Blog ---------- */
  const posts = [
    { title: '5 Tips Belajar Efektif untuk Siswa Digital', cat: 'Tips', date: '10 Feb 2026', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70', excerpt: 'Pelajari strategi belajar yang tetap fokus di era distraksi digital.', url: 'artikel/tips_belajar_digital.html' },
    { title: 'Menanamkan Adab Sejak Dini di Sekolah', cat: 'Karakter', date: '02 Feb 2026', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=70', excerpt: 'Mengapa adab harus lebih dulu diajarkan dibanding ilmu.', url: 'artikel/adab_di_sekolah.html' },
    { title: 'Coding untuk Anak', cat: 'Teknologi', date: '28 Jan 2026', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=70', excerpt: 'Panduan orang tua memperkenalkan coding secara menyenangkan.', url: 'artikel/coding_untuk_anak.html' },
    { title: 'Manfaat Program Tahfidz Al-Qur\'an', cat: 'Religi', date: '20 Jan 2026', img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80', excerpt: 'Dampak positif hafalan Al-Qur\'an bagi kecerdasan anak.', url: 'artikel/program_tahfidz_al_qur_an.html' },

    { title: 'Peran Ekstrakurikuler dalam Pembentukan Karakter', cat: 'Karakter', date: '12 Jan 2026', img: 'https://storage.googleapis.com/data.ayo.co.id/photos/77445/SEO%20HDI%204/81.%20Inilah%20Ukuran%20Standar%20Lapangan%20Mini%20Soccer%20yang%20Harus%20Diketahui.jpg', excerpt: 'Ekstrakurikuler bukan sekadar kegiatan tambahan.', url: 'artikel/peran_ekskul.html' },
    { title: 'Persiapan Ujian Nasional', cat: 'Akademik', date: '05 Jan 2026', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=70', excerpt: 'Susun jadwal, kelola stres, dan tingkatkan performa.', url: 'artikel/persiapan_ujian.html' },
    { title: 'AI di Kelas', cat: 'Teknologi', date: '28 Des 2025', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=70', excerpt: 'Bagaimana guru bijak memanfaatkan AI.', url: 'artikel/ai_dikelas.html' },
    { title: 'Menumbuhkan Minat Baca pada Siswa', cat: 'Tips', date: '20 Des 2025', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80', excerpt: 'Trik sederhana yang bisa diterapkan di rumah.', url: 'artikel/menumbuhkan_minat_baca.html' },
    { title: 'Public Speaking Sejak SMP', cat: 'Life Skill', date: '15 Des 2025', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=70', excerpt: 'Latihan simple untuk anak percaya diri berbicara.', url: 'artikel/publik_speaking.html' }
  ];

  const perPage = 6;
  let page = 1;
  const bg = $('#blogGrid'), pn = $('#pagination');

  function renderBlog() {
    const start = (page - 1) * perPage;
    const list = posts.slice(start, start + perPage);

    bg.innerHTML = list.map(p => `
    <article class="glass-card blog-card" data-reveal>
      <div class="thumb">
        <img loading="lazy" alt="${p.title}" src="${p.img}" 
             onerror="handleImageError(this)" />
      </div>
      <div class="body">
        <div class="meta"><span>${p.date}</span><span class="badge badge--purple">${p.cat}</span></div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="actions">
          <button class="link-arrow read-more-btn" data-title="${p.title}" data-url="${p.url || ''}">Baca Selengkapnya →</button>
          <button class="icon-mini" data-share="${p.title}" data-url="${p.url || ''}" aria-label="Bagikan">
            <i class="fa-regular fa-share-from-square"></i>
          </button>
          <button class="icon-mini" data-copy="${p.title}" aria-label="Salin link">
            <i class="fa-solid fa-link"></i>
          </button>
          <button class="icon-mini" data-print="${p.url || ''}" aria-label="Print">
            <i class="fa-solid fa-print"></i>
          </button>
        </div>
      </div>
    </article>`).join('');

    $$('#blogGrid [data-reveal]').forEach(el => el.classList.add('is-visible'));

    const pages = Math.ceil(posts.length / perPage);
    pn.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
      const b = document.createElement('button');
      b.textContent = i;
      if (i === page) b.classList.add('is-active');
      on(b, 'click', () => { page = i; renderBlog(); $('#blog').scrollIntoView({ behavior: 'smooth' }); });
      pn.appendChild(b);
    }

    // -------------------------------------------------------------
    // LOGIKA SHARE ARTIKEL YANG AKURAT UNTUK GITHUB PAGES
    // -------------------------------------------------------------
    $$('#blogGrid [data-share]').forEach(btn => on(btn, 'click', async () => {
      const title = btn.dataset.share;
      const articleUrl = btn.dataset.url;

      if (!articleUrl) {
        toast('Halaman untuk artikel ini belum tersedia.', 'error');
        return;
      }

      const urlToShare = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + articleUrl;

      if (navigator.share) {
        try {
          await navigator.share({ title, url: urlToShare });
        } catch (error) {
          if (error.name !== 'AbortError') {
            toast('Gagal membagikan artikel.', 'error');
          }
        }
      } else {
        toast('Fitur share tidak didukung browser ini', 'error');
      }
    }));

    $$('#blogGrid [data-copy]').forEach(btn => on(btn, 'click', () => {
      const articleUrl = btn.dataset.url;

      const accurateUrl = articleUrl
        ? (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + articleUrl)
        : location.href;

      navigator.clipboard.writeText(accurateUrl);
      toast('Link artikel berhasil disalin!', 'success');
    }));

    // -------------------------------------------------------------
    // LOGIKA CETAK ARTIKEL KHUSUS
    // -------------------------------------------------------------
    $$('#blogGrid [data-print]').forEach(btn => on(btn, 'click', async () => {
      const targetUrl = btn.dataset.print;

      if (!targetUrl) {
        toast('Halaman artikel ini belum tersedia untuk dicetak.', 'error');
        return;
      }

      toast('Menyiapkan dokumen untuk dicetak...', 'success');

      let iframe = document.getElementById('printFrame');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'printFrame';
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
      }

      iframe.src = targetUrl;

      iframe.onload = () => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          toast('Gagal mencetak artikel. Periksa izin akses file.', 'error');
        }
      };
    }));

    // -------------------------------------------------------------
    // LOGIKA BARU UNTUK TOMBOL "Baca Selengkapnya"
    // -------------------------------------------------------------
    $$('#blogGrid .read-more-btn').forEach(btn => on(btn, 'click', async (e) => {
      const targetUrl = btn.dataset.url;
      const articleTitle = btn.dataset.title;

      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      if (targetUrl !== '') {
        try {
          const response = await fetch(targetUrl, { method: 'HEAD' });

          if (response.ok) {
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';

            setTimeout(() => {
              window.location.href = targetUrl;
            }, 300);

          } else {
            openModal(articleTitle, 'Mohon maaf, halaman untuk artikel ini belum tersedia atau sedang dalam perbaikan.');
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
          }
        } catch (error) {
          openModal(articleTitle, 'Gagal memuat artikel. Silakan periksa koneksi internet Anda.');
          btn.innerHTML = originalText;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }
      } else {
        openModal(articleTitle, 'Artikel ini akan segera tayang penuh di halaman blog Shafaa. Nantikan update terbarunya!');
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      }
    }));
  }

  renderBlog();

  /* ---------- Modal ---------- */
  const modal = $('#modal');
  function openModal(title, body) {
    $('#modalTitle').textContent = title;
    $('#modalBody').textContent = body;
    modal.classList.add('is-open');
  }
  on($('#modalClose'), 'click', () => modal.classList.remove('is-open'));
  $$('.ann-card [data-modal]').forEach(b => on(b, 'click', () => openModal(b.dataset.modal, 'Info lengkap segera diumumkan. Silakan pantau website secara berkala atau ikuti media sosial resmi Rumah Belajar Shafaa.')));

  setTimeout(() => {
    if (!sessionStorage.getItem('shafaa-popup')) {
      openModal('🎉 PPDB 2027/2028 Dibuka!', 'Gelombang 1 dibuka 1 Maret — 30 April 2027, Gelombang 2 dibuka 1 Mei — 30 Juni 2027. Daftar sekarang & dapatkan diskon awal + kesempatan beasiswa prestasi.');
      sessionStorage.setItem('shafaa-popup', '1');
    }
  }, 2500);

  /* ---------- Tabs Akademik ---------- */
  $$('.tab').forEach(t => on(t, 'click', () => {
    $$('.tab').forEach(x => x.classList.remove('is-active'));
    $$('.tab-panel').forEach(p => p.classList.remove('is-active'));
    t.classList.add('is-active');
    $(`.tab-panel[data-panel="${t.dataset.tab}"]`).classList.add('is-active');
  }));

  function setFieldErrorState(field, hasError) {
    if (!field) return;

    if (hasError) {
      field.style.borderColor = '#ef4444';
      field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.12)';
      field.classList.add('is-invalid');
    } else {
      field.style.borderColor = '';
      field.style.boxShadow = '';
      field.classList.remove('is-invalid');
    }
  }

  function validateFormFields(form, options = {}) {
    const { skipEmpty = [] } = options;
    const fields = form.querySelectorAll('input, select, textarea');
    let ok = true;

    fields.forEach((field) => {
      const isOptionalEmpty = skipEmpty.includes(field.id || field.name) && field.value.trim() === '';
      if (isOptionalEmpty) {
        setFieldErrorState(field, false);
        return;
      }

      const hasError = !field.checkValidity();
      setFieldErrorState(field, hasError);
      if (hasError) ok = false;
    });

    return ok;
  }

  function bindFormValidation(form) {
    if (!form || form.dataset.validationBound === 'true') return;

    form.setAttribute('novalidate', 'novalidate');
    form.dataset.validationBound = 'true';

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      const resetField = () => {
        if (field.checkValidity()) {
          setFieldErrorState(field, false);
        }
      };

      on(field, 'input', resetField);
      on(field, 'change', resetField);
      on(field, 'blur', resetField);
    });
  }

  /* ---------- Contact Form ---------- */
  const contactForm = $('#contactForm');
  if (contactForm) {
    bindFormValidation(contactForm);
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateFormFields(contactForm)) {
        return toast('Mohon lengkapi semua kolom dengan benar', 'error');
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';

      try {
        const formData = new FormData(contactForm);
        const { error } = await supabaseClient
          .from('website_feedback')
          .insert([{
            cname: formData.get('cname'),
            cemail: formData.get('cemail'),
            cmsg: formData.get('cmsg')
          }]);

        if (error) throw error;

        contactForm.reset();
        toast('Pesan berhasil dikirim! Terima kasih atas masukan Anda.', 'success');
      } catch (error) {
        console.error('Contact error:', error);
        toast('Gagal mengirim pesan. Silakan coba lagi.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* ---------- Newsletter Form ---------- */
  const newsForm = $('#newsForm');
  if (newsForm) {
    bindFormValidation(newsForm);
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsForm.querySelector('input[type="email"]');

      if (!emailInput) {
        return toast('Email tidak valid', 'error');
      }

      const isValid = emailInput.checkValidity();
      setFieldErrorState(emailInput, !isValid);
      if (!isValid) {
        return toast('Email tidak valid', 'error');
      }

      const submitBtn = newsForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

      try {
        const { error } = await supabaseClient
          .from('newsletter_subscribers')
          .insert([{ email: emailInput.value }]);

        if (error) {
          if (error.code === '23505') {
            toast('Email ini sudah berlangganan newsletter.', 'success');
            newsForm.reset();
            return;
          }
          throw error;
        }

        newsForm.reset();
        toast('Berhasil! Terima kasih telah berlangganan.', 'success');
      } catch (error) {
        console.error('Newsletter error:', error);
        toast('Gagal mendaftar langganan. Coba lagi nanti.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* ---------- PPDB Form ---------- */
  const ppdb = $('#ppdbForm');
  const steps = $$('.stepper .step');

  function updateStepper(currentStep) {
    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index < currentStep);
    });
  }
  updateStepper(1);

  async function uploadFile(file, folderName) {
    if (!file || file.size === 0) return null;
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filePath = `${folderName}/${Date.now()}_${safeName}`;
    
    const { error } = await supabaseClient.storage
      .from('ppdb_files')
      .upload(filePath, file);
      
    if (error) throw new Error(`Gagal upload ${folderName}: ${error.message}`);
    
    const { data } = supabaseClient.storage
      .from('ppdb_files')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  }

  if (ppdb) {
    bindFormValidation(ppdb);
    ppdb.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isValid = validateFormFields(ppdb, { skipEmpty: ['nisn', 'asal', 'asal_sekolah'] });
      if (!isValid) {
        return toast('Mohon lengkapi semua data dengan benar', 'error');
      }

      const submitBtn = ppdb.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah File & Data...';
      toast('Proses pendaftaran sedang berjalan...', 'success');

      try {
        const formData = new FormData(ppdb);

        const [fotoUrl, berkasUrl, fotoBuktiTfUrl] = await Promise.all([
          uploadFile(formData.get('foto'), 'foto'),
          uploadFile(formData.get('berkas'), 'berkas'),
          uploadFile(formData.get('foto_bukti_tf'), 'bukti_tf')
        ]);

        const { error: dbError } = await supabaseClient
          .from('registrations')
          .insert([{
            nama_lengkap: formData.get('nama_lengkap'),
            nisn: formData.get('nisn') || null,
            tempat_lahir: formData.get('tempat_lahir'),
            tanggal_lahir: formData.get('tanggal_lahir'),
            gender: formData.get('gender'),
            jurusan: formData.get('jurusan'),
            alamat: formData.get('alamat'),
            asal_sekolah: formData.get('asal_sekolah') || null,
            ortu: formData.get('ortu'),
            nomor_telepon: formData.get('nomor_telepon'),
            email: formData.get('email'),
            foto_url: fotoUrl,
            berkas_url: berkasUrl,
            foto_bukti_tf_url: fotoBuktiTfUrl
          }]);

        if (dbError) throw dbError;

        updateStepper(steps.length);
        ppdb.reset();
        toast('Pendaftaran berhasil dikirim! Data telah diterima.', 'success');
      } catch (error) {
        console.error('PPDB error:', error);
        toast('Gagal mengirim pendaftaran. Periksa koneksi atau ukuran file.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
  async function handleDownloadBrosur(jenjang, filename, pdfUrl) {
    try {
      const response = await fetch(pdfUrl, { method: 'HEAD' });

      if (!response.ok) {
        toast(`Maaf, brosur ${jenjang} belum tersedia saat ini.`, 'error');
        return;
      }

      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast(`Brosur ${jenjang} berhasil diunduh`, 'success');
    } catch (error) {
      toast(`Gagal mengunduh brosur ${jenjang}. File tidak ditemukan.`, 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btnDownloadMain = document.getElementById('downloadBrosur');
    const modalBrosur = document.getElementById('modalBrosur');
    const btnClose = document.getElementById('closeModal');
    const btnJenjangList = document.querySelectorAll('.btn-jenjang');

    if (btnDownloadMain && modalBrosur) {
      btnDownloadMain.addEventListener('click', (e) => {
        e.preventDefault();
        modalBrosur.classList.add('is-open');
      });
    }

    if (btnClose && modalBrosur) {
      btnClose.addEventListener('click', () => {
        modalBrosur.classList.remove('is-open');
      });
    }

    btnJenjangList.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const jenjang = btn.getAttribute('data-jenjang');

        if (modalBrosur) modalBrosur.classList.remove('is-open');

        switch (jenjang) {
          case 'tk':
            handleDownloadBrosur('TK', 'Brosur-TK-Shafaa.pdf', 'brosur/Brosur TK.pdf');
            break;
          case 'sd':
            handleDownloadBrosur('SD', 'Brosur-SD-Shafaa.pdf', 'brosur/Brosur SD.pdf');
            break;
          case 'smp':
            handleDownloadBrosur('SMP', 'Brosur-SMP-Shafaa.pdf', 'brosur/Brosur SMP.pdf');
            break;
          case 'sma':
            handleDownloadBrosur('SMA', 'Brosur-SMA-Shafaa.pdf', 'brosur/Brosur SMA.pdf');
            break;
        }
      });
    });
  });

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = 'toast is-show ' + (type === 'error' ? 'is-error' : 'is-success');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  }

  /* ---------- Image Error & Offline Handler ---------- */
  window.handleImageError = function (imgElement) {
    imgElement.onerror = null;

    if (!navigator.onLine) {
      imgElement.src = 'images/Modal Gambar.png';
    } else {
      imgElement.src = 'images/Modal Thumbnail.png';
    }
  };

  window.addEventListener('online', () => {
    toast('Koneksi internet pulih', 'success');
  });

  window.addEventListener('offline', () => {
    toast('Anda sedang offline. Beberapa gambar mungkin tidak dimuat', 'error');
  });

  /* ---------- Ripple ---------- */
  $$('.ripple').forEach(b => on(b, 'click', (e) => {
    const r = document.createElement('span');
    r.className = 'rp';
    const size = Math.max(b.clientWidth, b.clientHeight);
    r.style.width = r.style.height = size + 'px';
    const rect = b.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top = (e.clientY - rect.top - size / 2) + 'px';
    b.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }));

  /* ---------- Smooth scroll for hash links ---------- */
  $$('a[href^="#"]').forEach(a => on(a, 'click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));

  /* ---------- Back to Top Action ---------- */
  const toTopBtn = $('#toTop');
  if (toTopBtn) {
    on(toTopBtn, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---------- Global Click Handler untuk Menutup Overlay & Sidebar ---------- */
  document.addEventListener('click', (e) => {
    const modalBrosur = document.getElementById('modalBrosur');

    if (modal && modal.classList.contains('is-open') && e.target === modal) {
      modal.classList.remove('is-open');
    }

    if (lb && lb.classList.contains('is-open') && e.target === lb) {
      closeLightbox();
    }

    if (modalBrosur && modalBrosur.classList.contains('is-open') && e.target === modalBrosur) {
      modalBrosur.classList.remove('is-open');
    }

    // 1. Tutup Sidebar Mobile jika diklik di luar area nav & hamburger
    if (nav.classList.contains('is-open')) {
      const isClickInsideNav = nav.contains(e.target);
      const isClickOnHamburger = hamburger.contains(e.target);
      if (!isClickInsideNav && !isClickOnHamburger) {
        nav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    // 2. Tutup Search Overlay jika diklik di luar kotak pencarian
    if (searchOv.classList.contains('is-open')) {
      const searchInner = searchOv.querySelector('.search-overlay__inner');
      const searchResults = searchOv.querySelector('.search-results');
      const isClickOnSearchBtn = searchBtn.contains(e.target);
      const isInsideSearchBox = (searchInner && searchInner.contains(e.target)) || (searchResults && searchResults.contains(e.target));
      
      if (!isInsideSearchBox && !isClickOnSearchBtn) {
        searchOv.classList.remove('is-open');
      }
    }
  });

})();