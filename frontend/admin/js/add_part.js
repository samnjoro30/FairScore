document.addEventListener('DOMContentLoaded', function() {
    const judgeForm = document.getElementById('judgeRegistrationForm');
    const generateUsernameBtn = document.getElementById('generateUsername');
    
    // Generate judge ID
    generateUsernameBtn.addEventListener('click', function() {
        const prefix = 'JUDGE_';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const timestamp = new Date().getTime().toString().slice(-4);
        document.getElementById('judgeUsername').value = prefix + randomNum + '_' + timestamp;
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('judgePassword');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Check length
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Check for mixed case
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        
        // Check for numbers
        if (/\d/.test(password)) strength++;
        
        // Check for special chars
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        // Update UI
        strengthMeter.style.width = (strength * 20) + '%';
        
        if (strength <= 2) {
            strengthText.textContent = 'Weak';
            strengthMeter.style.backgroundColor = '#ff4d4d';
        } else if (strength <= 3) {
            strengthText.textContent = 'Medium';
            strengthMeter.style.backgroundColor = '#ffcc00';
        } else {
            strengthText.textContent = 'Strong';
            strengthMeter.style.backgroundColor = '#4CAF50';
        }
    });
    
    // Form submission
    judgeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic client-side validation
        if (!this.checkValidity()) {
            alert('Please fill all required fields correctly');
            return;
        }
        
        // Prepare form data
        const formData = new FormData(this);
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Send AJAX request
        fetch('http://localhost/fairscore/backend/add_judge.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                judgeForm.reset();
                // Optionally close the form or redirect
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Add Judge';
        });
    });
    
    // Toggle password visibility
    document.querySelector('.toggle-password').addEventListener('click', function() {
        const passwordField = document.getElementById('judgePassword');
        const icon = this.querySelector('i');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});