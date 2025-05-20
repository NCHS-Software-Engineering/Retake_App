document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('dark-mode');
    const body = document.body;
  
    // Load stored mode
    if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
      toggle.checked = true;
    }
  
    // Toggle dark mode
    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
      }
    });
    const toggletuah = document.getElementById('Optimized-Mode');
    const bodytuah = document.body;
  
    // Load stored mode
    if (localStorage.getItem('OptimizedMode') === 'enabled') {
      bodytuah.classList.add('Optimized-Mode');
      toggletuah.checked = true;
    }
  
    // Toggle dark mode
    toggletuah.addEventListener('change', function () {
      if (toggletuah.checked) {
        bodytuah.classList.add('Optimized-Mode');
        localStorage.setItem('OptimizedMode', 'enabled');
      } else {
        bodytuah.classList.remove('Optimized-Mode');
        localStorage.setItem('OptimizedMode', 'disabled');
      }
    });
  });