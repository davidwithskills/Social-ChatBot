document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const userNameElement = document.querySelector('.user-name');
    const userHandleElement = document.querySelector('.user-handle');
    const avatarUpload = document.getElementById('avatar-upload');
    const profilePicture = document.getElementById('profile-picture');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const bioText = document.querySelector('.bio-text');
    const bannerUpload = document.getElementById('banner-upload');
    const profileHeader = document.getElementById('profile-header');
    const removeBannerBtn = document.getElementById('remove-banner');
    // select contact-item spans except the email (email has its own class)
    const contactItems = document.querySelectorAll('.contact-item span:not(.user-email)');
    const emailElement = document.querySelector('.user-email');
    const locationElement = document.querySelector('.user-location');
    
    
    // Load user data from localStorage
    try {
        const stored = localStorage.getItem('userData');
        if (stored) {
            const user = JSON.parse(stored);
            userNameElement.textContent = user.username || userNameElement.textContent;
            userHandleElement.textContent = user.username ? `@${user.username.toLowerCase().replace(/\s+/g, '')}` : userHandleElement.textContent;
            if (user.email && emailElement) {
                emailElement.textContent = user.email;
            }
            if (user.location && locationElement) {
                locationElement.textContent = user.location;
            }
        }
        // Load banner if present
        const bannerData = localStorage.getItem('bannerImage');
        if (bannerData && profileHeader) {
            // set as background-image (keep gradient fallback in CSS)
            profileHeader.style.backgroundImage = `url('${bannerData}')`;
            profileHeader.style.backgroundSize = 'cover';
            profileHeader.style.backgroundPosition = 'center';
        }
        // Load avatar if present
        const avatarData = localStorage.getItem('avatarImage');
        if (avatarData && profilePicture) {
            profilePicture.src = avatarData;
        }
    } catch (err) {
        console.error('Error loading user data', err);
    }

    // Handle profile picture upload
    if (avatarUpload) {
        avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                profilePicture.src = dataUrl;
                // save avatar to localStorage so it persists
                try {
                    localStorage.setItem('avatarImage', dataUrl);
                } catch (err) {
                    console.error('Failed to save avatar to localStorage', err);
                }
                // Here you would typically upload the image to your server
            };
            reader.readAsDataURL(file);
        }
        });
    }

    // Handle banner upload and preview + persistence
    if (bannerUpload) {
        bannerUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const dataUrl = ev.target.result;
                    if (profileHeader) {
                        profileHeader.style.backgroundImage = `url('${dataUrl}')`;
                        profileHeader.style.backgroundSize = 'cover';
                        profileHeader.style.backgroundPosition = 'center';
                    }
                    try {
                        localStorage.setItem('bannerImage', dataUrl);
                    } catch (err) {
                        console.error('Failed to save banner to localStorage', err);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove banner
    if (removeBannerBtn) {
        removeBannerBtn.addEventListener('click', () => {
            if (profileHeader) {
                profileHeader.style.backgroundImage = '';
                // let CSS gradient fallback show through
            }
            try {
                localStorage.removeItem('bannerImage');
            } catch (err) {
                console.error('Failed to remove banner from storage', err);
            }
        });
    }

    // Handle edit profile button (only if present on page)
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // This is where you would implement the edit profile functionality
            alert('Edit profile functionality will be implemented here');
        });
    }


    function makeEditable(element, storageKey) {
        if (!element) return;
        element.addEventListener('dblclick', () => {
            const currentText = element.textContent;
            const input = document.createElement('input');
            input.value = currentText;
            input.style.width = '100%';
            
            element.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const newValue = input.value;
                element.textContent = newValue;
                input.replaceWith(element);

                // save change to localStorage if a key was provided
                if (storageKey) {
                    try {
                        const stored = localStorage.getItem('userData');
                        const user = stored ? JSON.parse(stored) : {};
                        user[storageKey] = newValue;
                        localStorage.setItem('userData', JSON.stringify(user));
                        console.log(`Updated ${storageKey} in localStorage:`, newValue);
                    } catch (err) {
                        console.error('Error saving user data', err);
                    }
                }
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    }

    // Enable double-click to edit for certain fields
    makeEditable(userNameElement, 'username');
    makeEditable(bioText, 'bio');
    if (emailElement) makeEditable(emailElement, 'email');
    if (locationElement) makeEditable(locationElement, 'location');
    contactItems.forEach(item => makeEditable(item));

function validateUserid(username) {
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
    
    // Signup form submit handler: save id to localStorage and redirect to profile
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');

    // Live preview: update handle preview while typing
    const handlePreview = document.getElementById('user-handle-preview');
    if (usernameInput && handlePreview) {
        // initialize from localStorage or input value
        const stored = localStorage.getItem('userData');
        const storedUser = stored ? JSON.parse(stored) : null;
        const initial = usernameInput.value || (storedUser && (storedUser.userid || storedUser.username)) || '';
        const formatHandle = (v) => {
            if (!v) return '@username';
            // sanitize: allow letters, numbers and underscores, remove spaces and other chars
            const cleaned = String(v).toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '');
            return `@${cleaned || 'username'}`;
        };
        handlePreview.textContent = formatHandle(initial);

        usernameInput.addEventListener('input', (e) => {
            handlePreview.textContent = formatHandle(e.target.value);
        });
    }

    if (signupForm && usernameInput) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = usernameInput.value.trim();
            if (!validateUserid(val)) return;

            // Helper to save userData and redirect
            const finishAndRedirect = () => {
                try {
                    const stored = localStorage.getItem('userData');
                    const user = stored ? JSON.parse(stored) : {};
                    // Only set userid here. Do NOT overwrite user.username (display name).
                    user.userid = val;
                    localStorage.setItem('userData', JSON.stringify(user));
                } catch (err) {
                    console.error('Failed to save user id', err);
                }
                window.location.href = '../Profile/Profile.html';
            };

            // If an avatar file was selected on the signup page, read and save it first
            try {
                const avatarInput = document.getElementById('avatar-upload');
                if (avatarInput && avatarInput.files && avatarInput.files[0]) {
                    const file = avatarInput.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const dataUrl = ev.target.result;
                        try {
                            localStorage.setItem('avatarImage', dataUrl);
                        } catch (err) {
                            console.error('Failed to save avatar to localStorage', err);
                        }
                        finishAndRedirect();
                    };
                    reader.readAsDataURL(file);
                    return; // will redirect from reader.onload
                }
            } catch (err) {
                console.error('Error handling avatar file before signup redirect', err);
            }

            // No avatar selected — just save userData and redirect
            finishAndRedirect();
        });
    }

});
