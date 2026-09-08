import ollama


SCHEMA = """
Database: employees.db

Table: employees

Columns:
employee_id INTEGER
name TEXT
department TEXT
designation TEXT
salary INTEGER
city TEXT
experience INTEGER
"""


def generate_sql(question):

    prompt = f"""
You are an expert SQL query generator.

{SCHEMA}

Convert the user's natural language question into a SQLite SQL query.

Rules:
1. Generate only SELECT queries.
2. Do not generate INSERT.
3. Do not generate UPDATE.
4. Do not generate DELETE.
5. Do not generate DROP.
6. Do not use columns that do not exist.
7. Return only the SQL query.
8. Do not include markdown.
9. Do not include explanations.

User question:
{question}
"""

    response = ollama.chat(
        model="llama3.2:latest",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    sql = response["message"]["content"].strip()

    return sql