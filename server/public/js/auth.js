function onGoogleSignIn(googleUser) {
    // Get user profile information from Google
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    const username = profile.getName(); // Username from Google account
    const idToken = googleUser.getAuthResponse().id_token;

    // Make an API call to backend for registration or login
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            username: username,
            googleToken: idToken
        })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error during Google sign-in:', error);
    });
}