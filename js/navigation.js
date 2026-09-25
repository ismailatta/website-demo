document.addEventListener('DOMContentLoaded', () => {
  const navigationPlaceholder = document.getElementById('app-navigation');
  if (!navigationPlaceholder) return;

  const pages = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'idea', label: 'Idea', icon: 'fa-lightbulb' },
    { id: 'goal', label: 'Goal', icon: 'fa-bullseye' },
    { id: 'planner', label: 'Planner', icon: 'fa-project-diagram' },
    { id: 'calendar', label: 'Calendar', icon: 'fa-calendar' },
    { id: 'pomodoro', label: 'Pomodoro', icon: 'fa-clock' },
    { id: 'notes', label: 'Notes', icon: 'fa-sticky-note' }
  ];

  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  const navigationClass = navigationPlaceholder.classList.contains('sidebar') ? 'sidebar' : 'main-nav';

  const navigation = document.createElement('nav');
  navigation.className = navigationClass;
  navigation.setAttribute('aria-label', 'Main navigation');

  navigation.innerHTML = `
    <div class="logo">
      <i class="fas fa-rocket" aria-hidden="true"></i>
      <h1>FocusFlow</h1>
    </div>
    ${pages.map(page => `
      <a href="../pages/${page.id}.html" title="${page.label}">
        <button class="nav-button${page.id === currentPage ? ' active' : ''}" data-page="${page.id}" type="button" aria-label="${page.label}">
          <i class="fas ${page.icon} nav-icon" aria-hidden="true"></i>
          <span class="nav-label">${page.label}</span>
        </button>
      </a>
    `).join('')}
  `;

  navigationPlaceholder.replaceWith(navigation);
});
