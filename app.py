from flask import Flask , session , redirect , render_template , url_for , request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myDatabase'
app.secret_key='test'

mongo = PyMongo(app)

@app.route("/")
def home():
    if "username" in session:
        username = session['username']
        return render_template('home.html',username=username)
    return redirect(url_for("login"))

@app.route("/login", methods= ['POST','GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = mongo.db.inventory.find_one({'username': username})
        if user and user['password'] == password:
            session['username'] = username
            return redirect(url_for('home'))
        return redirect(url_for('login'))
    return render_template("login.html")

@app.route("/register", methods = ['POST','GET'])
def register():
    if request.method == 'POST':
        email = request.form('email')
        username = request.form('username')
        password = request.form('password')
        if mongo.db.inevtory.find_one({'email': email}):
            return redirect(url_for(register))
        if mongo.db.inventory.find_one({'username': username}):
            return redirect(url_for(register))
        mongo.db.inventory.insert_one({'email': email,'username': username,'password':password,'role':'user'})
        return redirect(url_for('login'))
    return render_template('register.html')
@app.route("/logout")
def logout():
    session.pop("username")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
    if not mongo.db.inventory.find_one({'username':'dhruv'}):
        mongo.db.inventory.insert_one({'email':'dhruv08157@gmail.com','username': 'dhruv','password':'2588','role':'admin'})
