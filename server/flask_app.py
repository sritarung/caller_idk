import sqlite3

# Connect to SQLite database (it will create the file if it doesn't exist)
conn = sqlite3.connect('users.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

data = {
    "first_name": "John",
    "middle_initial": "A",
    "last_name": "Adams",
    "last_four_digits": "1234",
    "zip_code": "12345"
    
}

# Create the table with the correct column types and no syntax errors
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        middle_initial TEXT,
        last_name TEXT,
        last_four_digits TEXT,
        zip_code TEXT,
        human_voice BOOLEAN DEFAULT 0,
        matching_voice BOOLEAN DEFAULT 0,
        matching_face BOOLEAN DEFAULT 0
    )
''')

# Optional: Insert sample data (with default values for booleans)
cursor.execute('''
    INSERT INTO users (first_name, middle_initial, last_name, last_four_digits, zip_code)
    VALUES (?, ?, ?, ?, ?)
''', (
    data["first_name"],
    data["middle_initial"],
    data["last_name"],
    data["last_four_digits"],
    data["zip_code"]
))

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database, table, and sample row created successfully.")
