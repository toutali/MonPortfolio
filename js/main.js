// =============================================================
// MonPortfolio — main.js
// Vanilla JavaScript — no dependencies, no build step
// =============================================================

function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  if (!toggle || !links) return;

  function openMenu() {
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fermer le menu');
    const firstLink = links.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    links.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('is-open')) closeMenu();
  });
}

function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
    );
  }

  function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  applyTheme(getInitialTheme());

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  fetch('data/projects.json')
    .then(res => {
      if (!res.ok) throw new Error('Réponse réseau invalide');
      return res.json();
    })
    .then(projects => {
      grid.innerHTML = projects.map(project => {
        const techs = project.techs
          .map(t => `<span class="card__tech">${t}</span>`)
          .join('');
        const isExternal = project.url && project.url !== '#';
        const linkAttrs = isExternal ? ' target="_blank" rel="noopener"' : '';
        return `
          <article class="card">
            <div class="card__banner"></div>
            <div class="card__header">
              <h3 class="card__title">${project.name}</h3>
            </div>
            <p class="card__body">${project.description}</p>
            <div class="card__techs">${techs}</div>
            <div class="card__links">
              <a href="${project.url}" class="btn btn--outline" aria-label="Voir le projet ${project.name}"${linkAttrs}>Voir le projet</a>
            </div>
          </article>`;
      }).join('');
    })
    .catch(() => {
      grid.innerHTML = '<p class="projects__error">Impossible de charger les projets.</p>';
    });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = [
    { id: 'name',    validate: v => v.trim().length > 0 ? null : 'Veuillez entrer votre nom.' },
    { id: 'email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Veuillez entrer une adresse e-mail valide.' },
    { id: 'message', validate: v => v.trim().length > 0 ? null : 'Veuillez entrer votre message.' },
  ];

  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'alert');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'sr-only';
  form.parentNode.insertBefore(liveRegion, form);

  function clearFieldError(input) {
    const errorEl = document.getElementById(input.id + '-error');
    if (errorEl) errorEl.remove();
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  function setFieldError(input, message) {
    clearFieldError(input);
    input.setAttribute('aria-invalid', 'true');
    const errorEl = document.createElement('span');
    errorEl.id = input.id + '-error';
    errorEl.className = 'form__error';
    errorEl.textContent = message;
    input.insertAdjacentElement('afterend', errorEl);
    input.setAttribute('aria-describedby', errorEl.id);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    liveRegion.textContent = '';

    let firstInvalid = null;
    let hasError = false;

    fields.forEach(({ id, validate }) => {
      const input = document.getElementById(id);
      const error = validate(input.value);
      if (error) {
        setFieldError(input, error);
        if (!firstInvalid) firstInvalid = input;
        hasError = true;
      } else {
        clearFieldError(input);
      }
    });

    if (hasError) {
      firstInvalid.focus();
      liveRegion.textContent = 'Le formulaire contient des erreurs. Veuillez les corriger.';
      return;
    }

    form.reset();
    fields.forEach(({ id }) => clearFieldError(document.getElementById(id)));
    liveRegion.textContent = 'Message envoyé avec succès. Merci !';
  });

  fields.forEach(({ id }) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => clearFieldError(input));
  });
}

initNav();
initTheme();
initReveal();
loadProjects();
initContactForm();
