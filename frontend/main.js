// --- Анимации появления ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .slide-up').forEach(el => observer.observe(el));

// --- Счётчик цифр ---
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = +entry.target.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        entry.target.textContent = count + (target >= 98 ? '%' : '+');
      }, 30);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// --- Мобильное меню ---
function toggleMenu() {
  document.querySelector('nav ul').classList.toggle('open');
}

// --- Форма заявки ---
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    const btn = form.querySelector('button');

    const body = {
      name:    document.getElementById('name').value,
      phone:   document.getElementById('phone').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value
    };

    btn.textContent = 'Отправляем...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        msg.textContent = '✅ Заявка отправлена! Мы свяжемся с вами.';
        msg.className = 'success';
        form.reset();
      } else {
        msg.textContent = '❌ ' + (data.error || 'Ошибка.');
        msg.className = 'error';
      }
    } catch {
      msg.textContent = '❌ Нет связи с сервером.';
      msg.className = 'error';
    }

    btn.textContent = 'Отправить заявку';
    btn.disabled = false;
  });
}

// --- Фильтр портфолио ---
const filterBtns = document.querySelectorAll('.filter-btn');
const pfCards = document.querySelectorAll('.pf-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    pfCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// --- Плавная прокрутка ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});