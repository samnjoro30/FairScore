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
});

document.addEventListener('DOMContentLoaded', function() {
    const judgesDropdown = document.getElementById('judgesDropdown');
    const judgeForm = document.getElementById('judgeForm');
    const participantForm = document.getElementById('participantForm');
    const viewJudgesBtn = document.querySelector('.view-judges-btn');
    
    // View Judges button handler with animation
    viewJudgesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Hide other forms
        judgeForm.style.display = 'none';
        participantForm.style.display = 'none';
        
        // Toggle judges dropdown with animation
        if (judgesDropdown.style.display === 'block') {
            judgesDropdown.style.opacity = '0';
            judgesDropdown.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                judgesDropdown.style.display = 'none';
            }, 200);
        } else {
            judgesDropdown.style.display = 'block';
            // Trigger reflow to enable animation
            void judgesDropdown.offsetWidth;
            judgesDropdown.style.opacity = '1';
            judgesDropdown.style.transform = 'translateY(0)';
            fetchJudges();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.judge-list-dropdown') && 
            !event.target.closest('.view-judges-btn') &&
            judgesDropdown.style.display === 'block') {
            judgesDropdown.style.opacity = '0';
            judgesDropdown.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                judgesDropdown.style.display = 'none';
            }, 200);
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && judgesDropdown.style.display === 'block') {
            judgesDropdown.style.opacity = '0';
            judgesDropdown.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                judgesDropdown.style.display = 'none';
            }, 200);
        }
    });
    
    // Rest of your existing JavaScript...
});

// If you want to periodically update the last login time
document.addEventListener('DOMContentLoaded', function() {
    // Initial load
    fetchAdminData();
    
    // Update every 5 minutes (optional)
    setInterval(fetchAdminData, 300000);
});

function fetchAdminData() {
    fetch('http://localhost/fairscore/backend/dashboard.php', {
        credentials: 'include' // Important for sending session cookies
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            updateAdminUI(data.data);
        } else {
            showError(data.error || 'Failed to load admin data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error loading admin information');
    });
}

function updateAdminUI(adminData) {
    document.getElementById('adminUsername').textContent = adminData.name;
    document.getElementById('adminEmail').innerHTML = 
        `<i class="fas fa-envelope"></i> ${adminData.email}`;
    document.getElementById('adminLastLogin').innerHTML = 
        `<i class="fas fa-clock"></i> Last login: ${adminData.last_login}`;
}

function showError(message) {
    // You can customize error display as needed
    console.error(message);
    document.getElementById('adminEmail').innerHTML = 
        `<i class="fas fa-envelope"></i> Error loading email`;
    document.getElementById('adminLastLogin').innerHTML = 
        `<i class="fas fa-clock"></i> Last login: Unknown`;
}