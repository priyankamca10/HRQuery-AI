function setQuestion(question) {

    document.getElementById("question").value = question;

}


async function generateQuery() {

    const questionInput = document.getElementById("question");

    const question = questionInput.value.trim();

    if (!question) {

        showError("Please enter a question.");

        return;
    }


    // Elements

    const loading = document.getElementById("loading");

    const errorBox = document.getElementById("errorBox");

    const sqlSection = document.getElementById("sqlSection");

    const explanationSection =
        document.getElementById("explanationSection");

    const resultSection =
        document.getElementById("resultSection");

    const generateBtn =
        document.getElementById("generateBtn");


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


        // Check success

        if (!data.success) {

            showError(
                data.error || "Unable to generate SQL."
            );

            return;
        }


        // Show SQL

        document.getElementById("sql").textContent =
            data.sql;

        sqlSection.classList.remove("hidden");


        // Explanation

        let explanation =
            generateExplanation(data.sql, question);

        document.getElementById("explanation").textContent =
            explanation;

        explanationSection.classList.remove("hidden");


        // Results

        displayResults(data.result);

        resultSection.classList.remove("hidden");


    }
    catch (error) {

        showError(
            "Error: " + error.message
        );

    }
    finally {

        loading.classList.add("hidden");

        generateBtn.disabled = false;

        generateBtn.innerText = "Generate SQL";

    }

}


function showError(message) {

    const errorBox =
        document.getElementById("errorBox");

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

}


function displayResults(result) {

    const container =
        document.getElementById("resultContainer");


    // Database error

    if (!Array.isArray(result)) {

        container.innerHTML =
            `<p>${result.error || "No results found."}</p>`;

        return;
    }


    if (result.length === 0) {

        container.innerHTML =
            "<p>No records found.</p>";

        return;
    }


    const columns =
        Object.keys(result[0]);


    let html = "<table>";


    // Header

    html += "<thead><tr>";

    columns.forEach(column => {

        html += `<th>${formatColumn(column)}</th>`;

    });

    html += "</tr></thead>";


    // Rows

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


function formatColumn(column) {

    return column
        .replaceAll("_", " ")
        .replace(/\b\w/g, char => char.toUpperCase());

}


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


/*
    Basic explanation for the UI.

    Later we can replace this with
    an LLM-generated explanation.
*/

function generateExplanation(sql, question) {

    const upperSQL =
        sql.toUpperCase();


    if (upperSQL.includes("COUNT")) {

        return "This query counts the number of employee records matching the requested condition.";

    }


    if (upperSQL.includes("AVG")) {

        return "This query calculates the average value requested from the employee records.";

    }


    if (upperSQL.includes("MAX")) {

        return "This query finds the highest value requested from the employee database.";

    }


    if (upperSQL.includes("ORDER BY") &&
        upperSQL.includes("DESC")) {

        return "This query sorts employee records from highest to lowest and returns the relevant top record.";

    }


    return "This query retrieves employee information matching your natural language question.";

}