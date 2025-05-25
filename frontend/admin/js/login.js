

document.getElementById('admin-login').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
  };
  
  try {
      const response = await fetch('http://localhost/fairscore/backend/login.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded', // FIXED HEADER
          },
          body: new URLSearchParams(formData)
      });
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Server response:", data);
      
      if (data.success) {
          window.location.href = 'dashboard.html';
      } else {
          document.getElementById('error-message').textContent = data.error;
      }
  } catch (error) {
      console.error("Fetch error:", error);
      document.getElementById('error-message').textContent = 'Network error, please try again';
  }
});