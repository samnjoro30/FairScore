document.addEventListener('DOMContentLoaded', function() {
    const scoreModal = document.getElementById('scoreModal');
    const scoreBtn = document.getElementById('scoreParticipantBtn');
    const closeBtn = document.querySelector('.close');
    const participantsList = document.getElementById('participantsList');
    const judgeId = 1; // In real app, get from session
    
    // Open modal when score button is clicked
    scoreBtn.addEventListener('click', function() {
        scoreModal.style.display = 'block';
        loadParticipants();
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        scoreModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === scoreModal) {
            scoreModal.style.display = 'none';
        }
    });
    
    // Load participants from backend
    function loadParticipants() {
        participantsList.innerHTML = '<tr><td colspan="3" class="loading-message">Loading participants...</td></tr>';
        
        fetch('http://localhost/fairscore/backend/get_participants.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(participants => {
                displayParticipants(participants);
            })
            .catch(error => {
                console.error('Error loading participants:', error);
                participantsList.innerHTML = '<tr><td colspan="3" class="error-message">Error loading participants. Please try again.</td></tr>';
            });
    }
    
    // Display participants in the table
    function displayParticipants(participants) {
        participantsList.innerHTML = '';
        
        if (participants.length === 0) {
            participantsList.innerHTML = '<tr><td colspan="3">No participants found</td></tr>';
            return;
        }
        
        participants.forEach(participant => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="participant-info">
                        <div class="participant-name">${participant.full_name}</div>
                    </div>
                </td>
                <td>
                    <input type="number" 
                           class="score-input" 
                           min="0" 
                           max="10" 
                           data-participant-id="${participant.participant_id}"
                           placeholder="Enter score">
                </td>
                <td>
                    <button class="action-btn btn-primary save-score-btn" 
                            data-participant-id="${participant.participant_id}">
                        Save Score
                    </button>
                </td>
            `;
            
            participantsList.appendChild(row);
        });
        
        // Add event listeners to all save buttons
        document.querySelectorAll('.save-score-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const participantId = this.getAttribute('data-participant-id');
                const scoreInput = document.querySelector(`.score-input[data-participant-id="${participantId}"]`);
                const score = scoreInput.value;
                
                if (score === '' || isNaN(score)) {
                    alert('Please enter a valid score');
                    scoreInput.focus();
                    return;
                }
                
                if (score < 0 || score > 10) {
                    alert('Score must be between 0 and 10');
                    scoreInput.focus();
                    return;
                }
                
                saveScore(judgeId, participantId, score, this);
            });
        });
    }
    
    // Save score to backend
    function saveScore(judgeId, participantId, score, buttonElement) {
        const btn = buttonElement;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Saving...';
        
        // Add debug logging
        console.log('Sending:', { judgeId, participantId, score });
        
        fetch('http://localhost/fairscore/backend/save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                judge_id: judgeId,
                participant_id: participantId,
                score: score
            })
        })
        .then(async response => {
            const data = await response.json();
            console.log('Received:', data);
            
            if (!response.ok) {
                // Create an error object with the server's response
                const error = new Error(data.error || 'Unknown error occurred');
                error.response = data;
                throw error;
            }
            return data;
        })
        .then(data => {
            if (data.success) {
                btn.textContent = 'Saved!';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to save score');
            }
        })
        .catch(error => {
            console.error('Full error:', error);
            let errorMsg = 'Error saving score';
            
            if (error.response) {
                // Use the server's error message if available
                errorMsg = error.response.error || error.response.message || errorMsg;
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            alert(errorMsg);
            btn.textContent = originalText;
            btn.disabled = false;
        });
    }
    // View Scores button functionality
    document.getElementById('viewScoresBtn').addEventListener('click', function() {
        fetch(`http://localhost/fairscore/backend/get_scores.php?judge_id=${judgeId}`)
            .then(response => response.json())
            .then(scores => {
                if (!Array.isArray(scores)) {
                    throw new Error(scores.error || 'Failed to fetch scores');
                }
    
                let html = '<h3>My Scores</h3>';
                if (scores.length === 0) {
                    html += '<p>You haven’t scored any participants yet.</p>';
                } else {
                    html += `
                        <table class="score-table">
                            <thead>
                                <tr>
                                    <th>Participant</th>
                                    <th>Score</th>
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    scores.forEach(score => {
                        html += `
                            <tr>
                                <td>${score.full_name}</td>
                                <td>${score.score}</td>
                                <td>${new Date(score.created_at).toLocaleString()}</td>
                            </tr>
                        `;
                    });
                    html += '</tbody></table>';
                }
    
                // Display in a modal or section (you can adjust where it goes)
                const scoresContainer = document.getElementById('scoresContainer');
                scoresContainer.innerHTML = html;
                scoresContainer.style.display = 'block';
    
            })
            .catch(error => {
                console.error('Error loading scores:', error);
                alert('Failed to load scores: ' + error.message);
            });
    });
    
});