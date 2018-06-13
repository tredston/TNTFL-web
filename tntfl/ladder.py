import time
from collections import Counter

import tntfl.transforms.transforms as PresetTransforms
from tntfl import constants
from tntfl.caching_game_store import CachingGameStore
from tntfl.player import Player, Streak


class TableFootballLadder(object):
    def __init__(self, ladderFilePath, timeRange=None, transforms=None, games=None, postGameHooks=[]):
        self.games = []
        self.players = {}
        self._recentlyActivePlayers = (-1, [])

        self._ladderTime = {'now': timeRange is None, 'range': timeRange}
        self._theTime = time.time()
        self.postGameHooks = postGameHooks

        self._gameStore = None
        if games is None:
            self._gameStore = CachingGameStore(ladderFilePath)
            transforms = PresetTransforms.transforms_for_full_games(self._ladderTime) if transforms is None else transforms
            games = self._gameStore.loadGames(self._ladderTime, transforms)
        withAchievements = 'achievement' in [t.getName() for t in transforms] if transforms is not None else True
        self._loadGamesIntoLadder(games, withAchievements)

    def _loadGamesIntoLadder(self, games, withAchievements):
        self.games = games
        for game in [g for g in self.games if not g.isDeleted()]:
            red = self.getPlayer(game.redPlayer)
            blue = self.getPlayer(game.bluePlayer)
            blue.playGame(game)
            red.playGame(game)
            if withAchievements:
                red.achieve(game.redAchievements, game)
                blue.achieve(game.blueAchievements, game)

    def getPlayer(self, name):
        if name not in self.players:
            self.players[name] = Player(name)
        return self.players[name]

    def _getActivePlayers(self, atTime=None):
        if atTime is None:
            atTime = self._getTime()
        if self._recentlyActivePlayers[0] != atTime:
            self._recentlyActivePlayers = (atTime, [p for p in list(self.players.values()) if self.isPlayerActive(p, atTime)])
        return self._recentlyActivePlayers[1]

    def getNumActivePlayers(self, atTime=None):
        return len(self._getActivePlayers(atTime))

    def _getMostRecentGame(self, player, atTime):
        for game in reversed(player.games):
            if game.time <= atTime:
                return game
        return None

    def isPlayerActive(self, player, atTime=None):
        if atTime is None:
            atTime = self._getTime()
        game = self._getMostRecentGame(player, atTime)
        return (atTime - game.time) < (60 * 60 * 24 * constants.DAYS_INACTIVE) if game else False

    def getPlayerActivity(self, player, atTime=None):
        secondsInactive = 60 * 60 * 24 * constants.DAYS_INACTIVE
        if atTime is None:
            atTime = self._getTime()
        game = self._getMostRecentGame(player, atTime)
        return max(secondsInactive - (atTime - game.time), 0) / secondsInactive if game else 0

    def _getTime(self):
        if self._ladderTime['now']:
            return self._theTime
        else:
            return self._ladderTime['range'][1]

    def getStreaks(self):
        def maxStreak(streak, best, player):
            if streak.count > best['streak'].count:
                best['player'] = player
                best['streak'] = streak

        winning = {'player': None, 'streak': Streak()}
        losing = {'player': None, 'streak': Streak()}
        for player in list(self.players.values()):
            streaks = player.getStreaks()
            maxStreak(streaks['win'], winning, player)
            maxStreak(streaks['lose'], losing, player)
        return {'win': winning, 'lose': losing}

    def getRankedPlayers(self):
        return sorted([p for p in list(self.players.values())], key=lambda x: x.elo, reverse=True)

    def getPlayerRank(self, playerName):
        ranked = [p.name for p in self.getRankedPlayers() if self.isPlayerActive(p)]
        if playerName in ranked:
            return ranked.index(playerName) + 1
        return -1

    def getAchievements(self):
        achievements = Counter()
        for player in list(self.players.values()):
            for ach in list(player.achievements.keys()):
                achievements[ach] += 1
        return achievements
