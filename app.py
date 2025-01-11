import json
from datetime import datetime

from flask import Flask, jsonify, render_template, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'xyz'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

notes = []
users = {}  

class Stat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(50))
    energy = db.Column(db.String(50))
    sleep_hours = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html') 

@app.route('/journaling')
def journaling():
    load_notes()
    return render_template('journaling.html', notes=notes)

@app.route('/add_note', methods=['POST'])
def add_note():
    note_text = request.form['note_text']
    note_color = request.form['note_color']
    notes.append({'text': note_text, 'color': note_color})
    save_notes()
    return journaling()


@app.route('/delete_note/<int:note_id>', methods=['GET', 'POST'])
def delete_note(note_id):
    if request.method == 'POST':
        del notes[note_id]
        save_notes()
    return journaling()


def load_notes():
    global notes
    try:
        with open('notes.json', 'r') as file:
            notes = json.load(file)
    except FileNotFoundError:
        notes = []


def save_notes():
    with open('notes.json', 'w') as file:
        json.dump(notes, file, indent=4)

@app.route('/health_resource')
def health_resource():
    return render_template('health_resource.html')

@app.route('/cbt_quiz')
def cbt_quiz():
    return render_template('cbt_quiz.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if email in users:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users[email] = {"name": name, "password": hashed_password}
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users.get(email)
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"message": "Login successful!", "token": access_token}), 200

@app.route('/save-stats', methods=['POST'])
def save_stats():
    data = request.get_json()
    new_stat = Stat(
        mood=data.get('mood'),
        energy=data.get('energy'),
        sleep_hours=data.get('sleepHours'),
        timestamp=datetime.fromisoformat(data.get('timestamp'))
    )
    db.session.add(new_stat)
    db.session.commit()
    return jsonify({'message': 'Stats saved successfully'})

@app.route('/stats')
def stats():
    stats = Stat.query.all()
    return render_template('stats.html', stats=stats)

if __name__ == '__main__':
    app.run(debug=True)
