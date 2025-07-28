document.addEventListener('DOMContentLoaded', () => {
  const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');
  const eventButton = document.getElementById('event-button');
  const eventModal = document.getElementById('event-modal');
  const modalCloseBtn = eventModal?.querySelector('.modal-close');

  dropdownWrappers.forEach(wrapper => {
    const toggle = wrapper.querySelector('.dropdown-toggle');
    const menu = wrapper.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    let isAnimating = false;

    function showMenu() {
      if (isAnimating) return;
      isAnimating = true;
      menu.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
      setTimeout(() => { isAnimating = false; }, 350);
    }

    function hideMenu() {
      if (isAnimating) return;
      isAnimating = true;
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      setTimeout(() => { isAnimating = false; }, 350);
    }

    function toggleMenu() {
      if (menu.classList.contains('show')) {
        hideMenu();
      } else {
        showMenu();
      }
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      } else if (e.key === 'Escape' && menu.classList.contains('show')) {
        hideMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', () => {
      hideMenu();
    });
  });

  if (eventButton && eventModal && modalCloseBtn) {
    function openModal() {
      eventModal.hidden = false;
      eventButton.setAttribute('aria-expanded', 'true');
      eventModal.focus();
    }

    function closeModal() {
      eventModal.hidden = true;
      eventButton.setAttribute('aria-expanded', 'false');
      eventButton.focus();
    }

    eventButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });

    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    eventModal.addEventListener('click', (e) => {
      if (e.target === eventModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !eventModal.hidden) {
        closeModal();
      }
    });
  }
});
