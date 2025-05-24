function loginAdmin() {
    const data = {
        username : document.getElementById('username').value,
        password: document.getElementById('password').value
      };
    
      fetch('../backend/api/admin_login.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'include'
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          window.location.href = 'admin_dashboard.html';
        } else {
          alert(res.message);
        }
      });
    }