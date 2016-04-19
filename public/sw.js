var ENDPOINT = 'https://autogiphy.herokuapp.com/endpoint'

function showNotification(title, message, icon, data) {
  console.log('showNotification');
  var notificationOptions = {
    body: message,
    icon: icon ? icon : '/images/touch/chrome-touch-icon-192x192.png',
    tag: 'mobile-ads-dont-work',
    data: data
  };
  return self.registration.showNotification(title, notificationOptions);
}

//Push Notification Handler
self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
    event.waitUntil(
      fetch(ENDPOINT)
        .then(function(response) {
          if (response.status !== 200) {
            // Throw an error so the promise is rejected and catch() is executed
            throw new Error('Invalid status code from endpoint: ' +
              response.status);
          }
          // Examine the text in the response
          return response.json();
        })
        .then(function(data) {
          console.log('Push notification data: ', data);
          if (!data) {
            // Throw an error so the promise is rejected and catch() is executed
            throw new Error('Endpoint had no data');
          }

          var title = data.title
          var message = data.message;
          var icon = data.image.url ||
            'images/resume-icon.png';
          var urlToOpen = data.link;
          var notificationFilter = {
            tag: 'mobile-ads-dont-work'
          };

          var notificationData = {
            url: urlToOpen
          };

          if (!self.registration.getNotifications) {
            return showNotification(title, message, icon, notificationData);
          }

          // Check if a notification is already displayed
          return self.registration.getNotifications(notificationFilter)
            .then(function(notifications) {
              if (notifications && notifications.length > 0) {
                // Start with one to account for the new notification
                // we are adding
                var notificationCount = 1;
                for (var i = 0; i < notifications.length; i++) {
                  var existingNotification = notifications[i];
                  if (existingNotification.data &&
                    existingNotification.data.notificationCount) {
                    notificationCount +=
                      existingNotification.data.notificationCount;
                  } else {
                    notificationCount++;
                  }
                  existingNotification.close();
                }
                message = 'You have ' + notificationCount + ' mobile advertisements.';
                notificationData.notificationCount = notificationCount;
              }

              return showNotification(title, message, icon, notificationData);
            });
        })
        .catch(function(err) {
          console.error('A Problem occured with handling the push msg', err);
          var title = 'Mobile ads don\'t work';
          var message = 'We were unable to get the information for this ' +
            'push message advertisement';

          return showNotification(title, message);
        })
    );
});

//Push Notification Click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('http://www.google.com'));
});
