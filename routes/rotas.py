from flask import Blueprint, render_template, request, redirect, jsonify, session
from database import Models
from services import UserServices as s
from services.UserServices import verifyPass
from services import MaratonaService as m
from services import TimesService as t
from services import CompetidoresService as cs
from Estruturas import ListaDEncadeada as le
from services import PartidasService as ps
import base64

rotas = Blueprint('rotas', __name__)

@rotas.route('/')
def login_page():
    return render_template('login.html')

icon = None
@rotas.route('/submit', methods=['POST'])
def submit():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    global icon
    user = Models.User(None, data['senha'], data['email'])
    user_dados = s.login(user.email, user.password)
    if user_dados is not None:
        session['user_id'] = user_dados['id']
        session['email'] = user_dados['email']
        session['username'] = user_dados['username']
        session['senha'] = user_dados['senha']
        icon = user_dados['icon']
        response = {
            'status': 'success'
        }
    else:
        response = {
            'status': 'error'
        }
    
    return jsonify(response)

@rotas.route('/create', methods=['POST'])
def create_user():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    user = Models.User(data['novoNome'], data['novaSenha'], data['novoEmail'])

    if(verifyPass(user.password)):
        if s.insertAccount(user.username, user.email, user.password):
            response = {
                "status":'success',
                "message": "created!"
            }
        else:
            response = {
                "status": "error",
                "message": "ERROR"
            }
    else:
        response = {
            "status": "wrongPass",
            "message": "Senha fora de Padrão"
        }

    return jsonify(response)

@rotas.route("/updateUser", methods=['PUT'])
def update_user():
    nome = request.form.get('Nome')
    email = request.form.get('Email')
    senha = request.form.get('Senha')

    image_blob = None
    if 'iconPerfil' in request.files:
        image_file = request.files['iconPerfil']
        if image_file.filename == '':
            image_file = None
        else:
            image_blob = image_file.read()
            global icon
            icon = base64.b64encode(image_blob).decode('utf-8')
    
    user_id = session.get('user_id')
    user = Models.User(nome, senha, email)

    
    if s.updateAccount(user_id, user.username, user.email, user.password, image_blob) == 'sucess':
        session['email'] = user.email
        session['username'] = user.username
        session['senha'] = user.password
        response = {
            "status": "success",
            "message": "Usuário Atualizado!"
        }
    elif s.updateAccount(user_id, user.username, user.email, user.password, image_blob) == 'passInvalid':
        response = {
            "status": "passInvalid",
            "message": "Senha fora de Padrão!"
        }
    else:
        response = {
            "status": "error",
            "message": "Erro ao atualizar usuário!"
        }
    
    return jsonify(response)

@rotas.route("/deleteUser", methods=['DELETE'])
def delete_user():
    user_id = session.get('user_id')

    if s.deleteAccount(user_id):
        response = {
            "status": "sucess",
            "message": "Usuário Deletado!"
        }
    else:
        response = {
            "status": "error",
            "message": "Erro ao deletar usuário"
        }
    
    session.clear()
    return jsonify(response)

@rotas.route("/user", methods=['GET'])
def return_userData():
    response = {
        'user_id': session.get('user_id'),
        'username': session.get('username'),
        'email': session.get('email'),
        'icon': icon
    }

    return jsonify(response)

@rotas.route('/home')
def home():
    return render_template('home.html')

@rotas.route('/createMarathon', methods=['POST'])
def create_marathon():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()

    user_id = session.get('user_id')

    if user_id is None:
        return jsonify({
            "status": "N/A",
            "message": "not authenticate"
        })
    
    maratona = Models.Marathon(
    data['nomeMaratona'],
    data['qtdTimes'],
    data['valor'],
    None
    )

    maratona_id = m.criarMaratona(
    maratona.name,
    data['Descricao'],
    maratona.numTeam,
    maratona.prize,
    user_id
    )

    if not maratona_id:
        return jsonify({
            "status": "error",
            "message": "Erro ao criar maratona."
        })

    ps.criar_partidas_maratona(maratona_id, maratona.numTeam)

    return jsonify({
        "status": "success",
        "message": "Maratona Criada!"
    })

@rotas.route("/maratonas", methods=['GET'])
def show_marathons():
    user_id = session.get('user_id')

    data = m.listarMaratonas(user_id)
    lista_maratonas = data.to_list()

    return jsonify(lista_maratonas)

@rotas.route("/updateMaratona", methods=['PUT'])
def update_marathon():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()

    maratona = Models.Marathon(data['nome_maratona'], data['qtdTimes'], data['premiacao'], None)
    if m.atualizarMaratona(data['id'], maratona.name, data['descricao'], maratona.numTeam, maratona.prize):
        response = {
            'status': 'success',
            'message': 'Maratona Atualizada!'
        }
    else:
        response = {
            'status': 'error',
            'message': 'Erro ao atualizar maratona!'
        }

    return jsonify(response)

@rotas.route("/deleteMaratona", methods=['DELETE'])
def delete_marathon():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    id = data['id']
    if m.deletarMaratona(id):
        response = {
            "status": "success",
            "message": "Maratona Deletada."
        }
    else:
        response = {
            "status": "error",
            "message": "Erro ao deletar."
        }
    
    return jsonify(response)

@rotas.route("/criarTime", methods=['POST'])
def create_team():
    nome_time = request.form.get('nomeTime')
    abreviacao = request.form.get('Abreviacao')
    id_maratona = request.form.get('idMaratona')
    icon_blob = None

    if 'escudoTime' in request.files:
        image_file = request.files['escudoTime']
        if image_file.filename == '':
            return jsonify(response = {"status": "error", "message":"Selecione uma imagem para Escudo do time!"}), 400
        else:
            icon_blob = image_file.read()
    
    time = Models.Team(None, nome_time, abreviacao, icon_blob, id_maratona)

    if t.criarTime(time.escudo, time.nome_time, time.abreviacao, time.maratonaId):
        response = {
            'status': 'success',
            'message': 'Time Criado!'
        }
    else:
        response = {
            'status': 'error',
            'message': 'Erro ao criar time!'
        }
    
    return response


@rotas.route("/getTimes", methods=['POST'])
def showTeams():
    id = request.form.get('maratona_id')

    data = t.listarTimes(id)
    lista_times = data.to_list()

    return jsonify(lista_times)

@rotas.route("/updateTime", methods=['PUT'])
def updateTeam():
    nome_time = request.form.get('NovoNomeTime')
    abreviacao = request.form.get('NovaAbreviacao')
    id_time = request.form.get("id")

    icon_blob = None

    if 'NovoEscudoTime' in request.files:
        image_file = request.files['NovoEscudoTime']
        if image_file.filename == '':
            image_file = None
        else:
            icon_blob = image_file.read()
    
    time = Models.Team(id_time, nome_time, abreviacao, icon_blob, None)

    if t.atualizarTime(time.id, time.nome_time, time.abreviacao, time.escudo):

        response = {
            "status": "success",
            "message": "Time Atualizado!"
        }
    else:
        response = {
            "status": "erro",
            "message": "Erro ao atualizar time!"
        }
    
    return jsonify(response)


@rotas.route("/deleteTime", methods=['DELETE'])
def deleteTeam():
    data = request.get_json()
    id_time = data.get('id')

    if not id_time:
        return jsonify({
            "status": "erro",
            "message": "ID inválido"
        })

    result = t.deletarTime(id_time)

    if result is True:
        return jsonify({
            "status": "success",
            "message": "Time deletado!"
        })
    else:
        return jsonify({
            "status": "erro",
            "message": "Não é possível excluir um time que participa de partidas."
        })

@rotas.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@rotas.route('/createCompetidor', methods=['POST'])
def create_Competidor():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()

    competidor = Models.Player(data['nomeJogador'], data['timeId'])
    
    if cs.inserirCompetidores(competidor.name, competidor.teamId):
        response = {
            "status": "success",
            "message": "Competidor criado!"
        }
    else:
        response = {
            "status": "error",
            "message": "Erro ao criar competidor."
        }

    return jsonify(response)


@rotas.route("/competidor", methods=['GET'])
def show_Competidor():
    time_id = request.args.get('time_id')

    if time_id is None:
        return jsonify({"error": "time_id não fornecido"}), 400

    data = cs.listarCompetidores(time_id)

    return jsonify(data)

@rotas.route("/updateCompetidor", methods=['PUT'])
def update_Competidor():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()

    competidor = Models.Player(data['nomeJogador'], data['timeId'])
    if cs.atualizarCompetidores(data['id'], competidor.name, competidor.teamId):
        response = {
            'status': 'success',
            'message': 'Competidor Atualizado!'
        }
    else:
        response = {
            'status': 'error',
            'message': 'Erro ao atualizar!'
        }

    return jsonify(response)

@rotas.route("/deleteCompetidor", methods=['DELETE'])
def delete_Competidor():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    id = data['id']
    if cs.deletarCompetidor(id):
        response = {
            "status": "success",
            "message": "Competidor Deletado!"
        }
    else:
        response = {
            "status": "error",
            "message": "Erro ao deletar."
        }
    
    return jsonify(response)


@rotas.route("/partida", methods=['GET'])
def show_Partida():
    maratona_id = request.args.get('maratona_id')

    if maratona_id is None:
        return jsonify({"error": "maratona_id não fornecido"}), 400

    data = ps.listarPartidas(maratona_id)
    if not data:
        return jsonify([])

    return jsonify(data["rodadas"])

@rotas.route("/updatePartida", methods=['PUT'])
def update_Partida():
    data = request.get_json() if request.content_type == 'application/json' else request.form.to_dict()

    # Use get() com valor padrão None
    partida = Models.Match(
        data.get('data_partida'),
        data.get('local_partida'),
        data.get('time1'),
        data.get('time2'),
        data.get('vencedor'),
        data.get('num_rodada'),
        data.get('posicao_rodada'),
        None
    )

    # Atualiza a partida no banco
    success = ps.atualizarPartida(
        data.get('id'),
        partida.date,
        partida.local,
        partida.blueTeam,
        partida.redTeam,
        partida.winner,
        partida.num_rodada,
        partida.posicao_rodada
    )

    if success:
        response = {'status': 'success', 'message': 'Partida Atualizada!'}
    else:
        response = {'status': 'error', 'message': 'Erro ao atualizar partida!'}

    return jsonify(response)

@rotas.route('/chavearRodada', methods=['PUT'])
def chavear_rodada():
    data = request.get_json()

    if not data or 'partidas' not in data:
        return jsonify({'status': 'error', 'message': 'Dados inválidos'}), 400

    try:
        ps.chavearRodada(data['partidas'])
        return jsonify({'status': 'success', 'message': 'Chaveamento Realizado!'})
    except Exception as e:
        print("Erro no chaveamento:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500