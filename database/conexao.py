import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

def openBD():
    try:
        connection = pymysql.connect(host=DB_HOST,
                                user=DB_USER,
                                password=DB_PASSWORD,
                                database=DB_NAME,
                                port=int(DB_PORT),
                                cursorclass=pymysql.cursors.DictCursor)
        print('Conectado ao banco!')
        return connection
    except NameError as e:
        print(e)