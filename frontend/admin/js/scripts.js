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

    // Add this to your existing JavaScript
document.getElementById('generateUsername')?.addEventListener('click', function() {
    const randomId = 'JUDGE-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('judgeUsername').value = randomId;
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