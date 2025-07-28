document.addEventListener('DOMContentLoaded', () => {
  const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');

  dropdownWrappers.forEach(wrapper => {
    const toggle = wrapper.querySelector('.dropdown-toggle');
    const menu = wrapper.querySelector('.dropdown-menu');

    if (!toggle || !menu) return;

    // Управление aria-атрибутами и классами для видимости
    function toggleMenu(show) {
      const isOpen = menu.classList.contains('show');
      if (show === undefined) show = !isOpen;
      if (show) {
        menu.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }

    toggle.addEventListener('click', () => {
      toggleMenu();
    });

    // Клавиши: Enter, Space для открытия меню
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      } else if (e.key === 'Escape' && menu.classList.contains('show')) {
        toggleMenu(false);
        toggle.focus();
      }
    });

    // Закрывать меню при клике вне
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Управление клавишами навигации для меню (TAB происходит естественно)
  });
});
