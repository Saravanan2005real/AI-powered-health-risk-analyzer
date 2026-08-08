import json
import os
import uuid
from datetime import datetime

DB_FILE = "database.json"

def init_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({"submissions": []}, f)

def read_db():
    init_db()
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"submissions": []}

def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

def add_submission(user_email, patient_data, file_path):
    db = read_db()
    sub_id = str(uuid.uuid4())
    new_submission = {
        "id": sub_id,
        "user_email": user_email,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "patient_data": patient_data,
        "file_path": file_path,
        "status": "Pending",
        "prediction": None,
        "prescription": None
    }
    db["submissions"].append(new_submission)
    write_db(db)
    return sub_id

def get_submissions_by_user(user_email):
    db = read_db()
    return [sub for sub in db["submissions"] if sub["user_email"] == user_email]

def get_all_submissions():
    db = read_db()
    return db["submissions"]

def update_submission(sub_id, prediction=None, prescription=None):
    db = read_db()
    for sub in db["submissions"]:
        if sub["id"] == sub_id:
            if prediction is not None:
                sub["prediction"] = prediction
                sub["status"] = "Predicted"
            if prescription is not None:
                sub["prescription"] = prescription
                sub["status"] = "Completed"
            break
    write_db(db)
