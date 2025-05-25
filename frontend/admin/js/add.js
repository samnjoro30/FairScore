document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const viewJudgesBtn = document.querySelector('.quick-actions .action-btn:nth-child(4)');
    const judgeListSidebar = document.querySelector('.sidebar-menu li:nth-child(3) a');
    const judgesListSection = document.querySelector('.judges-list-section');
    const addJudgeForm = document.getElementById('judgeForm');
    const addParticipantForm = document.getElementById('participantForm');
    
    // Initially hide the judges list section
    judgesListSection.style.display = 'none';
    
    // Function to show judges list and hide other forms
    function showJudgesList() {
        judgesListSection.style.display = 'block';
        addJudgeForm.style.display = 'none';
        addParticipantForm.style.display = 'none';
        fetchJudges(); // Fetch and display judges
    }
    
    // Function to fetch judges (same as before)
    function fetchJudges() {
        const judgesTable = document.getElementById('judgesTable').getElementsByTagName('tbody')[0];
        const judgesCount = document.getElementById('judgesCount');
        
        fetch('http://localhost/fairscore/backend/list_judge.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    judgesTable.innerHTML = '';
                    data.data.forEach(judge => {
                        const row = judgesTable.insertRow();
                        row.insertCell().textContent = judge.id;
                        row.insertCell().textContent = judge.full_name;
                        row.insertCell().textContent = judge.email;
                        row.insertCell().textContent = judge.phone || 'N/A';
                        row.insertCell().textContent = judge.judge_id;
                        row.insertCell().textContent = judge.created_at;
                        
                        const actionsCell = row.insertCell();
                        actionsCell.className = 'actions';
                        
                        const editBtn = document.createElement('button');
                        editBtn.className = 'action-btn edit';
                        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                        editBtn.onclick = () => editJudge(judge.id);
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'action-btn delete';
                        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                        deleteBtn.onclick = () => deleteJudge(judge.id);
                        
                        actionsCell.appendChild(editBtn);
                        actionsCell.appendChild(deleteBtn);
                    });
                    
                    judgesCount.textContent = `Showing ${data.data.length} judges`;
                    updateSidebarJudgeCount(data.data.length);
                }
            });
    }
    
    // Function to update the judge count in sidebar
    function updateSidebarJudgeCount(count) {
        const badge = document.querySelector('.sidebar-menu li:nth-child(3) .menu-badge');
        if (badge) {
            badge.textContent = count;
        }
    }
    
    // Event listeners for showing judges list
    viewJudgesBtn.addEventListener('click', showJudgesList);
    judgeListSidebar.addEventListener('click', function(e) {
        e.preventDefault();
        showJudgesList();
    });
    
    // Placeholder functions for edit/delete
    function editJudge(judgeId) {
        alert(`Edit judge with ID: ${judgeId}`);
        // Implementation would go here
    }
    
    function deleteJudge(judgeId) {
        if (confirm(`Are you sure you want to delete judge with ID: ${judgeId}?`)) {
            alert(`Judge ${judgeId} would be deleted in a real implementation.`);
        }
    }
    
    // Refresh button functionality
    document.getElementById('refreshJudges')?.addEventListener('click', fetchJudges);
});

