from builtins import object
from operator import itemgetter

DAYS_INACTIVE = 60


class Player(object):
    def __init__(self):
        self.lastGameTime = None
        self.hasBelt = False


def getPlayer(players, name):
    if name not in players:
        players[name] = Player()
    return players[name]


def isFirstGame(players, time):
    for player in list(players.values()):
        if player.hasBelt:
            isInactive = time - player.lastGameTime > (60 * 60 * 24 * DAYS_INACTIVE)
            if isInactive:
                player.hasBelt = False
            return isInactive
    return True


def do(games):
    players = {}
    beltGames = []
    for game in [g for g in games if not g.isDeleted()]:
        red = getPlayer(players, game.redPlayer)
        blue = getPlayer(players, game.bluePlayer)
        red.lastGameTime = game.time
        blue.lastGameTime = game.time

        firstGame = isFirstGame(players, game.time)

        wonBelt = None
        if game.blueScore > game.redScore and (red.hasBelt or firstGame):
            red.hasBelt = False
            blue.hasBelt = True
            wonBelt = 'blue'
        if game.redScore > game.blueScore and (blue.hasBelt or firstGame):
            blue.hasBelt = False
            red.hasBelt = True
            wonBelt = 'red'

        beltGames.append({
            'game': game,
            'freeBelt': firstGame,
            'wonBelt': wonBelt,
        })

    return beltGames


def getBeltHistory(beltGames):
    binned = []
    cur = None
    for beltGame in beltGames:
        game, wonBelt = itemgetter('game', 'wonBelt')(beltGame)
        if wonBelt is not None or cur is None:
            if cur is not None:
                binned.append(cur)
            winner = game.redPlayer if wonBelt == 'red' else game.bluePlayer
            cur = [winner, 0]
        if cur[0] == game.redPlayer or cur[0] == game.bluePlayer:
            cur[1] += 1
    binned.append(cur)
    return binned
