document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.nav-toggle');
  const navList=document.querySelector('.nav-list');
  toggle.addEventListener('click',()=>{
    navList.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-list a').forEach(a=>{
    a.addEventListener('click',()=>navList.classList.remove('open'))
  })

  // Active link on scroll
  const sections=document.querySelectorAll('main section[id]');
  const navLinks=document.querySelectorAll('.nav-list a');
  function onScroll(){
    const scrollY=window.pageYOffset;
    sections.forEach(section=>{
      const top=section.offsetTop-80;
      const height=section.offsetHeight;
      if(scrollY>=top && scrollY<top+height){
        navLinks.forEach(link=>link.classList.remove('active'));
        const id=section.getAttribute('id');
        const el=document.querySelector('.nav-list a[href="#'+id+'"]');
        if(el) el.classList.add('active');
      }
    })
  }
  window.addEventListener('scroll',onScroll);
  onScroll();
  
  // Theme toggle (persist in localStorage)
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'light') root.classList.add('light');
  themeToggle.addEventListener('click', ()=>{
    const isLight = root.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '🌞' : '🌙';
  });

  // Reveal on scroll using IntersectionObserver
  const revealElems = document.querySelectorAll('.reveal');

  // Skill meter animator
  const animatedMeters = new WeakSet();
  function animateMeter(meter){
    if(animatedMeters.has(meter)) return;
    animatedMeters.add(meter);
    const label = meter.querySelector('.meter-label');
    const target = parseInt(meter.dataset.percent || '0', 10);
    const duration = 900;
    let start = null;
    function step(ts){
      if(start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const cur = Math.round(t * target);
      meter.style.background = `conic-gradient(var(--accent) ${cur}%, rgba(255,255,255,0.06) ${cur}% )`;
      if(label) label.textContent = cur + '%';
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const d = entry.target.dataset && entry.target.dataset.delay ? entry.target.dataset.delay : '0';
        entry.target.style.transitionDelay = typeof d === 'string' ? d + 'ms' : d + 'ms';
        entry.target.classList.add('visible');
        // animate skill meters inside this revealed block
        const meters = entry.target.querySelectorAll && entry.target.querySelectorAll('.skill-meter') || [];
        meters.forEach(m=>animateMeter(m));
        io.unobserve(entry.target);
      }
    })
  },{threshold:0.12});
  revealElems.forEach(e=>io.observe(e));

  // Role rotator
  const roles = [
    'Python Full Stack Developer',
    'Software Developer',
    'AI Enthusiast',
    'Web Developer',
    'Problem Solver'
  ];
  let roleIdx = 0;
  const roleText = document.getElementById('roleText');
  function rotateRole(){
    roleIdx = (roleIdx + 1) % roles.length;
    roleText.textContent = roles[roleIdx];
  }
  setInterval(rotateRole, 2600);

  // Hero parallax on mouse move (subtle)
  const hero = document.querySelector('.hero');
  const floaters = document.querySelectorAll('.floater');
  hero.addEventListener('mousemove', (e)=>{
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    floaters.forEach((f, i)=>{
      const depth = (i+1) * 6;
      f.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0) rotate(${x*10}deg)`;
    })
  });
  hero.addEventListener('mouseleave', ()=>{ floaters.forEach(f=>f.style.transform='none') });

  // Profile photo tilt interaction
  const photoFloat = document.getElementById('photoFloat');
  if(photoFloat){
    const img = photoFloat.querySelector('img');
    photoFloat.addEventListener('mousemove', (e)=>{
      const rect = photoFloat.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = x * 12; // degrees
      const rotX = -y * 10;
      const transY = -Math.abs(y) * 6;
      photoFloat.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${transY}px)`;
      img.style.transform = `translateZ(8px)`;
    });
    photoFloat.addEventListener('mouseleave', ()=>{
      photoFloat.style.transform = '';
      img.style.transform = '';
    });
    photoFloat.addEventListener('touchstart', ()=>{ /* disable tilt on touch for performance */ });
  }

  // Resume modal
  const openResume = document.getElementById('openResume');
  const resumeModal = document.getElementById('resumeModal');
  const modalClose = document.querySelector('.modal-close');
  const resumeIframe = document.querySelector('#resumeModal iframe');
  const downloadResume = document.getElementById('downloadResume');
  openResume.addEventListener('click',(e)=>{
    e.preventDefault();
    resumeIframe.src = 'Fathima_H_PYTHON%20FULLSTACK%20DEVELOPER_Resume.pdf';
    downloadResume.href = 'Fathima_H_PYTHON%20FULLSTACK%20DEVELOPER_Resume.pdf';
    downloadResume.setAttribute('download','Fathima_H_PYTHON_FULLSTACK_DEVELOPER_Resume.pdf');
    resumeModal.setAttribute('aria-hidden','false');
  });
  modalClose.addEventListener('click',()=>resumeModal.setAttribute('aria-hidden','true'));
  resumeModal.addEventListener('click',(e)=>{ if(e.target===resumeModal) resumeModal.setAttribute('aria-hidden','true') });
  // Navbar resume link left to default anchor behavior so it scrolls to the #resume section
});

// NAME ANIMATION + INTRO OVERLAY
// Runs after DOMContentLoaded block above
;(function(){
  const heroName = document.getElementById('heroName');
  function setupName(){
    if(!heroName) return;
    const text = heroName.textContent.trim();
    heroName.textContent = '';
    const chars = Array.from(text);
    chars.forEach((ch,i)=>{
      const sp = document.createElement('span');
      sp.className = 'char';
      sp.textContent = ch === ' ' ? '\u00A0' : ch;
      heroName.appendChild(sp);
    });
  }
  function animateNameOnce(){
    if(!heroName) return;
    const chars = heroName.querySelectorAll('.char');
    chars.forEach((c,i)=>{
      c.classList.remove('animate');
      void c.offsetWidth;
      setTimeout(()=>c.classList.add('animate'), i * 80);
    });
  }
  function startNameLoop(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animateNameOnce();
    const total = heroName.querySelectorAll('.char').length * 80 + 900;
    setInterval(animateNameOnce, total);
  }
  setupName();
  startNameLoop();

  // Intro overlay + sparkles
  const intro = document.getElementById('introOverlay');
  if(intro && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const sparkContainer = intro.querySelector('.sparkles');
    const sparkCount = Math.min(36, Math.round((innerWidth * innerHeight) / 90000));
    for(let i=0;i<sparkCount;i++){
      const s = document.createElement('div'); s.className = 'spark';
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.animationDelay = (Math.random() * 800) + 'ms';
      const size = Math.round(Math.random() * 8) + 4;
      s.style.width = size + 'px'; s.style.height = size + 'px';
      s.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98), rgba(108,92,231,0.95))';
      sparkContainer.appendChild(s);
    }

    const logo = intro.querySelector('.intro-logo');
    const sub = intro.querySelector('.intro-sub');
    setTimeout(()=>{ if(logo){ logo.style.transition='all .6s cubic-bezier(.2,.9,.25,1)'; logo.style.transform='none'; logo.style.opacity=1; } }, 220);
    setTimeout(()=>{ if(sub){ sub.style.transition='all .6s .12s cubic-bezier(.2,.9,.25,1)'; sub.style.transform='none'; sub.style.opacity=1; } }, 420);

    // Dismiss overlay after intro
    setTimeout(()=>{ intro.classList.add('dismiss'); intro.setAttribute('aria-hidden','true'); setTimeout(()=>{ try{ intro.remove(); }catch(e){} }, 900); }, 1500);
  } else if(intro){
    // If reduced motion, remove quickly
    intro.remove();
  }
})();

// NAVBAR SPARKLES ON HOVER / TOUCH
(function(){
  const navLinks = document.querySelectorAll('.nav-list a');
  if(!navLinks || navLinks.length===0) return;

  function makeSpark(x,y, parent){
    const s = document.createElement('span');
    s.className = 'nav-spark';
    const size = 6 + Math.random()*10;
    s.style.width = size + 'px'; s.style.height = size + 'px';
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.96), rgba(108,92,231,0.9))';
    parent.appendChild(s);
    setTimeout(()=>{ s.remove(); }, 900);
  }

  navLinks.forEach(link=>{
    link.addEventListener('mouseenter', (e)=>{
      const r = link.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // create a few quick sparks
      for(let i=0;i<4;i++) setTimeout(()=>makeSpark(x + (Math.random()*12-6), y + (Math.random()*12-6), link), i*60);
    });
    // support touch: on touchstart spawn sparks at touch point
    link.addEventListener('touchstart', (e)=>{
      const touch = e.touches[0];
      const r = link.getBoundingClientRect();
      const x = touch.clientX - r.left;
      const y = touch.clientY - r.top;
      for(let i=0;i<4;i++) setTimeout(()=>makeSpark(x + (Math.random()*12-6), y + (Math.random()*12-6), link), i*60);
    }, {passive:true});
    // click / tap: create a small burst of bubbles
    link.addEventListener('click', (e)=>{
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = link.getBoundingClientRect();
      const x = (e.clientX || (r.left + r.width/2)) - r.left;
      const y = (e.clientY || (r.top + r.height/2)) - r.top;
      // burst several bubbles
      for(let b=0;b<6;b++){
        setTimeout(()=>{
          const s = document.createElement('span');
          s.className = 'nav-bubble';
          const size = 6 + Math.random()*20;
          s.style.width = size + 'px'; s.style.height = size + 'px';
          s.style.left = (x + (Math.random()*30-15)) + 'px';
          s.style.top = (y + (Math.random()*20-10)) + 'px';
          // color variation
          const hue = 240 + Math.round(Math.random()*80);
          s.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98), hsl(${hue} 70% 60% / 0.9))`;
          link.appendChild(s);
          setTimeout(()=>{ s.remove(); }, 900);
        }, b * 40);
      }
    });
  });
})();

    // Particle background animation (canvas)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const canvas = document.getElementById('bgCanvas');
      if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width = innerWidth;
        let H = canvas.height = innerHeight;
        let particles = [];
        const maxParticles = Math.max(30, Math.round((W * H) / 90000));

        function rand(a,b){return a + Math.random()*(b-a)}
        function initParticles(){
          particles = [];
          const count = Math.max(25, Math.round((W*H)/140000));
          for(let i=0;i<count;i++){
            particles.push({
              x: Math.random()*W,
              y: Math.random()*H,
              r: rand(0.8,3.2),
              vx: rand(-0.25,0.25),
              vy: rand(-0.15,0.15)
            });
          }
        }

        function resizeCanvas(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; initParticles(); }
        window.addEventListener('resize', resizeCanvas);

        function step(){
          ctx.clearRect(0,0,W,H);
          for(const p of particles){
            p.x += p.vx; p.y += p.vy;
            if(p.x < -10) p.x = W + 10;
            if(p.x > W + 10) p.x = -10;
            if(p.y < -10) p.y = H + 10;
            if(p.y > H + 10) p.y = -10;

            const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
            g.addColorStop(0, 'rgba(108,92,231,0.18)');
            g.addColorStop(1, 'rgba(108,92,231,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fill();
          }
          requestAnimationFrame(step);
        }

        initParticles();
        step();
      }
    }

