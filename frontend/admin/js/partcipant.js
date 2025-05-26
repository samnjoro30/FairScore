document.addEventListener('DOMContentLoaded', function() {
    // Generate Participant ID
    document.getElementById('GUsername')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('partiUsername').value = 
            'PART-' + Math.floor(1000 + Math.random() * 9000);
    });

    // Auto-generate ID when form loads
    document.getElementById('partiUsername').value = 
        'PART-' + Math.floor(1000 + Math.random() * 9000);

    // Form submission handler
    const form = document.getElementById('participantRegistrationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Collect data element by element - FIXED FIELD NAMES
            const participantData = {
                full_name: document.getElementById('participantName').value.trim(),
                email: document.getElementById('participantEmail').value.trim(),
                phone: document.getElementById('participantPhone').value.trim() || null,
                participant_id: document.getElementById('partiUsername').value.trim()
            };

            // Validate required fields - FIXED FIELD NAMES
            if (!participantData.participant_id) {
                alert('Please generate a Participant ID first');
                return;
            }

            if (!participantData.full_name || !participantData.email) {
                alert('Please fill all required fields');
                return;
            }

            try {
                const submitBtn = form.querySelector('[type="submit"]');
                submitBtn.disabled = true;
                
                // Fixed typo in URL: partcipant.php → participant.php
                const response = await fetch('http://localhost/fairscore/backend/partcipant.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(participantData)
                });

                // Check response
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || 'Server error');
                }

                const result = await response.json();

                if (result.success) {
                    alert(`Participant registered successfully!\nID: ${result.data.participant_id}`);
                    form.reset();
                    // Regenerate new ID
                    document.getElementById('partiUsername').value = 
                        'PART-' + Math.floor(1000 + Math.random() * 9000);
                } else {
                    throw new Error(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            } finally {
                const submitBtn = form.querySelector('[type="submit"]');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});