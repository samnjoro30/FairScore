document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar collapse
    const collapseBtn = document.querySelector('.collapse-btn');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    collapseBtn.addEventListener('click', function() {
        dashboardContainer.classList.toggle('sidebar-collapsed');
    });
    
    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Initialize charts
    initializeCharts();
    
    // Judges management
    const judgesLink = document.getElementById('judges-link');
    const addJudgeBtn = document.getElementById('add-judge-btn');
    const judgesModal = document.getElementById('judges-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    
    // Open judges modal
    judgesLink.addEventListener('click', function(e) {
        e.preventDefault();
        judgesModal.style.display = 'flex';
        loadJudgesData();
    });
    
    addJudgeBtn.addEventListener('click', function() {
        judgesModal.style.display = 'flex';
        // Switch to add judge tab
        document.querySelector('.tab-btn[data-tab="add-judge"]').click();
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        judgesModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === judgesModal) {
            judgesModal.style.display = 'none';
        }
    });
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form submission for adding judge
    const addJudgeForm = document.getElementById('add-judge-form');
    
    addJudgeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const judgeData = {
            name: document.getElementById('judge-name').value,
            email: document.getElementById('judge-email').value,
            specialty: document.getElementById('judge-specialty').value,
            status: document.getElementById('judge-status').value
        };
        
        addJudge(judgeData);
    });
    
    // Search and filter judges
    const judgeSearch = document.getElementById('judge-search');
    const judgeFilter = document.getElementById('judge-filter');
    
    judgeSearch.addEventListener('input', filterJudges);
    judgeFilter.addEventListener('change', filterJudges);
    
    // Load initial data
    loadJudgesData();
});

function loadJudgesData() {
    
    fetch('http://localhost/fairscore/backend/judges.php?action=getAll')
        .then(response => response.json())
        .then(data => displayJudges(data))
        .catch(error => console.error('Error loading judges:', error));
}

function displayJudges(judges) {
    const tbody = document.querySelector('#judges-table tbody');
    tbody.innerHTML = '';
    
    judges.forEach(judge => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${judge.id}</td>
            <td>${judge.name}</td>
            <td>${judge.email}</td>
            <td><span class="status-badge ${judge.status}">${judge.status}</span></td>
            <td>
                <button class="btn-action edit-judge" data-id="${judge.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete-judge" data-id="${judge.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-judge').forEach(btn => {
        btn.addEventListener('click', function() {
            const judgeId = this.getAttribute('data-id');
            editJudge(judgeId);
        });
    });
    
    document.querySelectorAll('.delete-judge').forEach(btn => {
        btn.addEventListener('click', function() {
            const judgeId = this.getAttribute('data-id');
            deleteJudge(judgeId);
        });
    });
}

function filterJudges() {
    const searchTerm = document.getElementById('judge-search').value.toLowerCase();
    const filterValue = document.getElementById('judge-filter').value;
    
    const rows = document.querySelectorAll('#judges-table tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        const status = row.cells[3].textContent;
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesFilter = filterValue === 'all' || status === filterValue;
        
        if (matchesSearch && matchesFilter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function addJudge(judgeData) {
    // In a real app, this would send data to your PHP backend
    console.log('Adding judge:', judgeData);
    
    
    fetch('http://localhost/fairscore/backend/judges.php?action=add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(judgeData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Judge added successfully!');
            document.getElementById('add-judge-form').reset();
            loadJudgesData();
            // Switch back to judges list tab
            document.querySelector('.tab-btn[data-tab="judges-list"]').click();
        } else {
            alert('Error adding judge: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding judge');
    });
    // For demo purposes, we'll just show an alert
    alert(`Judge ${judgeData.name} added successfully! (This would be saved to database in real app)`);
    document.getElementById('add-judge-form').reset();
    // Switch back to judges list tab
    document.querySelector('.tab-btn[data-tab="judges-list"]').click();
}

function editJudge(judgeId) {
    // In a real app, this would fetch judge data and populate a form
    console.log('Editing judge with ID:', judgeId);
    alert(`Editing judge with ID: ${judgeId} (Functionality to be implemented)`);
}

function deleteJudge(judgeId) {
    if (confirm('Are you sure you want to delete this judge?')) {
        // In a real app, this would send a request to your PHP backend
        console.log('Deleting judge with ID:', judgeId);
        
        fetch(`http://localhost/fairscore/backend/judges.php?action=delete&id=${judgeId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadJudgesData();
                } else {
                    alert('Error deleting judge: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting judge');
            });
        
        // For demo purposes, we'll just show an alert
        alert(`Judge with ID ${judgeId} deleted! (This would remove from database in real app)`);
        loadJudgesData();
    }
}