// document.addEventListener('DOMContentLoaded', function() {
//     // Existing judge form code...
    
//     // Get participant form elements
//     const participantForm = document.getElementById('participantForm');
//     const addParticipantMenuLink = document.querySelector('.sidebar-menu li:nth-child(5) a'); // Add Participant menu item
//     const addParticipantQuickBtn = document.querySelector('.quick-actions .action-btn:nth-child(2)'); // Second quick action button
//     const participantCloseBtn = participantForm.querySelector('.close-btn');
//     const participantCancelBtn = participantForm.querySelector('.cancel-btn');

//     // Function to show participant form
//     function showParticipantForm() {
//         // Hide all main content sections
//         contentSections.forEach(section => {
//             section.style.display = 'none';
//         });
        
//         // Hide judge form if open
//         judgeForm.style.display = 'none';
        
//         // Show the participant form
//         participantForm.style.display = 'block';
//     }

//     // Function to hide participant form
//     function hideParticipantForm() {
//         // Show all main content sections
//         contentSections.forEach(section => {
//             section.style.display = '';
//         });
        
//         // Hide the form
//         participantForm.style.display = 'none';
//     }

//     // Event listeners for showing participant form
//     addParticipantMenuLink.addEventListener('click', function(e) {
//         e.preventDefault();
//         showParticipantForm();
//     });

//     addParticipantQuickBtn.addEventListener('click', function(e) {
//         e.preventDefault();
//         showParticipantForm();
//     });

//     // Event listeners for hiding participant form
//     participantCloseBtn.addEventListener('click', hideParticipantForm);
//     participantCancelBtn.addEventListener('click', hideParticipantForm);

//     // Participant form submission handler
//     document.getElementById('participantRegistrationForm').addEventListener('submit', function(e) {
//         e.preventDefault();
//         // Here you would handle form submission
//         alert('Participant added successfully!');
//         this.reset();
//         hideParticipantForm();
        
//         // Update participant count (example)
//         const participantCount = document.querySelector('.sidebar-menu li:nth-child(6) .menu-badge');
//         if (participantCount) {
//             const currentCount = parseInt(participantCount.textContent);
//             participantCount.textContent = currentCount + 1;
//         }
//     });
// });s