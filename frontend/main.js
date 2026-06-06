document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const msg = document.getElementById('formMsg');
  const btn = e.target.querySelector('button');

  const body = {
    name:    document.getElementById('name').value,
    phone:   document.getElementById('phone').value,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value
  };

  btn.textContent = 'Отправляем...';
  btn.disabled = true;

  try {
    const res = await fetch('http://localhost:5000/api/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = '✅ Заявка отправлена! Мы свяжемся с вами.';
      msg.className = 'success';
      e.target.reset();
    } else {
      msg.textContent = '❌ ' + (data.error || 'Ошибка. Попробуйте снова.');
      msg.className = 'error';
    }
  } catch {
    msg.textContent = '❌ Нет связи с сервером.';
    msg.className = 'error';
  }

  btn.textContent = 'Отправить заявку';
  btn.disabled = false;
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});