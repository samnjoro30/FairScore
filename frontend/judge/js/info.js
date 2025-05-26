
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost/fairscore/backend/login_info.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("adminUsername").textContent = data.judge_name;
                document.getElementById("adminEmail").innerHTML = `<i class="fas fa-envelope"></i> ${data.judge_email}`;
                document.getElementById("adminLastLogin").innerHTML = `<i class="fas fa-clock"></i> ${data.last_login}`;
            } else {
                console.error("Not logged in:", data.error);
            }
        })
        .catch(error => {
            console.error("Error fetching judge info:", error);
        });
});
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".theme-toggle");
    const icon = toggleBtn.querySelector("i");

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        icon.classList.replace("fa-moon", "fa-sun");
    }

    toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Change icon
        if (document.body.classList.contains("dark-mode")) {
            icon.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        } else {
            icon.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        }
    });
});

document.getElementById("scoreParticipantBtn").addEventListener("click", function () {
    document.getElementById("scoreModal").style.display = "block";
});

