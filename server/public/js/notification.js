document.addEventListener('DOMContentLoaded', function() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationPopup = document.getElementById('notification-popup');
    const closePopup = document.getElementById('close-popup');
    const resizeHandle = document.querySelector('.resize-handle');

    notificationBtn.addEventListener('click', function() {
        notificationPopup.style.display = 'block';

        // relist notifications
        listNotifications();
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

    async function listNotifications() {
        document.getElementById("popup-content").innerHTML = '';
        try {
            const response = await fetch('/notification/list');
            const data = await response.json();

            if (data.err) {
                document.getElementById("popup-content").innerHTML = `<p>${data.err}</p>`;
                return;
            }

            // check if there is no notifications
            if (data.rows.length === 0) {
                document.getElementById("popup-content").innerHTML = `<p>No notifications</p>`;
                return;
            }


            // Render them in for loop
            data.rows.forEach(row => {
                const notificationItem = document.createElement('div');
                notificationItem.classList.add('notification-item');
                notificationItem.setAttribute('data-url', row.url);
                notificationItem.setAttribute('data-request-id', row.requestId); // Add requestId as a data attribute
                notificationItem.innerHTML = `
                <span class="notification-title">Retake Request</span>
                <span class="notification-message">${row.username} requested to retake ${row.testName}.</span>
                <button class="delete-notification">&times;</button>`;                
                document.getElementById("popup-content").appendChild(notificationItem);
            });
            

            // Static rendering of 3 notification items
            // const staticNotifications = [
            //     { title: 'Retake Request', message: 'Mitch requested to retake Math Test.', url: '/math-test' },
            //     { title: 'Retake Request', message: 'Mitch requested to retake Science Test.', url: '/science-test' },
            //     { title: 'Retake Request', message: 'Mitch requested to retake History Test.', url: '/history-test' }
            // ];

            // staticNotifications.forEach(notification => {
            //     const notificationItem = document.createElement('div');
            //     notificationItem.classList.add('notification-item');
            //     notificationItem.setAttribute('data-url', notification.url);
            //     notificationItem.innerHTML = `
            //     <span class="notification-title">${notification.title}</span>
            //     <span class="notification-message">${notification.message}</span>
            //     <button class="delete-notification">&times;</button>`;
            //     document.getElementById("popup-content").appendChild(notificationItem);
            // });


            deleteNotificationEventListeners();
            notificationClickable();

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

});

function deleteNotificationEventListeners() {
    document.querySelectorAll('.delete-notification').forEach(button => {
        button.addEventListener('click', function () {
            // get the requestId from the parent element
            const requestId = this.parentElement.getAttribute('data-request-id');
            
            // send a delete request to the server
            fetch('/notification/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ retakeId: requestId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.err) {
                    console.error('Error deleting notification:', data.err);
                    return;
                }
                // Remove the notification item from the DOM
                this.parentElement.remove();
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
        })   
    });
}

function notificationClickable() {
        // Make notification-item clickable
        document.querySelectorAll('.notification-message').forEach(item => {
            item.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                } else {
                    window.open('/dash/requests', '_blank');
                }
            });
        });
}