import re;
from database import conexao as c
import base64
import pymysql

def insertAccount(nome, email, passw):
    try:
        connection = c.openBD()
        cursor = connection.cursor()
        with open('static/img/InitProfile.png', 'rb') as file:
            imageProfile = file.read()

        if verifyPass(passw):
            query = """
            INSERT INTO usuario (nome_user, email, senha, avatar) 
            VALUES (%s, %s, %s, %s);
            """
            cursor.execute(query, (nome, email, passw, imageProfile))
            connection.commit()
            connection.close()
            return True
        else:
            return False
    except Exception as e:
        print(e)
        return False

#Criação de Contas.
def login(email, senha):
    try:
        connection = c.openBD()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        cursor.execute(
            """
            SELECT id, nome_user, email, senha, avatar
            FROM usuario
            WHERE email = %s AND senha = %s
            """,
            (email, senha)
        )

        acc = cursor.fetchone()

        cursor.close()
        connection.close()

        if not acc:
            return None

        if acc['avatar']:
            icon = base64.b64encode(acc['avatar']).decode('utf-8')
        else:
            icon = None

        return {
            'id': acc['id'],
            'username': acc['nome_user'],
            'email': acc['email'],
            'senha': acc['senha'],
            'icon': icon
        }

    except Exception as e:
        print(e)
        return None

def updateAccount(id, novoNome, novoEmail, novaSenha, icon):
    try:
        connection = c.openBD()
        cursor = connection.cursor()

        if not verifyPass(novaSenha):
            return "passInvalid"

        if icon is None:
            query = """
                UPDATE usuario
                SET nome_user=%s, email=%s, senha=%s
                WHERE id=%s
            """
            cursor.execute(query, (novoNome, novoEmail, novaSenha, id))
        else:
            query = """
                UPDATE usuario
                SET nome_user=%s, email=%s, senha=%s, avatar=%s
                WHERE id=%s
            """
            cursor.execute(query, (novoNome, novoEmail, novaSenha, icon, id))

        connection.commit()
        connection.close()
        return "sucess"

    except Exception as e:
        print(e)
        return "error"

def deleteAccount(id):
    try:
        connection = c.openBD()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM usuario WHERE id = %s",
            (id,)
        )

        connection.commit()
        cursor.close()
        connection.close()
        return True

    except Exception as e:
        print(e)
        return False
    
def verifyPass(passw):
    # Pelo menos uma letra maiúscula
    if not re.search(r'[A-Z]', passw):
        return False
    
    # Pelo menos uma letra minúscula
    if not re.search(r'[a-z]', passw):
        return False

    # Pelo menos um número
    if not re.search(r'[0-9]', passw):
        return False

    # Pelo menos 8 caracteres
    if len(passw) < 8:
        return False
    
    return True