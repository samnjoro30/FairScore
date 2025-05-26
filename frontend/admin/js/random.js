// document.addEventListener('DOMContentLoaded', function() {
//     // ... [keep all your existing code until the ID generation part] ...

//     // ID Generation Functions
//     function generateJudgeId() {
//         const randomId = 'JUDGE-' + Math.floor(1000 + Math.random() * 9000);
//         const judgeUsernameField = document.getElementById('judgeUsername');
//         if (judgeUsernameField) judgeUsernameField.value = randomId;
//     }

//     function generateParticipantId() {
//         const randomId = 'Part-' + Math.floor(1000 + Math.random() * 9000);
//         const partiUsernameField = document.getElementById('partiUsername');
//         if (partiUsernameField) partiUsernameField.value = randomId;
//     }

//     // Event Delegation Approach (better for dynamic content)
//     document.body.addEventListener('click', function(e) {
//         // Judge ID generation
//         if (e.target.closest('#generateUsername')) {
//             e.preventDefault();
//             generateJudgeId();
//         }
        
//         // Participant ID generation
//         if (e.target.closest('#GUsername')) {
//             e.preventDefault();
//             generateParticipantId();
//         }
        
//         // Password visibility toggle
//         if (e.target.closest('.toggle-password')) {
//             e.preventDefault();
//             const passwordInput = document.getElementById('judgePassword');
//             if (passwordInput) {
//                 const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//                 passwordInput.setAttribute('type', type);
//                 const icon = e.target.closest('.toggle-password').querySelector('i');
//                 if (icon) icon.classList.toggle('fa-eye-slash');
//             }
//         }
//     });

//     // Debugging
//     console.log('ID Generation Elements:', {
//         generateUsernameBtn: document.getElementById('generateUsername'),
//         gUsernameBtn: document.getElementById('GUsername'),
//         judgeUsernameField: document.getElementById('judgeUsername'),
//         partiUsernameField: document.getElementById('partiUsername')
//     });
// });