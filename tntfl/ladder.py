import os
import time
from tntfl.achievements import Achievements
from tntfl.player import Player, Streak
from tntfl.caching_game_store import CachingGameStore
from tntfl.game import Game
from tntfl.skill_change import Elo
import tntfl.transforms.transforms as PresetTransforms


class TableFootballLadder(object):

    # Number of days inactivity after which players are considered inactive
    DAYS_INACTIVE = 60

    def __init__(self, ladderFilePath, useCache=True, timeRange=None, transforms=None):
        self.games = []
        self.players = {}
        self.achievements = Achievements()
        self._skillChange = Elo()
        self._recentlyActivePlayers = (-1, [])

        self._ladderTime = {'now': timeRange is None, 'range': timeRange}
        self._theTime = time.time()

        self._gameStore = CachingGameStore(ladderFilePath, useCache)
        transforms = PresetTransforms.transforms_for_full_games(self._ladderTime) if transforms is None else transforms
        self._loadGamesIntoLadder(self._gameStore.loadGames(self._ladderTime, transforms))

    def _loadGamesIntoLadder(self, games):
        self.games = games
        for game in [g for g in self.games if not g.isDeleted()]:
            red = self.getPlayer(game.redPlayer)
            blue = self.getPlayer(game.bluePlayer)
            blue.game(game)
            red.game(game)
            red.achieve(game.redAchievements, game)
            blue.achieve(game.blueAchievements, game)

    def getPlayer(self, name):
        if name not in self.players:
            self.players[name] = Player(name)
        return self.players[name]

    def addGame(self, game):
        self.games.append(game)

        if game.isDeleted():
            return

        red = self.getPlayer(game.redPlayer)
        blue = self.getPlayer(game.bluePlayer)

        self._skillChange.apply(red, game, blue)

        activePlayers = {p.name: p for p in self._getActivePlayers(game.time - 1)}
        before = activePlayers.values()
        before = sorted(before, key=lambda x: x.elo, reverse=True)
        redPosBefore = before.index(red) if red in before else -1
        bluePosBefore = before.index(blue) if blue in before else -1

        blue.game(game)
        red.game(game)

        activePlayers[red.name] = red
        activePlayers[blue.name] = blue
        self._recentlyActivePlayers = (game.time, activePlayers.values())
        after = activePlayers.values()

        after = sorted(after, key=lambda x: x.elo, reverse=True)
        redPosAfter = after.index(red)
        bluePosAfter = after.index(blue)

        game.bluePosAfter = bluePosAfter + 1  # because it's zero-indexed here
        game.redPosAfter = redPosAfter + 1

        game.bluePosChange = bluePosBefore - bluePosAfter  # It's this way around because a rise in position is to a lower numbered rank.
        game.redPosChange = redPosBefore - redPosAfter

        if self._ladderTime['now']:
            self.achievements.apply(red, game, blue, self)


    # returns blue's goal ratio
    def predict(self, red, blue):
        return self._skillChange.getBlueGoalRatio(red, blue)

    def _getActivePlayers(self, atTime=None):
        if atTime is None:
            atTime = self._getTime()
        if self._recentlyActivePlayers[0] != atTime:
            self._recentlyActivePlayers = (atTime, [p for p in self.players.values() if self.isPlayerActive(p, atTime)])
        return self._recentlyActivePlayers[1]

    def getNumActivePlayers(self, atTime=None):
        return len(self._getActivePlayers(atTime))

    def isPlayerActive(self, player, atTime=None):
        if atTime is None:
            atTime = self._getTime()
        for game in reversed(player.games):
            if game.time <= atTime:
                return (atTime - game.time) < (60 * 60 * 24 * self.DAYS_INACTIVE)
        return False

    def _getTime(self):
        if self._ladderTime['now']:
            return self._theTime
        else:
            return self._ladderTime['range'][1]

    def getSkillBounds(self):
        highSkill = {'player': None, 'skill': 0, 'time': 0}
        lowSkill = {'player': None, 'skill': 0, 'time': 0}
        for player in self.players.values():
            skill = player.getSkillBounds()
            if skill['highest']['skill'] > highSkill['skill']:
                highSkill['player'] = player
                highSkill['skill'] = skill['highest']['skill']
                highSkill['time'] = skill['highest']['time']
            if skill['lowest']['skill'] < lowSkill['skill']:
                lowSkill['player'] = player
                lowSkill['skill'] = skill['lowest']['skill']
                lowSkill['time'] = skill['lowest']['time']
        return {'highest': highSkill, 'lowest': lowSkill}

    def getStreaks(self):
        winning = {'player': None, 'streak': Streak()}
        losing = {'player': None, 'streak': Streak()}
        for player in self.players.values():
            streaks = player.getStreaks()
            if streaks['win'].count > winning['streak'].count:
                winning['player'] = player
                winning['streak'] = streaks['win']
            if streaks['lose'].count > losing['streak'].count:
                losing['player'] = player
                losing['streak'] = streaks['lose']
        return {'win': winning, 'lose': losing}

    def addAndWriteGame(self, redPlayer, redScore, bluePlayer, blueScore):
        game = None
        redScore = int(redScore)
        blueScore = int(blueScore)
        if redScore >= 0 and blueScore >= 0 and (redScore + blueScore) > 0:
            game = Game(redPlayer, redScore, bluePlayer, blueScore, int(time.time()))
            self.addGame(game)
            self._gameStore.appendGame(game)
        return game

    def deleteGame(self, gameTime, deletedBy):
        return self._gameStore.deleteGame(gameTime, deletedBy)

    def getPlayers(self):
        return sorted([p for p in self.players.values()], key=lambda x: x.elo, reverse=True)

    def getPlayerRank(self, playerName):
        ranked = [p.name for p in self.getPlayers() if self.isPlayerActive(p)]
        if playerName in ranked:
            return ranked.index(playerName) + 1
        return -1

    def getAchievements(self):
        achievements = {}
        for ach in self.achievements.achievements:
            achievements[ach.__class__] = 0

        for player in self.players.values():
            for name, games in player.achievements.iteritems():
                achievements[name] += len(games)
        return achievements
