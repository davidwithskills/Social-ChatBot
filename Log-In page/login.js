// Simple login handler for Log-In page
// It expects a form with id "loginForm" and inputs with ids "username" and "password".

const form = document.getElementById('loginForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = (document.getElementById('username') || {}).value || '';
        const password = (document.getElementById('password') || {}).value || '';

        // Basic validation (adjust as needed)
        if (!username) {
            alert('Please enter your username.');
            return;
        }
        if (!password) {
            alert('Please enter your password.');
            return;
        }

        // Example check: compare with stored userData in localStorage (if you used sign-up flow)
        try {
            const stored = localStorage.getItem('userData');
            if (stored) {
                const user = JSON.parse(stored);
                if (user.username === username && user.password === password) {
                    // Successful login -> redirect to Profile page
                    window.location.href = '../Home/Home.html';
                    return;
                } else {
                    alert('Invalid username or password.');
                    return;
                }
            }
        } catch (err) {
            console.error('Error reading localStorage', err);
        }

        // If no stored credentials, still redirect (remove this if you want required auth)
        window.location.href = '../Sign-up page/Sign-Up.html';
    });
} else {
    console.warn('loginForm not found on this page.');
}
