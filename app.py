from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from sql_generator import generate_sql
from query_executor import execute_query
from validator import validate_sql


app = FastAPI(
    title="LLM Employee SQL Query Generator"
)


# Serve frontend files
app.mount(
    "/static",
    StaticFiles(directory="frontend"),
    name="static"
)


class QueryRequest(BaseModel):

    question: str


# Frontend home page
@app.get("/")
def home():

    return FileResponse("frontend/index.html")


# Generate SQL + execute query
@app.post("/generate-query")
def generate_query(request: QueryRequest):

    try:

        # Step 1: Generate SQL using Llama
        sql = generate_sql(request.question)

        # Step 2: Validate SQL
        valid, message = validate_sql(sql)

        if not valid:

            return {
                "success": False,
                "question": request.question,
                "sql": sql,
                "error": message
            }


        # Step 3: Execute SQL
        result = execute_query(sql)


        # Step 4: Check database error

        if isinstance(result, dict) and "error" in result:

            return {
                "success": False,
                "question": request.question,
                "sql": sql,
                "error": result["error"]
            }


        # Step 5: Return result

        return {

            "success": True,

            "question": request.question,

            "sql": sql,

            "result": result

        }


    except Exception as e:

        return {

            "success": False,

            "error": str(e)

        }