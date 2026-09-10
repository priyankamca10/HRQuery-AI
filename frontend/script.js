// =========================
// SET QUESTION
// =========================

function setQuestion(question) {
    document.getElementById("question").value = question;
}


// =========================
// GENERATE SQL
// =========================


async function generateQuery() {

    const questionInput = document.getElementById("question");
    const question = questionInput.value.trim();

    if (!question) {
        showError("Please enter a question.");
        return;
    }

    const loading = document.getElementById("loading");
    const errorBox = document.getElementById("errorBox");
    const sqlSection = document.getElementById("sqlSection");
    const explanationSection = document.getElementById("explanationSection");
    const resultSection = document.getElementById("resultSection");
    const generateBtn = document.getElementById("generateBtn");

    // Reset
    errorBox.classList.add("hidden");
    sqlSection.classList.add("hidden");
    explanationSection.classList.add("hidden");
    resultSection.classList.add("hidden");

    // Loading
    loading.classList.remove("hidden");
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";

    try {

        const response = await fetch("/generate-query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Something went wrong."
            );
        }

        if (!data.success) {
            showError(
                data.error || "Unable to generate SQL."
            );
            return;
        }

        // Show SQL
        document.getElementById("sql").textContent = data.sql;
        sqlSection.classList.remove("hidden");

        // Explanation
        const explanation = generateExplanation(
            data.sql,
            question
        );

        document.getElementById("explanation").textContent =
            explanation;

        explanationSection.classList.remove("hidden");

        // Results
        displayResults(data.result);
        resultSection.classList.remove("hidden");

    } catch (error) {

        showError("Error: " + error.message);

    } finally {

        loading.classList.add("hidden");
        generateBtn.disabled = false;
        generateBtn.innerText = "Generate SQL";
    }
}


// =========================
// SHOW ERROR
// =========================

function showError(message) {

    const errorBox = document.getElementById("errorBox");

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");
}


// =========================
// DISPLAY RESULTS
// =========================

function displayResults(result) {

    const container =
        document.getElementById("resultContainer");

    // Database error
    if (!Array.isArray(result)) {

        container.innerHTML =
            `<p>${result.error || "No results found."}</p>`;

        return;
    }

    // No records
    if (result.length === 0) {

        container.innerHTML =
            "<p>No records found.</p>";

        return;
    }

    const columns = Object.keys(result[0]);

    let html = "<table>";

    // Header
    html += "<thead><tr>";

    columns.forEach(column => {

        html += `<th>${formatColumn(column)}</th>`;

    });

    html += "</tr></thead>";

    // Body
    html += "<tbody>";

    result.forEach(row => {

        html += "<tr>";

        columns.forEach(column => {

            html += `<td>${row[column]}</td>`;

        });

        html += "</tr>";

    });

    html += "</tbody>";

    html += "</table>";

    container.innerHTML = html;
}


// =========================
// FORMAT COLUMN
// =========================

function formatColumn(column) {

    return column
        .replaceAll("_", " ")
        .replace(/\b\w/g, char => char.toUpperCase());

}


// =========================
// COPY SQL
// =========================

function copySQL() {

    const sql =
        document.getElementById("sql").textContent;

    navigator.clipboard.writeText(sql);

    const button =
        document.querySelector(".copy-btn");

    button.innerText = "Copied!";

    setTimeout(() => {

        button.innerText = "Copy SQL";

    }, 1500);
}


// =========================
// QUERY EXPLANATION
// =========================

function generateExplanation(sql, question) {

    const upperSQL = sql.toUpperCase();

    if (upperSQL.includes("GROUP BY")) {

        if (upperSQL.includes("COUNT")) {

            return "This query groups employees by department and counts the number of employees in each department.";
        }

        if (upperSQL.includes("AVG")) {

            return "This query groups employees by department and calculates the average salary for each department.";
        }

        if (upperSQL.includes("MAX")) {

            return "This query groups employees by category and finds the highest value in each group.";
        }

        return "This query groups employee records according to the requested category.";
    }

    if (upperSQL.includes("COUNT")) {

        return "This query counts the number of employee records matching the requested condition.";
    }

    if (upperSQL.includes("AVG")) {

        return "This query calculates the average value requested from the employee records.";
    }

    if (upperSQL.includes("MAX")) {

        return "This query finds the highest value requested from the employee database.";
    }

    if (
        upperSQL.includes("ORDER BY") &&
        upperSQL.includes("DESC")
    ) {

        return "This query sorts employee records from highest to lowest.";
    }

    return "This query retrieves employee information matching your natural language question.";
}

async function loadDepartmentChart() {
    try {
        const response = await fetch("/department-stats");

        if (!response.ok) {
            throw new Error("Unable to load department data");
        }

        const data = await response.json();

        console.log("Department data:", data);

        const labels = data.map(item => item.department);
        const values = data.map(item => item.employee_count);

        const canvas = document.getElementById("departmentChart");

        if (!canvas) {
            console.error("departmentChart canvas not found!");
            return;
        }

        new Chart(canvas, {
            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Number of Employees",
                    data: values
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Chart error:", error);
    }
}

loadDepartmentChart();
// =========================
// HR DASHBOARD
// =========================

// async function loadDashboard() {

//     try {

//         console.log("Loading dashboard...");

//         const response = await fetch("/dashboard");

//         if (!response.ok) {

//             throw new Error("Dashboard API failed");

//         }

//         const data = await response.json();

//         console.log("Dashboard data:", data);


//         // Update Total Employees

//         document.getElementById("totalEmployees").textContent =
//             data.total_employees;


//         // Update Departments

//         document.getElementById("totalDepartments").textContent =
//             data.total_departments;


//         // Update Average Salary

//         document.getElementById("averageSalary").textContent =
//             "₹" + data.average_salary;


//         // Update Highest Salary

//         document.getElementById("highestSalary").textContent =
//             "₹" + data.highest_salary;

//     }

//     catch (error) {

//         console.error("Dashboard error:", error);

//     }
// }


// // =========================
// // LOAD DASHBOARD
// // =========================

// loadDashboard();