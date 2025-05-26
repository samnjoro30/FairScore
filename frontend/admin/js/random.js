document.addEventListener('DOMContentLoaded', function() {
    // View Participants button click handler
    document.querySelector('.action-btn:nth-child(3)').addEventListener('click', function() {
        fetchParticipants();
        document.getElementById('participantsView').style.display = 'block';
    });

    // Close participants view
    document.getElementById('closeParticipantsView').addEventListener('click', function() {
        document.getElementById('participantsView').style.display = 'none';
    });

    const participantsView = document.getElementById('participantsView');
    const tableBody = document.getElementById('participantsTableBody');
    const actionButtons = document.querySelectorAll('.action-btn');
    const closeBtn = document.getElementById('closeParticipantsView');
    
    // Function to close participants view
    function closeParticipantsView() {
        participantsView.style.display = 'none';
    }

    // Function to fetch and display participants
    async function fetchParticipants() {
        participantsView.style.display = 'block';
        tableBody.innerHTML = '<tr><td colspan="4" class="loading-state">Loading participants...</td></tr>';

        try {
            const response = await fetch('http://localhost/fairscore/backend/get_participants.php');
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with status ${response.status}: ${errorText}`);
            }

            const participants = await response.json();
            const tableBody = document.getElementById('participantsTableBody');
            tableBody.innerHTML = '';

            if (participants.error) {
                throw new Error(participants.error);
            }

            participants.forEach(participant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${participant.participant_id}</td>
                    <td>${participant.full_name}</td>
                    <td>${participant.email}</td>
                    <td>${participant.phone || 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading participants:', error);
            alert('Error loading participants: ' + error.message);
        }
    }
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Close participants view first
            closeParticipantsView();
            
            // If this is the view participants button, fetch data
            if (button === document.querySelector('.action-btn:nth-child(3)')) {
                fetchParticipants();
            }
        });
   });
   closeBtn.addEventListener('click', closeParticipantsView);
});