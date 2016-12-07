from tntfl.achievements import Achievements
from tntfl.game import Game

# DAYS_INACTIVE = 60
secondsInactive = 60 * 60 * 24 * 60


class Player(object):
    def __init__(self, name, achievements):
        self.name = name
        self.elo = 0.0
        self.games = []
        self.lowestSkill = 0
        self.achievements = {}
        self.unachieved = achievements

        self._activeTillTime = 0

    def game(self, game):
        self._activeTillTime = game.time + secondsInactive

        self.elo += game.skillChangeToBlue if self.name == game.bluePlayer else -game.skillChangeToBlue
        if self.elo < self.lowestSkill:
            self.lowestSkill = self.elo

        self.games.append(game)

    def getSkillBounds(self):
        return {"lowest": {'skill': self.lowestSkill}}

    def wonGame(self, game):
        return (game.redPlayer == self.name and game.redScore > game.blueScore) or (game.bluePlayer == self.name and game.blueScore > game.redScore)

    def achieve(self, achievements, game):
        for achievement in achievements:
            self.achievements[achievement] = game
            for a in self.unachieved:
                if a.__class__ == achievement:
                    self.unachieved.remove(a)


class TableFootballLadder:
    def __init__(self):
        self.games = []
        self.players = {}
        self.achievements = Achievements()
        self._recentlyActivePlayers = []

    def addGame(self, game):
        self.games.append(game)
        red = self._getPlayer(game.redPlayer)
        blue = self._getPlayer(game.bluePlayer)
        red.game(game)
        blue.game(game)

        self._updateActive(red, blue, game.time)

        self.achievements.apply(red, game, blue, self)

    def _updateActive(self, red, blue, time):
        if red not in self._recentlyActivePlayers:
            self._recentlyActivePlayers.append(red)
        if blue not in self._recentlyActivePlayers:
            self._recentlyActivePlayers.append(blue)
        self._recentlyActivePlayers = [p for p in self._recentlyActivePlayers if (p._activeTillTime - time) > 0]

    def getNumActivePlayers(self, time):
        return len(self._recentlyActivePlayers)

    def _getPlayer(self, name):
        if name not in self.players:
            self.players[name] = Player(name, list(self.achievements.allAchievements))
        return self.players[name]


def do(games):
    ladder = TableFootballLadder()
    for game in games:
        if not game.isDeleted():
            ladder.addGame(game)
    return games
