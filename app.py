from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prediccion")
def prediccion():
    return render_template("prediccion.html")

@app.route("/quienes somos")
def quienes_somos():
    return render_template("quienes_somos.html")
