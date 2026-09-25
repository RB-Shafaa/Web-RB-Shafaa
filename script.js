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
  on(hamburger, 'click', () => {
    const open = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.forEach(a => on(a, 'click', () => {
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
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
  on(searchInput, 'input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchRes.innerHTML = ''; return; }
    const found = searchIndex.filter(i => (i.title + i.desc).toLowerCase().includes(q));
    searchRes.innerHTML = found.length
      ? found.map(f => `<a href="${f.href}"><b>${f.title}</b><br/><small style="color:var(--muted)">${f.desc}</small></a>`).join('')
      : '<p class="no-res">Tidak ada hasil ditemukan.</p>';
  });
  $$('#searchResults a').forEach(a => on(a, 'click', () => searchOv.classList.remove('is-open')));
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

    // Ambil semua gambar yang memiliki kelas 'check-offline'
    const images = document.querySelectorAll('img.check-offline');

    images.forEach(img => {
      // 1. Cek langsung saat halaman dimuat (jika status awal sudah offline)
      if (!navigator.onLine) {
        img.src = offlineImageSrc;
      }

      // 2. Fallback otomatis jika gagal memuat (karena offline, internet putus, atau URL error)
      img.onerror = function () {
        this.onerror = null; // Mencegah infinite loop jika gambar fallback gagal
        this.src = offlineImageSrc;
      };
    });
  });
  /* ---------- Slider ---------- */
  const track = $('#sliderTrack'); const slides = $$('.slide', track);
  const dotsWrap = $('#sliderDots');
  let idx = 0;
  const offlineImageSrc = 'images/Modal Gambar Tidak Tersedia.png';

  // Fungsi untuk memuat gambar slide dengan proteksi offline & error handling
  function updateSlideImages() {
    slides.forEach(slide => {
      const img = slide.querySelector('img.check-offline');
      if (img) {
        // Simpan sumber asli di atribut data jika belum ada
        if (!img.dataset.src && !img.src.includes('Modal Gambar Tidak Tersedia.png')) {
          img.dataset.src = img.src;
        }

        if (!navigator.onLine) {
          img.src = offlineImageSrc;
        } else if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        // Fallback jika gagal load saat online
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

    // Periksa status gambar setiap kali slide digeser/berpindah
    updateSlideImages();
  }

  on($('#prevSlide'), 'click', () => go(idx - 1));
  on($('#nextSlide'), 'click', () => go(idx + 1));

  let slideTimer = setInterval(() => go(idx + 1), 5000);

  $('#slider')?.addEventListener('mouseenter', () => clearInterval(slideTimer));
  $('#slider')?.addEventListener('mouseleave', () => slideTimer = setInterval(() => go(idx + 1), 5000));

  // Jalankan sekali saat pertama kali halaman dimuat
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

    // Pertahankan fallback error image
    lbImg.onerror = function () {
      this.onerror = null;
      this.src = 'images/Modal Gambar Tidak Tersedia.png';
    };

    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Kunci scroll background
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = ''; // Kembalikan scroll
  }

  // Event Listeners Lightbox
  on($('#lbClose'), 'click', closeLightbox);

  on($('#lbPrev'), 'click', () => {
    lbIndex = (lbIndex - 1 + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
  });

  on($('#lbNext'), 'click', () => {
    lbIndex = (lbIndex + 1) % lbList.length;
    lbImg.src = lbList[lbIndex].src;
  });

  on(lb, 'click', (e) => {
    if (e.target === lb) closeLightbox();
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

    // Hubungkan item yang dirender ke fungsi Lightbox baru
    $$('#masonry .item').forEach((it, i) => on(it, 'click', () => openLightbox(list, i)));
  }

  // Inisialisasi awal
  renderGallery();

  /* -------- Filter System -------- */
  $$('#galleryFilter .chip').forEach(c => on(c, 'click', () => {
    $$('#galleryFilter .chip').forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    renderGallery(c.dataset.cat);
  }));

  /* ---------- Blog ---------- */
  const posts = [
    // Tambahkan properti "url: 'nama_file.html'" untuk artikel yang halamannya sudah jadi
    { title: '5 Tips Belajar Efektif untuk Siswa Digital', cat: 'Tips', date: '10 Feb 2026', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70', excerpt: 'Pelajari strategi belajar yang tetap fokus di era distraksi digital.', url: 'artikel/tips_belajar_digital.html' },
    { title: 'Menanamkan Adab Sejak Dini di Sekolah', cat: 'Karakter', date: '02 Feb 2026', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=70', excerpt: 'Mengapa adab harus lebih dulu diajarkan dibanding ilmu.', url: 'artikel/adab_di_sekolah.html' },
    { title: 'Coding untuk Anak', cat: 'Teknologi', date: '28 Jan 2026', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=70', excerpt: 'Panduan orang tua memperkenalkan coding secara menyenangkan.', url: 'artikel/coding_untuk_anak.html' },
    { title: 'Manfaat Program Tahfidz Al-Qur\'an', cat: 'Religi', date: '20 Jan 2026', img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80', excerpt: 'Dampak positif hafalan Al-Qur\'an bagi kecerdasan anak.', url: 'artikel/program_tahfidz_al_qur_an.html' },

    // Untuk artikel yang belum ada halamannya, biarkan tanpa properti url atau kosongkan
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

    // Pagination
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

      // Validasi: Jika artikel tidak punya file URL tersendiri
      if (!articleUrl) {
        toast('Halaman untuk artikel ini belum tersedia.', 'error');
        return;
      }

      // Buat path URL yang akurat (aman untuk sub-folder GitHub Pages)
      const urlToShare = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + articleUrl;

      if (navigator.share) {
        try { 
          await navigator.share({ title, url: urlToShare }); 
        } catch (error) {
          // Error diabaikan jika user sengaja membatalkan (cancel) menu share bawaan HP
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
      
      // Tentukan link yang akurat: jika artikel punya file HTML, arahkan ke file tersebut. Jika tidak, pakai halaman utama.
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

      // Buat iframe tersembunyi untuk memuat halaman artikel
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

      // Muat file artikel ke dalam iframe
      iframe.src = targetUrl;

      // Tunggu sampai iframe selesai memuat halaman artikel
      iframe.onload = () => {
        try {
          // Panggil fungsi print khusus dari dalam iframe artikel tersebut
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

      // Ubah teks tombol sementara agar user tahu sistem sedang mengecek
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat...';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none'; // Cegah klik dobel

      if (targetUrl !== '') {
        try {
          // Cek apakah file HTML-nya benar-benar ada di server
          const response = await fetch(targetUrl, { method: 'HEAD' });

          if (response.ok) {
            // Jika valid (status 200): Kembalikan tombol sebentar lalu pindah halaman
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';

            setTimeout(() => {
              window.location.href = targetUrl;
            }, 300); // Jeda 300ms agar perubahan teks sempat terlihat

          } else {
            // Jika link diisi tapi filenya tidak ditemukan (status 404, dll)
            openModal(articleTitle, 'Mohon maaf, halaman untuk artikel ini belum tersedia atau sedang dalam perbaikan.');
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
          }
        } catch (error) {
          // Jika terjadi error koneksi jaringan
          openModal(articleTitle, 'Gagal memuat artikel. Silakan periksa koneksi internet Anda.');
          btn.innerHTML = originalText;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }
      } else {
        // Jika URL memang dibiarkan kosong
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
  on(modal, 'click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });
  $$('.ann-card [data-modal]').forEach(b => on(b, 'click', () => openModal(b.dataset.modal, 'Info lengkap segera diumumkan. Silakan pantau website secara berkala atau ikuti media sosial resmi Rumah Belajar Shafaa.')));

  // Popup pengumuman satu kali per sesi
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

  /* ---------- Contact Form (Metode Fetch API Handal) ---------- */
  const contactForm = $('#contactForm');

  on(contactForm, 'submit', async (e) => {
    e.preventDefault(); // Cegah reload bawaan form

    const fields = contactForm.querySelectorAll('input, textarea');
    let ok = true;

    fields.forEach(f => {
      if (!f.checkValidity()) {
        f.style.borderColor = '#ef4444';
        ok = false;
      } else {
        f.style.borderColor = '';
      }
    });

    if (!ok) {
      toast('Mohon lengkapi semua kolom dengan benar', 'error');
      return;
    }

    // Ambil tombol submit
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Ubah tombol jadi loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';
    toast('Mengirim pesan...', 'success');

    try {
      // Kirim data menggunakan fetch ke Formspree
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // BERHASIL: Kosongkan form, kembalikan tombol, munculkan toast sukses
        contactForm.reset();
        toast('Pesan berhasil dikirim! Terima kasih atas masukan Anda.', 'success');
      } else {
        // Gagal dari server Formspree
        toast('Gagal mengirim pesan. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      // Gagal jaringan / koneksi
      toast('Terjadi kesalahan jaringan. Periksa koneksi Anda.', 'error');
    } finally {
      // Pastikan tombol selalu kembali normal (tidak stuck di loading)
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  /* ---------- PPDB Form (Dengan Loading, Reset & Stepper Aktif) ---------- */
  const ppdb = $('#ppdbForm');
  let isSubmitting = false;

  // Ambil elemen stepper
  const steps = $$('.stepper .step');

  function updateStepper(currentStep) {
    steps.forEach((step, index) => {
      if (index < currentStep) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });
  }

  // Inisialisasi awal stepper di tahap 1
  updateStepper(1);

  on(ppdb, 'submit', (e) => {
    const fields = ppdb.querySelectorAll('input, select, textarea');
    let ok = true;

    fields.forEach(f => {
      // Pengecualian field opsional
      if ((['nisn', 'asal', 'email'].includes(f.id || f.name)) && f.value.trim() === '') {
        f.style.borderColor = '';
        return;
      }

      if (!f.checkValidity()) {
        f.style.borderColor = '#ef4444';
        ok = false;
      } else {
        f.style.borderColor = '';
      }
    });

    if (!ok) {
      e.preventDefault();
      toast('Mohon lengkapi semua data dengan benar', 'error');
      return;
    }

    // Lolos validasi: Ubah tombol jadi animasi loading
    isSubmitting = true;
    const submitBtn = ppdb.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pendaftaran...';
    }

    toast('Mengirim pendaftaran ke server...', 'success');
  });

  // Fungsi global yang dipanggil saat iframe selesai menerima respons dari Formspree
  window.handleFormSubmitted = function () {
    if (!isSubmitting) return;

    isSubmitting = false;
    const submitBtn = ppdb.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtn.dataset.originalText || 'Kirim Pendaftaran';
    }

    // 1. Buat semua step stepper jadi aktif (menyala penuh) menandakan selesai
    updateStepper(steps.length);

    // 2. Kosongkan form otomatis & Beri notifikasi sukses
    ppdb.reset();
    toast('Pendaftaran berhasil dikirim! Data telah diterima.', 'success');
  };

  on($('#downloadBrosur'), 'click', (e) => {
    e.preventDefault();

    const a = document.createElement('a');
    a.href = 'images/Brosur.pdf';
    a.download = 'Brosur-PPDB-Shafaa.pdf';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast('Brosur berhasil diunduh', 'success');
  });

  /* ---------- Contact Form ---------- */
  on($('#contactForm'), 'submit', (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) return toast('Lengkapi semua kolom', 'error');
    toast('Pesan terkirim! Kami akan segera membalas', 'success');
    f.reset();
  });

  /* ---------- Newsletter Form ---------- */
  const newsForm = $('#newsForm');
  let isNewsSubmitting = false;

  on(newsForm, 'submit', (e) => {
    const emailInput = newsForm.querySelector('input[type="email"]');

    // Validasi email
    if (!emailInput.checkValidity()) {
      e.preventDefault();
      return toast('Email tidak valid', 'error');
    }

    // Lolos validasi: Aktifkan status kirim dan ubah tombol jadi loading
    isNewsSubmitting = true;
    const submitBtn = newsForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    }

    toast('Mengirim langganan...', 'success');
  });

  // Fungsi global yang dipanggil otomatis saat iframe selesai menerima respons dari Formspree
  window.handleNewsSubmitted = function () {
    if (!isNewsSubmitting) return; // Mencegah eksekusi saat pertama kali halaman dimuat

    isNewsSubmitting = false;
    const submitBtn = newsForm.querySelector('button[type="submit"]');

    // Kembalikan tombol ke teks semula
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtn.dataset.originalText || 'Berlangganan';
    }

    // Kosongkan kolom input email otomatis & beri notifikasi sukses
    newsForm.reset();
    toast('Email berhasil dikirim! Terima kasih telah berlangganan.', 'success');
  };

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg, type = 'success') {
    toastEl.textContent = msg;
    toastEl.className = 'toast is-show ' + (type === 'error' ? 'is-error' : 'is-success');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  }

  /* ---------- Image Error & Offline Handler ---------- (TARUH DISINI) */
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

})();