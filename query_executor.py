import sqlite3


def execute_query(sql):

    connection = sqlite3.connect("employees.db")

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    try:

        cursor.execute(sql)

        results = cursor.fetchall()

        return [dict(row) for row in results]

    except Exception as e:

        return {
            "error": str(e)
        }

    finally:

        connection.close()