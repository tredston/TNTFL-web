from tntfl.achievements import Achievements
from tntfl.game import Game

DAYS_INACTIVE = 60


class Player(object):
    def __init__(self, name):
        self.name = name
        self.elo = 0.0
        self.games = []
        self.lowestSkill = {"time": 0, "skill": 0}
        self.achievements = {}

        self._activeTillTime = 0

    def game(self, game):
        secondsInactive = 60 * 60 * 24 * DAYS_INACTIVE
        self._activeTillTime = game.time + secondsInactive

        if self.name == game.redPlayer:
            delta = -game.skillChangeToBlue
        else:
            delta = game.skillChangeToBlue
        self.elo += delta

        if (self.elo < self.lowestSkill["skill"]):
            self.lowestSkill = {"time": game.time, "skill": self.elo}

        self.games.append(game)

    def getSkillBounds(self):
        return {"lowest": self.lowestSkill}

    def wonGame(self, game):
        return (game.redPlayer == self.name and game.redScore > game.blueScore) or (game.bluePlayer == self.name and game.blueScore > game.redScore)

    def achieve(self, achievements, game):
        for achievement in achievements:
            if achievement in self.achievements.keys():
                self.achievements[achievement].append(game)
            else:
                self.achievements[achievement] = [game]


class TableFootballLadder:
    def __init__(self):
        self.games = []
        self.players = {}
        self.achievements = Achievements()
        self._recentlyActivePlayers = (-1, [])

    def addGame(self, game):
        self.games.append(game)
        red = self._getPlayer(game.redPlayer)
        blue = self._getPlayer(game.bluePlayer)
        red.game(game)
        blue.game(game)

        self.achievements.apply(red, game, blue, self)

    def _getActivePlayers(self, time):
        if self._recentlyActivePlayers[0] != time:
            self._recentlyActivePlayers = (time, [p for p in self.players.values() if (p._activeTillTime - time) > 0])
        return self._recentlyActivePlayers[1]

    def getNumActivePlayers(self, time):
        return len(self._getActivePlayers(time))

    def _getPlayer(self, name):
        if name not in self.players:
            self.players[name] = Player(name)
        return self.players[name]


def do(games):
    ladder = TableFootballLadder()
    for game in games:
        if not game.isDeleted():
            ladder.addGame(game)
    return games
