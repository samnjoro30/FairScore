document.addEventListener('DOMContentLoaded', function() {
    // Common elements
    const quickActionsSection = document.querySelector('.quick-actions');
    
    // ========= JUDGE FORM =========
    const judgeForm = document.getElementById('judgeForm'); // Fixed typo here
    const addJudgeMenuLink = document.querySelector('.sidebar-menu li:nth-child(3) a');
    const addJudgeQuickBtn = document.querySelector('.quick-actions .action-btn:first-child');
    const judgeCloseBtn = judgeForm?.querySelector('.close-btn');
    const judgeCancelBtn = judgeForm?.querySelector('.cancel-btn');

    function toggleJudgeForm() {
        if (!participantForm || !judgeForm) return;
        
        // Hide participant form if open
        participantForm.style.display = 'none';
        
        // Toggle judge form
        if (judgeForm.style.display === 'block') {
            judgeForm.style.display = 'none';
        } else {
            judgeForm.style.display = 'block';
            // Insert after quick actions
            quickActionsSection?.insertAdjacentElement('afterend', judgeForm);
        }
    }

    function hideJudgeForm() {
        if (judgeForm) judgeForm.style.display = 'none';
    }

    addJudgeMenuLink?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleJudgeForm();
    });

    addJudgeQuickBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleJudgeForm();
    });

    judgeCloseBtn?.addEventListener('click', hideJudgeForm);
    judgeCancelBtn?.addEventListener('click', hideJudgeForm);

    document.getElementById('judgeRegistrationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Judge added successfully!');
        this.reset();
        hideJudgeForm();
    });

    // ========= PARTICIPANT FORM =========
    const participantForm = document.getElementById('participantForm');
    const addParticipantMenuLink = document.querySelector('.sidebar-menu li:nth-child(5) a');
    const addParticipantQuickBtn = document.querySelector('.quick-actions .action-btn:nth-child(2)');
    const participantCloseBtn = participantForm?.querySelector('.close-btn');
    const participantCancelBtn = participantForm?.querySelector('.cancel-btn');

    function toggleParticipantForm() {
        if (!participantForm || !judgeForm) return;
        
        // Hide judge form if open
        judgeForm.style.display = 'none';
        
        // Toggle participant form
        if (participantForm.style.display === 'block') {
            participantForm.style.display = 'none';
        } else {
            participantForm.style.display = 'block';
            // Insert after quick actions
            quickActionsSection?.insertAdjacentElement('afterend', participantForm);
        }
    }

    function hideParticipantForm() {
        if (participantForm) participantForm.style.display = 'none';
    }

    addParticipantMenuLink?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleParticipantForm();
    });

    addParticipantQuickBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleParticipantForm();
    });

    participantCloseBtn?.addEventListener('click', hideParticipantForm);
    participantCancelBtn?.addEventListener('click', hideParticipantForm);

    document.getElementById('participantRegistrationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Participant added successfully!');
        this.reset();
        hideParticipantForm();
        
        // Update participant count
        const participantCount = document.querySelector('.sidebar-menu li:nth-child(6) .menu-badge');
        if (participantCount) {
            const currentCount = parseInt(participantCount.textContent) || 0;
            participantCount.textContent = currentCount + 1;
        }
    });

    // Add this to your existing JavaScript
document.getElementById('generateUsername')?.addEventListener('click', function() {
    const randomId = 'JUDGE-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('judgeUsername').value = randomId;
});

// Password strength indicator
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('judgePassword');
    const strengthMeter = document.querySelector('.password-strength .strength-meter');
    const strengthText = document.querySelector('.password-strength .strength-text');

    if (passwordInput && strengthMeter && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update the strength meter and text
            updateStrengthIndicator(strength, strengthMeter, strengthText);
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check (minimum 8 characters)
        if (password.length >= 8) strength++;
        
        // Contains both lowercase and uppercase letters
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        
        // Contains numbers
        if (password.match(/[0-9]/)) strength++;
        
        // Contains special characters
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        return strength;
    }

    function updateStrengthIndicator(strength, meterElement, textElement) {
        // Remove all previous classes
        meterElement.className = 'strength-meter';
        textElement.className = 'strength-text';
        
        // Add the appropriate class based on strength
        const strengthClasses = ['weak', 'fair', 'good', 'strong'];
        const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#ff4d4d', '#ffa64d', '#ffcc00', '#00cc66'];
        
        const currentStrength = Math.min(strength, 4) - 1;
        const strengthClass = strengthClasses[currentStrength] || 'weak';
        const strengthLabel = strengthLabels[currentStrength] || 'Weak';
        const strengthColor = strengthColors[currentStrength] || '#ff4d4d';
        
        // Update meter
        meterElement.style.setProperty('--strength-width', `${(currentStrength + 1) * 25}%`);
        meterElement.style.setProperty('--strength-color', strengthColor);
        meterElement.setAttribute('data-strength', strength);
        
        // Update text
        textElement.textContent = strengthLabel;
        textElement.classList.add(strengthClass);
    }
});

// Toggle password visibility
document.querySelector('.toggle-password')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('judgePassword');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

    // Debugging helper - log all important elements
    console.log('Debug Elements:', {
        judgeForm,
        participantForm,
        addParticipantMenuLink,
        addParticipantQuickBtn,
        participantCloseBtn,
        participantCancelBtn
    });
});