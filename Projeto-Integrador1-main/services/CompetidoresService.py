from database import conexao as c
from database import Models as mod
from Estruturas import ListaDEncadeada as le

def inserirCompetidores(nome, timeId):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        cursor.execute(f"INSERT INTO competidores (nome_competidor, timeId) VALUES ('{nome}', {timeId})")
        conn.commit()
        conn.close()

        return True
    except Exception as e:
        print(e)
        return False
    
def listarCompetidores(id_time):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        sql = """
            SELECT c.id, c.nome_competidor 
            FROM competidores c 
            WHERE c.timeId = %s;
        """
        cursor.execute(sql, (int(id_time),))
        data = cursor.fetchall()

        competidores = [{'id': row['id'], 'nome_competidor': row['nome_competidor']} for row in data]
        return competidores

    except Exception as e:
        print(f"Erro inesperado ao listar competidores: {e}")
        raise e

def atualizarCompetidores(id_comp, novo_nome):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        sql = "UPDATE competidores SET nome_competidor=%s WHERE id = %s;"

        cursor.execute(sql, (novo_nome, id_comp))
        conn.commit()
        conn.close()

        return True
    except Exception as e:
        print(e)
        return False

def deletarCompetidor(id_comp):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        sql = "DELETE FROM competidores WHERE id = %s;"

        cursor.execute(sql, (id_comp))
        conn.commit()
        conn.close()

        return True
    except Exception as e:
        print(e)
        return False