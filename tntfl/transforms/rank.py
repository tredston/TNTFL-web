from tntfl.game import Game

DAYS_INACTIVE = 60


class Player(object):
    def __init__(self):
        self.elo = 0.0
        self.lastPlayed = 0


def getPlayer(players, name):
    if name not in players:
        players[name] = Player()
    return players[name]


def getActivePlayers(players, playedGames, time):
    return [p for p in players.values() if (time - p.lastPlayed) < 60 * 60 * 24 * DAYS_INACTIVE]


def do(games):
    players = {}
    playedGames = []
    for game in games:
        if not game.isDeleted():
            red = getPlayer(players, game.redPlayer)
            blue = getPlayer(players, game.bluePlayer)

            activePlayers = getActivePlayers(players, playedGames, game.time - 1)
            sortedPlayers = sorted(activePlayers, key=lambda x: x.elo, reverse=True)
            redPosBefore = sortedPlayers.index(red) if red in sortedPlayers else -1
            bluePosBefore = sortedPlayers.index(blue) if blue in sortedPlayers else -1

            red.elo -= game.skillChangeToBlue
            blue.elo += game.skillChangeToBlue
            red.lastPlayed = game.time
            blue.lastPlayed = game.time

            if red not in activePlayers:
                activePlayers.append(red)
            if blue not in activePlayers:
                activePlayers.append(blue)
            sortedPlayers = sorted(activePlayers, key=lambda x: x.elo, reverse=True)
            redPosAfter = sortedPlayers.index(red)
            bluePosAfter = sortedPlayers.index(blue)

            game.bluePosAfter = bluePosAfter + 1  # 0-indexed -> 1-indexed
            game.redPosAfter = redPosAfter + 1

            # It's this way around because a rise in position is to a lower numbered rank.
            game.bluePosChange = bluePosBefore - bluePosAfter if bluePosBefore >= 0 else 0
            game.redPosChange = redPosBefore - redPosAfter if redPosBefore >= 0 else 0

            playedGames.append(game)
    return games
