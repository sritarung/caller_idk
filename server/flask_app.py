from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend to fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint to get all user data
@app.get("/admin/dashboard")
def get_all_user_data():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    columns = [column[0] for column in cursor.description]
    conn.close()

    # Format data into a list of dictionaries
    data = [dict(zip(columns, row)) for row in rows]
    return {"users": data}

# Endpoint to submit user form data
@app.post("/userform")
async def submit_form(request: Request):
    data = await request.json()

    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    # You’ll need to match keys to your table schema
    c.execute(
        "INSERT INTO users (name, email, date, ...) VALUES (?, ?, ?, ...)",  # Adjust columns accordingly
        (data["name"], data["email"], data["date"], ...)  # Ensure the keys match the data structure
    )

    conn.commit()
    conn.close()

    return {"message": "Form data saved successfully"}
