from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory
import os
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import datetime

app = Flask(__name__, template_folder='templates')

app.secret_key = os.urandom(24)

try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['user_auth_db']
    users_collection = db['users']
    users_collection.create_index('username', unique=True)
    
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if not username or not password:
        flash('Please enter both username and password.')
        return redirect('/')
    
    user = users_collection.find_one({'username': username})
    
    if not user:
        flash('Username not found. Please register first.')
        return redirect('/')
    
    if check_password_hash(user['password'], password):
        session['logged_in'] = True
        session['username'] = username
        return redirect('/home')
    
    else:
        flash('Incorrect password. Please try again.')
        return redirect('/')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    
    if not username or not email or not password:
        flash('Please fill out all fields.')
        return redirect('/')
    
    # Check if username already exists
    existing_user = users_collection.find_one({'username': username})
    if existing_user:
        flash('Username already exists. Please choose another one.')
        return redirect('/')
    
    # Hash the password for security
    hashed_password = generate_password_hash(password)
    
    # Create user document
    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'created_at': datetime.datetime.now()
    }
    
    # Insert user into MongoDB
    try:
        users_collection.insert_one(new_user)
        flash('Registration successful! Please log in.')
    except Exception as e:
        flash(f'An error occurred during registration: {str(e)}')
    
    return redirect('/')

@app.route('/home')
def home():
    if 'logged_in' not in session:
        flash('Please log in first.')
        return redirect('/')
    return render_template('home.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.')
    return redirect('/')

# Serve static files (JS and CSS)
@app.route('/style.css')
def serve_css():
    return send_from_directory('templates', 'style.css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('templates', 'script.js')

if __name__ == '__main__':
    app.run(debug=True)