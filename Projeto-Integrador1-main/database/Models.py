import datetime as dt
import re

class User:
    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email

#classe da maratona
class Marathon:
    def __init__(self, name, numTeam, prize, matches):
        self.name = name
        self.numTeam = int(numTeam)
        self.prize = float(prize)
        self.matches = matches #fazer uma calculadora pra cá dps.

#classe da partida
class Match:
    def __init__(self, date, local, blueTeam, redTeam, winner, num_rodada, posicao_rodada, idMarathon):
        self.date = date
        self.local = local
        self.blueTeam = blueTeam
        self.redTeam = redTeam
        self.winner = winner
        self.num_rodada = num_rodada
        self.posicao_rodada = posicao_rodada
        self.idMarathon = idMarathon
    
    def __lt__(self, other):
        # None vem depois
        if self.date is None:
            return False
        if other.date is None:
            return True
        return self.date < other.date

    def __eq__(self, other):
        return self.date == other.date
        

#classe dos times
class Team:
    def __init__(self, id, nome_time, abreviacao, escudo, maratonaId):
        self.id = id
        self.nome_time = nome_time
        self.escudo = escudo
        self.abreviacao = abreviacao
        self.maratonaId = maratonaId

class Player:
    def __init__(self, name, teamId):
        self.name = name
        self.teamId = teamId
        

class Team_le:
    def __init__(self, TId, name, shield, nick, teamMates):
        self.TId = TId
        self.name = name
        self.shield = shield
        self.nick = nick
        self.teamMates = teamMates

class Player_le:
    def __init__(self, PId, name, teamId):
        self.PId = PId
        self.name = name
        self.teamId = teamId

class Marathon_le:
    def __init__(self, MId, name, desc, numTeam, prize, matches):
        self.name = name
        self.MId = MId
        self.desc = desc
        self.numTeam = int(numTeam)
        self.prize = float(prize)
        self.matches = matches