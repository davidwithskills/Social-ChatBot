document.addEventListener('DOMContentLoaded', () => {
    // Handle profile picture upload
    const avatarUpload = document.getElementById('avatar-upload');
    const profilePicture = document.getElementById('profile-picture');

    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicture.src = e.target.result;
                // Here you would typically upload the image to your server
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    editProfileBtn.addEventListener('click', () => {
        // This is where you would implement the edit profile functionality
        alert('Edit profile functionality will be implemented here');
    });

    // Make profile fields editable (example implementation)
    const userName = document.querySelector('.user-name');
    const bioText = document.querySelector('.bio-text');
    const contactItems = document.querySelectorAll('.contact-item span');

    function makeEditable(element) {
        element.addEventListener('dblclick', () => {
            const currentText = element.textContent;
            const input = document.createElement('input');
            input.value = currentText;
            input.style.width = '100%';
            
            element.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                element.textContent = input.value;
                input.replaceWith(element);
                // Here you would typically save the changes to your server
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    }

    // Enable double-click to edit for certain fields
    makeEditable(userName);
    makeEditable(bioText);
    contactItems.forEach(item => makeEditable(item));
});