
document.addEventListener("DOMContentLoaded", function () {
    fetch("results.php")
        .then(response => response.json())
        .then(data => {
            // Display top participants (optional)
            const winnersSection = document.querySelector('.winners-section');
            winnersSection.innerHTML = "<h2>Top Participants</h2>";
            const list = document.createElement("ol");

            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.participant_id} — Avg Score: ${parseFloat(item.average_score).toFixed(2)}`;
                list.appendChild(li);
            });
            winnersSection.appendChild(list);

            // Prepare data for Chart.js
            const labels = data.map(item => item.participant_id);
            const scores = data.map(item => parseFloat(item.average_score));

            // Draw chart
            const ctx = document.getElementById("scoreDistributionChart").getContext("2d");
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Average Score',
                        data: scores,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                        title: {
                            display: true,
                            text: 'Participant Average Scores'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Score' }
                        },
                        x: {
                            title: { display: true, text: 'Participant ID' }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error fetching chart data:", error);
        });
});
function updateTime() {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('update-time').textContent = `Today at ${formatted}`;
}

updateTime();

document.addEventListener("DOMContentLoaded", function () {
    function fetchAndDisplayWinners() {
        fetch("http://localhost/fairscore/backend/results.php")
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".winners-table tbody");
                tbody.innerHTML = ""; // Clear previous rows

                data.forEach((item, index) => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.participant_id}</td>
                        <td>${parseFloat(item.average_score).toFixed(2)}</td>
                        <td>${item.category || "N/A"}</td> <!-- Optional: Add 'category' if available -->
                    `;

                    tbody.appendChild(row);
                });

                // Optional: Chart rendering
                if (typeof displayChart === 'function') {
                    displayChart(data);
                }
            })
            .catch(error => {
                console.error("Error fetching scores:", error);
            });
    }

    // Initial fetch
    fetchAndDisplayWinners();

    // Repeat fetch every 60 seconds
    setInterval(fetchAndDisplayWinners, 60000); // 60000ms = 60 seconds
});

function renderWinnersTable(data) {
    const tableBody = document.getElementById('winners-table-body');
    tableBody.innerHTML = '';
    
    data.forEach(winner => {
        const row = document.createElement('tr');
        
        // Highlight top 3 winners
        if (winner.rank <= 3) {
            row.classList.add(`top-${winner.rank}`);
        }
        
        row.innerHTML = `
            <td>${winner.rank}</td>
            <td>${winner.id}</td>
            <td>${winner.score.toFixed(1)}</td>
            <td>${winner.category}</td>
        `;
        
        tableBody.appendChild(row);
    });
}