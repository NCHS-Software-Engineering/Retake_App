document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('OptimizedMode') === 'enabled') {
        document.body.classList.add('Optimized-mode');
    }
});
