// =============================================================
// MonPortfolio — main.js
// Vanilla JavaScript — no dependencies, no build step
// =============================================================

function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
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

initNav();
initTheme();
initReveal();
loadProjects();
