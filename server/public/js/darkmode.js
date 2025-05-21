document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('OptimizedMode') === 'enabled') {
        document.body.classList.add('Optimized-mode');
    }
});
