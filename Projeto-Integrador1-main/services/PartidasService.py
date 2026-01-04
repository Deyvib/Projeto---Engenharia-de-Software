from database import conexao as c
from Estruturas import ArvoreBinaria as ar
from database import Models as m
import pymysql
    
def criar_partidas_maratona(maratona_id, qtd_times):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        import math
        total_rodadas = int(math.log2(qtd_times))

        for num_rodada in range(total_rodadas):

            num_partidas = 2 ** num_rodada

            for posicao in range(num_partidas):
                sql = """
                    INSERT INTO partidas
                    (data_partida, local_partida, time1, time2, vencedor,
                     num_rodada, posicao_rodada, maratonaId)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """

                cursor.execute(sql, (
                    None,       # data_partida
                    None,       # local_partida
                    None,       # time1
                    None,       # time2
                    None,       # vencedor
                    num_rodada, # num_rodada (0 = final)
                    posicao,    # posição na rodada
                    maratona_id
                ))

        conn.commit()
        conn.close()
        return True

    except Exception as e:
        print("Erro ao criar partidas:", e)
        return False


def atualizarPartida(id, nova_data, novo_local, novo_time1, novo_time2, novo_vencedor, num_rodada=None, posicao_rodada=None):
    try:
        conn = c.openBD()
        cursor = conn.cursor()

        sql = """
            UPDATE partidas
            SET data_partida=%s,
                local_partida=%s,
                time1=%s,
                time2=%s,
                vencedor=%s
        """
        params = [nova_data, novo_local, novo_time1, novo_time2, novo_vencedor]

        if num_rodada is not None:
            sql += ", num_rodada=%s"
            params.append(num_rodada)
        if posicao_rodada is not None:
            sql += ", posicao_rodada=%s"
            params.append(posicao_rodada)

        sql += " WHERE id=%s;"
        params.append(id)

        cursor.execute(sql, tuple(params))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(e)
        return False

def listarPartidas(id_maratona):
    try:
        conn = c.openBD()
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        cursor.execute("""
        SELECT
            p.*,

            t1.id   AS time1_id,
            t1.nome_time AS time1_nome,
            t1.abreviacao AS time1_abreviacao,

            t2.id   AS time2_id,
            t2.nome_time AS time2_nome,
            t2.abreviacao AS time2_abreviacao

        FROM partidas p
        LEFT JOIN times t1 ON t1.id = p.time1
        LEFT JOIN times t2 ON t2.id = p.time2
        WHERE p.maratonaId = %s
        ORDER BY p.num_rodada ASC, p.posicao_rodada ASC
        """, (id_maratona,))

        dados = cursor.fetchall()
        conn.close()

        if not dados:
            return {
                "arvore": ar.ArvoreBinaria(),
                "rodadas": []
            }

        arvore = ar.ArvoreBinaria()
        max_rodada = max(d['num_rodada'] for d in dados)
        rodadas = [[] for _ in range(max_rodada + 1)]

        for d in dados:
            # mantém a árvore binária
            partida = m.Match(
                d['data_partida'],
                d['local_partida'],
                d['time1'],
                d['time2'],
                d['vencedor'],
                d['num_rodada'],
                d['posicao_rodada'],
                d['maratonaId']
            )
            arvore.inserir(partida)

            # estrutura EXATA que o front já usa
            rodadas[d['num_rodada']].append({
                "id": d['id'],
                "data_partida": d['data_partida'],
                "local_partida": d['local_partida'],
                "times": [
                    {"id": d['time1']} if d['time1'] else {"id": None},
                    {"id": d['time2']} if d['time2'] else {"id": None}
                ],
                "vencedor": d['vencedor'],
                "maratonaId": d['maratonaId']
            })

        return {
            "arvore": arvore,
            "rodadas": rodadas
        }

    except Exception as e:
        print(e)
        return None
    
def chavearRodada(partidas):
    """
    partidas = [
        { 'id': 1, 'time1': 3, 'time2': 7 },
        { 'id': 2, 'time1': 5, 'time2': 12 }
    ]
    """

    conn = c.openBD()
    cursor = conn.cursor()

    try:
        conn.begin()
        times_usados = set()

        for p in partidas:
            if not p.get('id'):
                raise Exception("Partida sem ID")

            for campo in ('time1', 'time2'):
                tid = p.get(campo)
                if tid:
                    if tid in times_usados:
                        raise Exception("Time duplicado no chaveamento")
                    times_usados.add(tid)

        for p in partidas:
            cursor.execute("""
                UPDATE partidas
                SET time1 = %s,
                    time2 = %s
                WHERE id = %s
                  AND vencedor IS NULL
            """, (
                p.get('time1'),
                p.get('time2'),
                p.get('id')
            ))

        conn.commit()

    except Exception as e:
        conn.rollback()
        raise e

    finally:
        cursor.close()
        conn.close()