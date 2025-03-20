document.addEventListener('DOMContentLoaded', function() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationPopup = document.getElementById('notification-popup');
    const closePopup = document.getElementById('close-popup');
    const resizeHandle = document.querySelector('.resize-handle');

    notificationBtn.addEventListener('click', function() {
        notificationPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function() {
        notificationPopup.style.display = 'none';
    });

    resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        document.addEventListener('mousemove', resizePopup);
        document.addEventListener('mouseup', stopResize);
    });

    function resizePopup(e) {
        const newWidth = window.innerWidth - e.clientX;
        const newHeight = e.clientY - notificationPopup.offsetTop;
        if (newWidth > notificationPopup.style.minWidth.replace('%', '') * window.innerWidth / 100) {
            notificationPopup.style.width = newWidth + 'px';
        }
        if (newHeight > notificationPopup.style.minHeight.replace('%', '') * window.innerHeight / 100) {
            notificationPopup.style.height = newHeight + 'px';
        }
    }

    function stopResize() {
        document.removeEventListener('mousemove', resizePopup);
        document.removeEventListener('mouseup', stopResize);
    }

    document.querySelectorAll('.delete-notification').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });


    // Make notification-item clickable
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            } else {
                window.open('/', '_blank');
            }
        });
    });

});