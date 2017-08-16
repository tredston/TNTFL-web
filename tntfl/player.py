from datetime import date


class Streak(object):
    def __init__(self):
        self.win = True
        self.gameTimes = []

    def _getTime(self, i):
        return self.gameTimes[i] if self.count > 0 else 0

    @property
    def count(self):
        return len(self.gameTimes)

    @property
    def fromDate(self):
        return self._getTime(0)

    @property
    def toDate(self):
        return self._getTime(-1)


class Player(object):
    __slots__ = 'name', 'elo', 'games', 'wins', 'losses', 'goalsFor', 'goalsAgainst', 'gamesAsRed', 'achievements'

    def __init__(self, name):
        self.name = name
        self.elo = 0.0
        self.games = []
        self.wins = 0
        self.losses = 0
        self.goalsFor = 0
        self.goalsAgainst = 0
        self.gamesAsRed = 0
        self.achievements = {}

    def playGame(self, game):
        if self.name == game.redPlayer:
            self.elo -= game.skillChangeToBlue
            self.gamesAsRed += 1
            if game.redScore > game.blueScore:
                self.wins += 1
            elif game.redScore < game.blueScore:
                self.losses += 1
            self.goalsFor += game.redScore
            self.goalsAgainst += game.blueScore
        else:
            self.elo += game.skillChangeToBlue
            if game.redScore < game.blueScore:
                self.wins += 1
            elif game.redScore > game.blueScore:
                self.losses += 1
            self.goalsFor += game.blueScore
            self.goalsAgainst += game.redScore
        self.games.append(game)

    def getSkillBounds(self):
        elo = 0.0
        highestSkill = (0, 0)  # (time, skill)
        lowestSkill = (0, 0)
        for game in self.games:
            elo += game.skillChangeToBlue if self.name == game.bluePlayer else -game.skillChangeToBlue
            if elo > highestSkill[1]:
                highestSkill = (game.time, elo)
            elif elo < lowestSkill[1]:
                lowestSkill = (game.time, elo)
        return {
            'highest': {'time': highestSkill[0], 'skill': highestSkill[1]},
            'lowest': {'time': lowestSkill[0], 'skill': lowestSkill[1]},
        }

    @property
    def gamesToday(self):
        today = date.today()
        return self.gamesOn(today)

    def gamesOn(self, date):
        return len([g for g in self.games if g.timeAsDate() == date])

    def achieve(self, achievements, game):
        if achievements is not None:
            for achievement in achievements:
                self.achievements[achievement] = game.time

    def wonGame(self, game):
        return (game.redPlayer == self.name and game.redScore > game.blueScore) or (game.bluePlayer == self.name and game.blueScore > game.redScore)

    def lostGame(self, game):
        return (game.redPlayer == self.name and game.redScore < game.blueScore) or (game.bluePlayer == self.name and game.blueScore < game.redScore)

    def getAllStreaks(self, games):
        streaks = []
        currentStreak = Streak()

        for game in games:
            wonGame = self.wonGame(game)
            lostGame = self.lostGame(game)

            if (wonGame and currentStreak.win) or (lostGame and not currentStreak.win):
                currentStreak.gameTimes.append(game.time)
            else:
                # end of streak
                if currentStreak.count >= 1:
                    streaks.append(currentStreak)
                    currentStreak = Streak()
                if wonGame or lostGame:
                    currentStreak.gameTimes.append(game.time)
                currentStreak.win = wonGame
        return {'past': streaks, 'current': currentStreak}

    def getStreaks(self):
        def getLongestStreak(pastStreaks, check):
            streak = Streak()
            try:
                streak = next(s for s in pastStreaks if check(s))
            except StopIteration:
                pass
            return streak

        streaks = self.getAllStreaks(self.games)
        pastStreaks = sorted(streaks['past'], key=lambda s: s.count, reverse=True)
        currentStreakType = "(last game was a draw)" if streaks['current'].count == 0 else "wins" if streaks['current'].win else "losses"
        return {
            'win': getLongestStreak(pastStreaks, lambda s: s.win),
            'lose': getLongestStreak(pastStreaks, lambda s: not s.win),
            'current': streaks['current'],
            'currentType': currentStreakType,
        }


class PerPlayerStat(object):
    def __init__(self, opponent):
        self.opponent = opponent
        self.games = 0
        self.goalsFor = 0
        self.goalsAgainst = 0
        self.skillChange = 0
        self.wins = 0
        self.losses = 0
        self.draws = 0

    def append(self, goalsFor, goalsAgainst, skillChange):
        self.games += 1
        self.goalsFor += goalsFor
        self.goalsAgainst += goalsAgainst
        self.skillChange += skillChange
        if goalsFor > goalsAgainst:
            self.wins += 1
        elif goalsFor < goalsAgainst:
            self.losses += 1
        else:
            self.draws += 1
