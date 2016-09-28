from tntfl.game import Game

DAYS_INACTIVE = 60


class Player(object):
    def __init__(self):
        self.elo = 0.0
        self.activeTillTime = 0


def getPlayer(players, name):
    if name not in players:
        players[name] = Player()
    return players[name]


def filterActivePlayers(players, time):
    return [p for p in players if (p.activeTillTime - time) > 0]


def do(games):
    players = {}
    activePlayers = []
    secondsInactive = 60 * 60 * 24 * DAYS_INACTIVE
    for game in games:
        if not game.isDeleted():
            red = getPlayer(players, game.redPlayer)
            blue = getPlayer(players, game.bluePlayer)

            activePlayers = filterActivePlayers(activePlayers, game.time - 1)
            activePlayers = sorted(activePlayers, key=lambda x: x.elo, reverse=True)

            redPosBefore = activePlayers.index(red) if red in activePlayers else -1
            bluePosBefore = activePlayers.index(blue) if blue in activePlayers else -1

            red.elo -= game.skillChangeToBlue
            blue.elo += game.skillChangeToBlue
            activeTillTime = game.time + secondsInactive
            red.activeTillTime = activeTillTime
            blue.activeTillTime = activeTillTime

            if red not in activePlayers:
                activePlayers.append(red)
            if blue not in activePlayers:
                activePlayers.append(blue)
            activePlayers = sorted(activePlayers, key=lambda x: x.elo, reverse=True)

            redPosAfter = activePlayers.index(red)
            bluePosAfter = activePlayers.index(blue)

            game.bluePosAfter = bluePosAfter + 1  # 0-indexed -> 1-indexed
            game.redPosAfter = redPosAfter + 1

            # It's this way around because a rise in position is to a lower numbered rank.
            game.bluePosChange = bluePosBefore - bluePosAfter if bluePosBefore >= 0 else 0
            game.redPosChange = redPosBefore - redPosAfter if redPosBefore >= 0 else 0
    return games
