// Signup form handling with password-confirmation check
document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    // Get form values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const passwordErrorElem = document.getElementById("passwordError");
    passwordErrorElem.textContent = "";

    // Check password match
    if (password !== confirmPassword) {
        passwordErrorElem.textContent = "Password does not match";
        return;
    }

    // Validation
    if (!validateUsername(username)) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;

    // Get location value (select)
    const location = document.getElementById("location").value;

    // Store data in local storage (minimal example)
    const userData = { username: username, email: email, password: password, location: location };

    try {
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("User data stored:", userData);
    } catch (error) {
        console.error("Error storing data in localStorage:", error);
        alert("An error occurred while saving your data. Please try again.");
        return;
    }

    // Redirect to Profile (adjust path as needed)
    window.location.href = '../Sign-Up page/Profile-signup.html';
});

function validateUsername(username) {
    if (!username) {
        alert("Username cannot be empty.");
        return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        alert("Username can only contain letters, numbers, and underscores.");
        return false;
    }
    if (username.length > 50) {
        alert("Username cannot exceed 50 characters.");
        return false;
    }
    return true;
}

function validateEmail(email) {
    if (!email) {
        alert("Email cannot be empty.");
        return false;
    }
    if (email.length > 100) {
        alert("Email cannot exceed 100 characters.");
        return false;
    }
    // Simple email pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (!password) {
        alert("Password cannot be empty.");
        return false;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(password)) {
        alert("Password can only contain letters, numbers, and spaces.");
        return false;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return false;
    }
    return true;
}
