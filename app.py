from flask import Flask
from routes.rotas import rotas
from dotenv import load_dotenv
import os

load_dotenv()
MY_SECRET_KEY = os.getenv('MY_SECRET_KEY')

app = Flask(__name__)
app.secret_key = MY_SECRET_KEY
app.register_blueprint(rotas)

app.run(debug=True)