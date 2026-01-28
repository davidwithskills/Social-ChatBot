document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const useridElement = document.querySelector('.user-name');
    const userHandleElement = document.querySelector('.user-handle');
    const avatarUpload = document.getElementById('avatar-upload');
    const profilePicture = document.getElementById('profile-picture');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const bioText = document.querySelector('.bio-text');
    const bioEditBtn = document.querySelector('.bio-edit-btn');
    const bannerUpload = document.getElementById('banner-upload');
    const profileHeader = document.getElementById('profile-header');
    const removeBannerBtn = document.getElementById('remove-banner');
    const MAX_BIO_LENGTH = 300;
    // select contact-item spans except the email (email has its own class)
    const contactItems = document.querySelectorAll('.contact-item span:not(.user-email)');
    const emailElement = document.querySelector('.user-email');
    const locationElement = document.querySelector('.user-location');
    
    // Load user data from localStorage
    try {
        const stored = localStorage.getItem('userData');
        if (stored) {
            const user = JSON.parse(stored);
            useridElement.textContent = user.userid || useridElement.textContent;
            userHandleElement.textContent = user.userid ? `@${user.userid.toLowerCase().replace(/\s+/g, '')}` : userHandleElement.textContent;
            if (user.email && emailElement) {
                emailElement.textContent = user.email;
            }
            if (user.location && locationElement) {
                locationElement.textContent = user.location;
            }
            // Load bio if present
            if (user.bio && bioText) {
                bioText.textContent = user.bio;
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

    // Handle edit profile button (if present)
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // This is where you would implement the edit profile functionality
            alert('Edit profile functionality will be implemented here');
        });
    }

    function makeEditable(element, storageKey) {
        if (!element) return;
        // helper to persist userData
        function saveToStorage(key, value) {
            if (!key) return;
            try {
                const stored = localStorage.getItem('userData');
                const user = stored ? JSON.parse(stored) : {};
                user[key] = value;
                localStorage.setItem('userData', JSON.stringify(user));
                console.log(`Updated ${key} in localStorage:`, value);
            } catch (err) {
                console.error('Error saving user data', err);
            }
        }

        element.addEventListener('dblclick', () => {
            const currentText = element.textContent;

            // If it's the bio, use a textarea and provide Save/Cancel
            if (element.classList && element.classList.contains('bio-text')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'editable-bio-wrapper';

                const textarea = document.createElement('textarea');
                textarea.value = currentText;
                textarea.style.width = '100%';
                textarea.rows = 4;

                // Character counter element
                const counterEl = document.createElement('div');
                counterEl.className = 'bio-counter';
                counterEl.style.marginTop = '6px';
                counterEl.textContent = `${textarea.value.length}/${MAX_BIO_LENGTH}`;

                const controls = document.createElement('div');
                controls.style.marginTop = '6px';

                const saveBtn = document.createElement('button');
                saveBtn.type = 'button';
                saveBtn.textContent = 'Save';
                saveBtn.className = 'bio-save-btn';
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'bio-cancel-btn';

                const errorEl = document.createElement('div');
                errorEl.className = 'bio-error';
                errorEl.setAttribute('aria-live', 'polite');
                errorEl.style.marginTop = '6px';

                controls.appendChild(saveBtn);
                controls.appendChild(cancelBtn);

                wrapper.appendChild(textarea);
                wrapper.appendChild(counterEl);
                wrapper.appendChild(controls);
                wrapper.appendChild(errorEl);

                element.replaceWith(wrapper);
                textarea.focus();

                function showError(msg) {
                    errorEl.textContent = msg;
                    errorEl.style.color = '#b91c1c'; // red
                }

                function clearError() {
                    errorEl.textContent = '';
                }

                function showSaved(msg) {
                    errorEl.textContent = msg || 'Saved';
                    errorEl.style.color = '#16a34a'; // green
                    setTimeout(() => {
                        clearError();
                    }, 1600);
                }

                // Disable Save initially if invalid
                function updateControls() {
                    const len = textarea.value.trim().length;
                    counterEl.textContent = `${len}/${MAX_BIO_LENGTH}`;
                    if (len === 0) {
                        saveBtn.disabled = true;
                        counterEl.style.color = '#b91c1c';
                    } else if (len > MAX_BIO_LENGTH) {
                        saveBtn.disabled = true;
                        counterEl.style.color = '#b91c1c';
                    } else {
                        saveBtn.disabled = false;
                        counterEl.style.color = '#6b7280';
                    }
                }

                // Initial control state
                updateControls();

                textarea.addEventListener('input', () => {
                    // update counter and enable/disable save
                    updateControls();
                    clearError();
                });

                saveBtn.addEventListener('click', () => {
                    const newValue = textarea.value.trim();
                    if (!newValue) {
                        showError('Bio cannot be empty.');
                        textarea.focus();
                        return;
                    }
                    if (newValue.length > MAX_BIO_LENGTH) {
                        showError(`Bio must be ${MAX_BIO_LENGTH} characters or less.`);
                        textarea.focus();
                        return;
                    }

                    element.textContent = newValue;
                    wrapper.replaceWith(element);
                    if (storageKey) saveToStorage(storageKey, newValue);
                    showSaved('Saved');
                });

                cancelBtn.addEventListener('click', () => {
                    wrapper.replaceWith(element);
                });

                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        wrapper.replaceWith(element);
                    }
                    // Ctrl/Cmd+Enter to save
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        saveBtn.click();
                    }
                });

                return;
            }

            // Fallback: single-line input for other fields
            const input = document.createElement('input');
            input.value = currentText;
            input.style.width = '100%';

            element.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const newValue = input.value;
                element.textContent = newValue;
                input.replaceWith(element);
                if (storageKey) saveToStorage(storageKey, newValue);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    }

    // Enable double-click to edit for certain fields
    makeEditable(useridElement, 'userid');
    makeEditable(bioText, 'bio');
    if (emailElement) makeEditable(emailElement, 'email');
    if (locationElement) makeEditable(locationElement, 'location');
    contactItems.forEach(item => makeEditable(item));

    // Wire the visible Edit button to trigger the same edit flow as double-click
    if (bioEditBtn && bioText) {
        bioEditBtn.addEventListener('click', () => {
            // dispatch a dblclick event on the bioText element to open the editor
            bioText.dispatchEvent(new MouseEvent('dblclick'));
        });
    }
});