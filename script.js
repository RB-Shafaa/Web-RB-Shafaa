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
    toast(now === 'dark' ? 'Mode gelap aktif 🌙' : 'Mode terang aktif ☀️');
  });

  /* ---------- Navbar scroll + active link ---------- */
  const navbar = $('#navbar');
  const progress = $('#scrollProgress');
  const navLinks = $$('.nav__link');
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

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
    { title: 'PPDB Online', href: '#ppdb', desc: 'Pendaftaran siswa baru' },
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

  /* ---------- Slider ---------- */
  const track = $('#sliderTrack');
  const slides = $$('.slide', track);
  const dotsWrap = $('#sliderDots');
  let idx = 0;
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
  }
  on($('#prevSlide'), 'click', () => go(idx - 1));
  on($('#nextSlide'), 'click', () => go(idx + 1));
  let slideTimer = setInterval(() => go(idx + 1), 5000);
  $('#slider')?.addEventListener('mouseenter', () => clearInterval(slideTimer));
  $('#slider')?.addEventListener('mouseleave', () => slideTimer = setInterval(() => go(idx + 1), 5000));

  /* ---------- Teachers data ---------- */
  const teachers = [
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
  }));

  /* ---------- Gallery Data ---------- */
  const galleryImages = [
    { cat: 'Kegiatan', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Upacara', src: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Wisuda', src: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Ekstrakurikuler', src: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Kegiatan', src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Lomba', src: 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Kegiatan', src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Ekstrakurikuler', src: 'https://images.unsplash.com/photo-1511632765486-a53c4337b587?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Wisuda', src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Upacara', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Lomba', src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=70' },
    { cat: 'Kegiatan', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=70' },
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
      this.src = 'https://placehold.co/800x600/e2e8f0/475569?text=Gambar+Tidak+Tersedia';
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
        <img loading="lazy" alt="${g.cat}" src="${g.src}" onerror="this.onerror=null; this.src='https://placehold.co/800x600/e2e8f0/475569?text=Gambar+Tidak+Tersedia';" />
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
    { title: '5 Tips Belajar Efektif untuk Siswa Digital', cat: 'Tips', date: '10 Feb 2026', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70', excerpt: 'Pelajari strategi belajar yang tetap fokus di era distraksi digital.', url: 'tips_belajar_digital.html' },
    { title: 'Menanamkan Adab Sejak Dini di Sekolah', cat: 'Karakter', date: '02 Feb 2026', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=70', excerpt: 'Mengapa adab harus lebih dulu diajarkan dibanding ilmu.', url: 'adab_di_sekolah.html' },
    { title: 'Coding untuk Anak: Mulai dari Mana?', cat: 'Teknologi', date: '28 Jan 2026', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=70', excerpt: 'Panduan orang tua memperkenalkan coding secara menyenangkan.', url: 'coding_untuk_anak.html' },
    { title: 'Manfaat Program Tahfidz Al-Qur\'an', cat: 'Religi', date: '20 Jan 2026', img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80', excerpt: 'Dampak positif hafalan Al-Qur\'an bagi kecerdasan anak.', url: 'program_tahfidz_al_qur_an.html' },

    // Untuk artikel yang belum ada halamannya, biarkan tanpa properti url atau kosongkan
    { title: 'Peran Ekstrakurikuler dalam Pembentukan Karakter', cat: 'Karakter', date: '12 Jan 2026', img: 'https://storage.googleapis.com/data.ayo.co.id/photos/77445/SEO%20HDI%204/81.%20Inilah%20Ukuran%20Standar%20Lapangan%20Mini%20Soccer%20yang%20Harus%20Diketahui.jpg', excerpt: 'Ekstrakurikuler bukan sekadar kegiatan tambahan.', url: 'peran_ekskul.html' },
    { title: 'Persiapan Ujian Nasional: Panduan Lengkap', cat: 'Akademik', date: '05 Jan 2026', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=70', excerpt: 'Susun jadwal, kelola stres, dan tingkatkan performa.', url: 'persiapan_ujian.html' },
    { title: 'AI di Kelas: Peluang & Tantangan', cat: 'Teknologi', date: '28 Des 2025', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=70', excerpt: 'Bagaimana guru bijak memanfaatkan AI.', url: 'ai_dikelas.html' },
    { title: 'Menumbuhkan Minat Baca pada Siswa', cat: 'Tips', date: '20 Des 2025', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80', excerpt: 'Trik sederhana yang bisa diterapkan di rumah.', url: 'menumbuhkan_minat_baca.html' },
    { title: 'Public Speaking Sejak SMP', cat: 'Life Skill', date: '15 Des 2025', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=70', excerpt: 'Latihan simple untuk anak percaya diri berbicara.', url: 'publik_speakinghtml.html' }
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
             onerror="this.onerror=null; this.src='https://placehold.co/800x600/e2e8f0/475569?text=Gambar+Tidak+Tersedia';" />
      </div>
      <div class="body">
        <div class="meta"><span>${p.date}</span><span class="badge badge--purple">${p.cat}</span></div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="actions">
          <!-- Modifikasi di bagian ini: Menyimpan judul dan url (jika ada) ke dalam dataset -->
          <button class="link-arrow read-more-btn" data-title="${p.title}" data-url="${p.url || ''}">Baca Selengkapnya →</button>
          <button class="icon-mini" data-share="${p.title}" data-url="${p.url || ''}" aria-label="Bagikan">
            <i class="fa-regular fa-share-from-square"></i>
          </button>
          <button class="icon-mini" data-copy="${p.title}" aria-label="Salin link">
            <i class="fa-solid fa-link"></i>
          </button>
          <button class="icon-mini" onclick="window.print()" aria-label="Print">
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

    // Share & Copy delegated
    $$('#blogGrid [data-share]').forEach(btn => on(btn, 'click', async () => {
      const title = btn.dataset.share;
      // Jika artikel ada linknya, share link aslinya. Jika tidak, share link website utama.
      const urlToShare = btn.dataset.url ? (window.location.origin + '/' + btn.dataset.url) : location.href;

      if (navigator.share) {
        try { await navigator.share({ title, url: urlToShare }); } catch { }
      } else {
        toast('Fitur share tidak didukung browser ini', 'error');
      }
    }));

    $$('#blogGrid [data-copy]').forEach(btn => on(btn, 'click', () => {
      navigator.clipboard.writeText(location.href + '#' + encodeURIComponent(btn.dataset.copy));
      toast('Link artikel disalin! 🔗', 'success');
    }));

    // -------------------------------------------------------------
    // LOGIKA BARU UNTUK TOMBOL "Baca Selengkapnya"
    // -------------------------------------------------------------
    $$('#blogGrid .read-more-btn').forEach(btn => on(btn, 'click', () => {
      const targetUrl = btn.dataset.url;
      const articleTitle = btn.dataset.title;

      if (targetUrl !== '') {
        // Jika URL ada (file html tersedia), arahkan ke halaman tersebut
        window.location.href = targetUrl;
      } else {
        // Jika URL kosong, tampilkan modal "Segera Tayang"
        openModal(articleTitle, 'Artikel ini akan segera tayang penuh di halaman blog Shafaa. Nantikan update terbarunya!');
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
      openModal('🎉 PPDB 2027/2028 Dibuka!', 'Gelombang 1 dibuka 1 Maret — 30 April 2027. Daftar sekarang & dapatkan diskon awal + kesempatan beasiswa prestasi.');
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

  /* ---------- PPDB Form ---------- */
  const ppdb = $('#ppdbForm');

  on(ppdb, 'submit', (e) => {
    e.preventDefault();
    const fields = ppdb.querySelectorAll('input,select,textarea');
    let ok = true;

    fields.forEach(f => {
      // Mengecualikan validasi untuk NISN jika kosong.
      // Pastikan 'id' atau 'name' pada tag HTML input NISN Anda adalah "nisn"
      if ((f.id === 'nisn' || f.name === 'nisn' || f.name === 'NISN') && f.value.trim() === '') {
        f.style.borderColor = ''; // Reset border
        return; // Lanjut ke field berikutnya tanpa memberikan error
      }

      if ((f.id === 'asal' || f.name === 'asal' || f.name === 'ASAL') && f.value.trim() === '') {
        f.style.borderColor = ''; // Reset border
        return; // Lanjut ke field berikutnya tanpa memberikan error
      }

      if ((f.id === 'email' || f.name === 'email' || f.name === 'EMAIL') && f.value.trim() === '') {
        f.style.borderColor = ''; // Reset border
        return; // Lanjut ke field berikutnya tanpa memberikan error
      }

      if (!f.checkValidity()) {
        f.style.borderColor = '#ef4444';
        ok = false;
      } else {
        f.style.borderColor = '';
      }
    });

    if (!ok) return toast('Mohon lengkapi semua data dengan benar', 'error');

    // Update stepper visual
    $$('.step').forEach((s, i) => s.classList.toggle('is-active', i < 4));
    toast('Pendaftaran berhasil dikirim! ✅', 'success');
    setTimeout(() => openModal('Terima kasih! 🎉', 'Data pendaftaran Anda telah kami terima. Tim PPDB akan menghubungi via email dalam 1x24 jam kerja.'), 400);
    ppdb.reset();
  });

  on($('#downloadBrosur'), 'click', (e) => {
    e.preventDefault();
    const content = `RUMAH BELAJAR SHAFAA\nBrosur PPDB 2027/2028\n\nSholeh, Cerdas & Intelek\n\nAlamat: Jl. Raya Cimanglid, Kab. Bogor\nTelp: (+62) 822-6018-9434\nEmail: rbshafaa@gmail.com\n\nGelombang 1: 1 Maret - 30 April 2027\nGelombang 2: 1 Mei - 30 Juni 2027`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'brosur-ppdb-shafaa.txt'; a.click();
    URL.revokeObjectURL(url);
    toast('Brosur berhasil diunduh 📄', 'success');
  });

  /* ---------- Stepper Logic ---------- */
  // Mengambil semua elemen step di dalam stepper
  const steps = $$('.stepper .step');

  // Fungsi untuk memperbarui tampilan stepper
  // Parameter 'currentStep' adalah angka tahap saat ini (1, 2, 3, atau 4)
  function updateStepper(currentStep) {
    steps.forEach((step, index) => {
      // index dimulai dari 0 (0 = Step 1, 1 = Step 2, dst)
      if (index < currentStep) {
        // Jika step ini lebih kecil atau sama dengan tahap saat ini, jadikan aktif
        step.classList.add('is-active');
      } else {
        // Jika step ini di atas tahap saat ini, matikan class aktif
        step.classList.remove('is-active');
      }
    });
  }

  updateStepper(1);

  /* ---------- Contact Form ---------- */
  on($('#contactForm'), 'submit', (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) return toast('Lengkapi semua kolom', 'error');
    toast('Pesan terkirim! Kami akan segera membalas 💌', 'success');
    f.reset();
  });

  /* ---------- Newsletter ---------- */
  on($('#newsForm'), 'submit', (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) return toast('Email tidak valid', 'error');
    toast('Berhasil berlangganan newsletter Shafaa! 📩', 'success');
    e.target.reset();
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
