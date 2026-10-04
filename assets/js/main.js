// Menu mobile
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => header.classList.remove('nav-open'))
  );
}

// Ano no rodapé
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

// Formulário de orçamento / análise
// Sem backend: abre o cliente de e-mail com a mensagem preenchida.
// Para envio direto, defina data-endpoint no <form> (ex.: Formspree, Getform, API própria).
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const endpoint = form.dataset.endpoint;

    if (endpoint) {
      status.textContent = 'A enviar...';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        status.textContent = 'Pedido enviado! Entraremos em contacto em breve.';
      } catch {
        status.textContent = 'Não foi possível enviar. Tente novamente ou envie-nos um e-mail.';
      }
      return;
    }

    const subject = `[${data.tipo}] ${data.empresa || data.nome}`;
    const body = [
      `Nome: ${data.nome}`,
      `E-mail: ${data.email}`,
      `Empresa: ${data.empresa || '-'}`,
      `Tipo de pedido: ${data.tipo}`,
      `Área de interesse: ${data.area}`,
      '',
      data.mensagem,
    ].join('\n');
    window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'A abrir o seu cliente de e-mail...';
  });
}

// Filtros do blog
const filters = document.querySelectorAll('.filter');
if (filters.length) {
  const cards = document.querySelectorAll('.post-card[data-cat]');
  filters.forEach(btn =>
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.toggle('active', b === btn));
      const cat = btn.dataset.filter;
      cards.forEach(c => (c.hidden = cat !== 'all' && c.dataset.cat !== cat));
    })
  );
}
