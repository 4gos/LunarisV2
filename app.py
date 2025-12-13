from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/prediccion")
def prediccion():
    return render_template("prediccion.html")
