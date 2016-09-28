from tntfl.game import Game


class Player(object):
    def __init__(self):
        self.elo = 0.0


def calculateSkillChange(red, blue, redScore, blueScore):
    predict = 1 / (1 + 10 ** ((red.elo - blue.elo) / 180))
    result = float(blueScore) / (blueScore + redScore)
    delta = 25 * (result - predict)
    red.elo -= delta
    blue.elo += delta
    return delta


def getPlayer(players, name):
    if name not in players:
        players[name] = Player()
    return players[name]


def do(games):
    players = {}
    for game in games:
        if not game.isDeleted():
            red = getPlayer(players, game.redPlayer)
            blue = getPlayer(players, game.bluePlayer)

            skillChangeToBlue = calculateSkillChange(red, blue, game.redScore, game.blueScore)
            game.skillChangeToBlue = skillChangeToBlue
    return games
