import sqlite3


def create_database():

    connection = sqlite3.connect("employees.db")

    cursor = connection.cursor()

    # Create employees table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            employee_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            designation TEXT NOT NULL,
            salary INTEGER NOT NULL,
            city TEXT NOT NULL,
            experience INTEGER NOT NULL
        )
    """)

    # Insert sample employee data
    employees = [
        (101, "Priya", "IT", "Software Developer", 65000, "Mumbai", 3),
        (102, "Rahul", "HR", "HR Manager", 70000, "Pune", 5),
        (103, "Sneha", "IT", "Data Analyst", 60000, "Mumbai", 2),
        (104, "Amit", "Finance", "Accountant", 55000, "Delhi", 4),
        (105, "Neha", "IT", "Project Manager", 85000, "Bangalore", 7),
        (106, "Rohit", "Sales", "Sales Executive", 45000, "Mumbai", 2),
        (107, "Pooja", "HR", "Recruiter", 50000, "Pune", 3),
        (108, "Karan", "Finance", "Financial Analyst", 75000, "Delhi", 6),
        (109, "Anjali", "IT", "Software Engineer", 72000, "Chennai", 4),
        (110, "Vikas", "Sales", "Sales Manager", 68000, "Mumbai", 8)
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO employees
        (employee_id, name, department, designation, salary, city, experience)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, employees)

    connection.commit()

    connection.close()

    print("Employee database created successfully!")


if __name__ == "__main__":
    create_database()