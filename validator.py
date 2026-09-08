def validate_sql(sql):

    sql_upper = sql.strip().upper()

    # Only SELECT queries are allowed
    if not sql_upper.startswith("SELECT"):
        return False, "Only SELECT queries are allowed."

    dangerous_keywords = [
        "DROP",
        "DELETE",
        "UPDATE",
        "INSERT",
        "ALTER",
        "TRUNCATE"
    ]

    for keyword in dangerous_keywords:

        if keyword in sql_upper:
            return False, f"{keyword} operation is not allowed."

    return True, "SQL query is valid."