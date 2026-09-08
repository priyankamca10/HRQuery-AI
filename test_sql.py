from sql_generator import generate_sql
from query_executor import execute_query
from validator import validate_sql


question = "Show employees earning more than 60000"

# Generate SQL
sql = generate_sql(question)

print("\nGenerated SQL:")
print(sql)

# Validate SQL
valid, message = validate_sql(sql)

print("\nValidation:")
print(message)

if valid:

    # Execute SQL
    result = execute_query(sql)

    print("\nQuery Result:")
    print(result)

else:

    print("\nQuery was not executed.")