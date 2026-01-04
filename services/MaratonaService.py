from database import conexao as c
from database import Models as mod
from Estruturas import ListaDEncadeada as le

def criarMaratona(nome, descricao, qtdTimes, premiacao, userId):
    try:

        conn = c.openBD()
        cursor = conn.cursor()

        sql = """
        INSERT INTO maratona (nome_maratona, descricao, qtdTimes, premiacao, userId)
        VALUES (%s, %s, %s, %s, %s);
        """
        cursor.execute(sql, (nome, descricao, qtdTimes, premiacao, userId))
        maratona_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return maratona_id
    except Exception as e:
        print(e)
        return False

def atualizarMaratona(id, nome, descricao, qtdTimes, premiacao):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        cursor.execute(f"UPDATE maratona SET nome_maratona='{nome}', descricao='{descricao}', qtdTimes='{qtdTimes}', premiacao='{premiacao}' WHERE id = {id}")
        conn.commit()
        conn.close()

        return True
    except Exception as e:
        print(e)
        return False


def listarMaratonas(user_id):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        cursor.execute(f"SELECT m.id, m.nome_maratona, m.descricao, m.qtdTimes, m.premiacao FROM maratona m INNER JOIN usuario u ON m.userId = u.id WHERE u.id = {user_id};")
        data = cursor.fetchall()

        lista = le.ListaDuplamenteEncadeada()

        for i in data:
            marat = mod.Marathon_le(i['id'], i['nome_maratona'], i['descricao'], i['qtdTimes'], i['premiacao'], None)
            lista.inserir_inicio(marat)

        return lista
    except Exception as e:
        print(e)
        return []
    
def deletarMaratona(id):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        cursor.execute(f"DELETE FROM maratona WHERE id = {id}")
        conn.commit()
        conn.close()

        return True
    except Exception as e:
        print(e)
        return False

#criarMaratona('maratona_Teste', 'muito legal', 8, '100', 7)