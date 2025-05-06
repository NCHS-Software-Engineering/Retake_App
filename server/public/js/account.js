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
  });