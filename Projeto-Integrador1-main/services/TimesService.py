from database import conexao as c
import base64
from database import Models
from Estruturas import ListaDEncadeada as ls

def criarTime(escudo, nome, abreviacao, maratona_id):
    try:
        conn = c.openBD()
        cursor = conn.cursor()
        query = "INSERT INTO times(nome_time, abreviacao, escudo, maratonaId) VALUES (%s, %s, %s, %s);"

        cursor.execute(query, (nome, abreviacao, escudo, maratona_id))
        conn.commit()
        conn.close()
        return True

    except Exception as e:
        print(e)
        return False

def atualizarTime(id, nome, abreviacao, escudo):
    try:
        conn = c.openBD()
        cursor = conn.cursor()
        query = "UPDATE times SET nome_time=%s, abreviacao=%s, escudo=%s WHERE id = %s;"

        cursor.execute(query, (nome, abreviacao, escudo,  id))
        conn.commit()
        conn.close()

        return True
    except Exception as e:
        print(e)
        return False

def listarTimes(maratona_id):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        query = "SELECT t.id, t.nome_time, t.abreviacao, t.escudo, t.maratonaId FROM times t WHERE t.maratonaId = %s;"
        cursor.execute(query, (maratona_id,))
        data = cursor.fetchall()

        dados = []
        lista = ls.ListaDuplamenteEncadeada()

        for acc in data:
            if acc['escudo']:
                icon = base64.b64encode(acc['escudo']).decode('utf-8')
            else:
                icon = None

            time = Models.Team(acc['id'], acc['nome_time'], acc['abreviacao'], icon, acc['maratonaId'])
            lista.inserir_inicio(time)

        return lista
    except Exception as e:
        print(e)
        return []

def deletarTime(id):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        # verifica se o time participa de alguma partida
        cursor.execute(
            """
            SELECT 1
            FROM partidas
            WHERE (time1 = %s OR time2 = %s)
            LIMIT 1
            """,
            (id, id)
        )

        if cursor.fetchone():
            conn.close()
            return False 

        # se não participa, pode deletar
        cursor.execute("DELETE FROM times WHERE id = %s", (id,))
        conn.commit()
        conn.close()

        return True

    except Exception as e:
        print("ERRO AO DELETAR TIME:", e)
        return False
