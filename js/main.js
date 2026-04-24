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

  // Le thème est déjà appliqué par le script inline dans <head> — on synchronise uniquement l'aria-label
  const initial = html.getAttribute('data-theme') || 'dark';
  btn.setAttribute('aria-label', initial === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');

  btn.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
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

  function isSafeUrl(url) {
    if (!url || url === '#') return true;
    try {
      const { protocol } = new URL(url, window.location.href);
      return protocol === 'https:' || protocol === 'http:';
    } catch {
      return false;
    }
  }

  function buildCard(project) {
    const article = document.createElement('article');
    article.className = 'card';

    const banner = document.createElement('div');
    banner.className = 'card__banner';

    const header = document.createElement('div');
    header.className = 'card__header';
    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = project.name;
    header.appendChild(title);

    const body = document.createElement('p');
    body.className = 'card__body';
    body.textContent = project.description;

    const techsEl = document.createElement('div');
    techsEl.className = 'card__techs';
    (project.techs || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'card__tech';
      span.textContent = t;
      techsEl.appendChild(span);
    });

    const linksEl = document.createElement('div');
    linksEl.className = 'card__links';
    const a = document.createElement('a');
    const safeUrl = isSafeUrl(project.url) ? project.url : '#';
    const isExternal = project.url && project.url !== '#' && isSafeUrl(project.url);
    a.href = safeUrl;
    a.className = 'btn btn--outline';
    a.textContent = 'Voir le projet';
    a.setAttribute('aria-label', `Voir le projet ${project.name}`);
    if (isExternal) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    linksEl.appendChild(a);

    article.append(banner, header, body, techsEl, linksEl);
    return article;
  }

  fetch('data/projects.json')
    .then(res => {
      if (!res.ok) throw new Error('Réponse réseau invalide');
      return res.json();
    })
    .then(projects => {
      const fragment = document.createDocumentFragment();
      projects.forEach(project => fragment.appendChild(buildCard(project)));
      grid.replaceChildren(fragment);
    })
    .catch(() => {
      const p = document.createElement('p');
      p.className = 'projects__error';
      p.textContent = 'Impossible de charger les projets.';
      grid.replaceChildren(p);
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
