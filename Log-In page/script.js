document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Display order confirmation
    const orderOutput = document.getElementById('orderOutput');
    orderOutput.innerHTML = `<p>Order placed by <strong>${username}</strong> for delivery to <strong>${password}</strong>.</p>`;

    // Clear the form
    this.reset();
    
    
    });

    
