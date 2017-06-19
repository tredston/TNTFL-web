from builtins import range
from builtins import object
from collections import Counter, defaultdict
import datetime
import os.path
import abc
from future.utils import with_metaclass


class Achievement(with_metaclass(abc.ABCMeta, object)):
    @abc.abstractproperty
    def name(self):
        pass

    @abc.abstractproperty
    def description(self):
        pass

    @abc.abstractmethod
    def applies(self, player, game, opponent, ladder):
        pass


class FirstGame(Achievement):
    name = "First Game"
    description = "Enter your first game into the ladder"

    def applies(self, player, game, opponent, ladder):
        return len(player.games) == 1 and player.games[0] == game


class FreshBlood(Achievement):
    name = "Fresh Blood"
    description = "Claim points from a new player on their first game"

    def applies(self, player, game, opponent, ladder):
        if game.redPlayer == player.name:
            return game.skillChangeToBlue < 0 and len(opponent.games) == 1
        else:
            return game.skillChangeToBlue > 0 and len(opponent.games) == 1


class FlawlessVictory(Achievement):
    name = "Flawless Victory"
    description = "Beat an opponent 10-0"

    def applies(self, player, game, opponent, ladder):
        if game.redPlayer == player.name:
            return game.redScore == 10 and game.blueScore == 0
        else:
            return game.redScore == 0 and game.blueScore == 10


class MostlyHarmless(Achievement):
    name = "Mostly Harmless"
    description = "Play 100 games"

    def applies(self, player, game, opponent, ladder):
        return len(player.games) == 100


class CommittedCoreFiler(Achievement):
    name = "Committed CoreFiler"
    description = "Play 500 games"

    def applies(self, player, game, opponent, ladder):
        return len(player.games) == 500


class Dangerous(Achievement):
    name = "Dangerous"
    description = "Play 1,000 games"

    def applies(self, player, game, opponent, ladder):
        return len(player.games) == 1000


class Resident(Achievement):
    name = "Resident"
    description = "Play 2,000 games"

    def applies(self, player, game, opponent, ladder):
        return len(player.games) == 2000


class Elite(Achievement):
    name = "Elite"
    description = "Play 10,000 games"

    def applies(self, player, game, opponent, ladder):
        return len(player.games) == 10000


class AgainstTheOdds(Achievement):
    name = "Against The Odds"
    description = "Beat a player 50 or more skillpoints higher than you"

    def applies(self, player, game, opponent, ladder):
        if game.redPlayer == player.name:
            return (game.redScore > game.blueScore) and (player.elo + game.skillChangeToBlue) + 50 <= (opponent.elo - game.skillChangeToBlue)
        else:
            return (game.blueScore > game.redScore) and (player.elo - game.skillChangeToBlue) + 50 <= (opponent.elo + game.skillChangeToBlue)


class AgainstAllOdds(Achievement):
    name = "Against All Odds"
    description = "Beat a player 100 or more skillpoints higher than you"

    def applies(self, player, game, opponent, ladder):
        if game.redPlayer == player.name:
            return (game.redScore > game.blueScore) and (player.elo + game.skillChangeToBlue) + 100 <= (opponent.elo - game.skillChangeToBlue)
        else:
            return (game.blueScore > game.redScore) and (player.elo - game.skillChangeToBlue) + 100 <= (opponent.elo + game.skillChangeToBlue)


class TheBest(Achievement):
    name = "The Best"
    description = "Go first in the rankings"

    def applies(self, player, game, opponent, ladder):
        rank = game.bluePosAfter if player.name == game.bluePlayer else game.redPosAfter
        return rank == 1


class TheWorst(Achievement):
    name = "The Worst"
    description = "Go last in the rankings"

    def applies(self, player, game, opponent, ladder):
        rank = game.bluePosAfter if player.name == game.bluePlayer else game.redPosAfter
        return rank == ladder.getNumActivePlayers(game.time)


class Improver(Achievement):
    name = "Improver"
    description = "Gain 100 skill points from your lowest point"

    def applies(self, player, game, opponent, ladder):
        threshold = player.getSkillBounds()['lowest']["skill"] + 100
        delta = game.skillChangeToBlue if player.name == game.bluePlayer else -game.skillChangeToBlue
        return player.elo >= threshold and player.elo - delta < threshold


class Unstable(Achievement):
    name = "Unstable"
    description = "See-saw 5 or more skill points in consecutive games"

    def getSkillChange(self, player, game):
        return game.skillChangeToBlue if player.name == game.bluePlayer else -game.skillChangeToBlue

    def applies(self, player, game, opponent, ladder):
        result = False
        if len(player.games) > 1:
            previousDelta = self.getSkillChange(player, player.games[-2])
            delta = self.getSkillChange(player, game)
            if (previousDelta <= -5 and delta >= 5) or (previousDelta >= 5 and delta <= -5):
                result = True
        return result


class UpUpAndAway(Achievement):
    name = "Up Up And Away"
    description = "Gain points for 8 consecutive games"

    def __init__(self):
        self.count = Counter()

    def applies(self, player, game, opponent, ladder):
        delta = game.skillChangeToBlue if player.name == game.bluePlayer else -game.skillChangeToBlue
        if delta > 0:
            self.count[player.name] += 1
        else:
            self.count[player.name] = 0

        return self.count[player.name] > 0 and self.count[player.name] % 8 == 0


class Comrades(Achievement):
    name = "Comrades"
    description = "Play 100 games against the same opponent"

    def __init__(self):
        self.pairCounts = Counter()

    def applies(self, player, game, opponent, ladder):
        pair = frozenset([player.name, opponent.name])
        self.pairCounts[pair] += 1
        # Each game is counted twice with player/opponent switched, hence need to trigger on 199 and 200
        return 199 <= self.pairCounts[pair] <= 200


class FestiveCheer(Achievement):
    name = "Festive Cheer"
    description = "Play a game on 25th December"

    def applies(self, player, game, opponent, ladder):
        d = datetime.datetime.fromtimestamp(game.time)
        return d.month == 12 and d.day == 25


class NightOwl(Achievement):
    name = "Night Owl"
    description = "Play a game between 0000 and 0300 hours"

    def applies(self, player, game, opponent, ladder):
        d = datetime.datetime.fromtimestamp(game.time)
        return d.hour < 3 or (d.hour == 3 and d.minutes == 0 and d.seconds == 0 and d.microseconds == 0)


class Deviant(Achievement):
    name = "Deviant"
    description = "Play a game where != 10 goals are scored"

    def applies(self, player, game, opponent, ladder):
        return game.redScore + game.blueScore != 10


class Dedication(Achievement):
    name = "Dedication"
    description = "Play a game at least once every 60 days for a year"
    sixtyDays = 60 * 60 * 24 * 60
    oneYear = 60 * 60 * 24 * 365

    def __init__(self):
        self.streaks = {}

    def applies(self, player, game, opponent, ladder):
        if player.name in self.streaks:
            streak = self.streaks[player.name]
            if game.time - streak[1] <= self.sixtyDays:
                if game.time - streak[0] >= self.oneYear:
                    return True
                else:
                    self.streaks[player.name] = (streak[0], game.time)
                    return False

        self.streaks[player.name] = (game.time, game.time)
        return False


class EarlyBird(Achievement):
    name = "Early Bird"
    description = "Play and win the first game of the day"

    def applies(self, player, game, opponent, ladder):
        if player.wonGame(game):
            prevGame = self._getMostRecentGame(game, ladder)
            if prevGame:
                prevGame = self._toDate(prevGame.time)
                thisGame = self._toDate(game.time)
                return thisGame != prevGame
            return True
        return False

    def _getMostRecentGame(self, curGame, ladder):
        for i in range(len(ladder.games) - 2, 0, -1):
            game = ladder.games[i]
            if not game.isDeleted():
                return game
        return None

    def _toDate(self, time):
        return datetime.datetime.fromtimestamp(time).date()


class PokeMaster(Achievement):
    name = "PokeMaster"
    description = "Collect all the scores"

    def __init__(self):
        self.pokedexes = defaultdict(set)

    def applies(self, player, game, opponent, ladder):
        if game.redScore + game.blueScore != 10:
            return False
        score = game.blueScore if player.name == game.bluePlayer else game.redScore
        pokedex = self.pokedexes[player.name]
        pokedex.add(score)
        return len(pokedex) == 11


class TheDominator(Achievement):
    name = "The Dominator"
    description = "Defeat and obtain points from a player in 10 consecutive games"

    def __init__(self):
        super(TheDominator, self).__init__()
        self.counts = Counter()

    def applies(self, player, game, opponent, ladder):
        pairing = (player.name, opponent.name)
        playerIsBlue = player.name == game.bluePlayer
        won = player.wonGame(game)
        points = game.skillChangeToBlue > 0 if playerIsBlue else game.skillChangeToBlue < 0
        if won and points:
            self.counts[pairing] += 1
        else:
            self.counts[pairing] = 0
        return self.counts[pairing] > 0 and self.counts[pairing] % 10 == 0


class NothingIfNotConsistent(Achievement):
    name = "Nothing If Not Consistent"
    description = "Finish 5 consecutive games with the same score"

    def __init__(self):
        super(NothingIfNotConsistent, self).__init__()
        self.counts = defaultdict(list)

    def applies(self, player, game, opponent, ladder):
        score = (game.blueScore, game.redScore) if player.name == game.bluePlayer else (game.redScore, game.blueScore)
        counts = self.counts[player.name]
        if counts and counts[0] == score:
            counts.append(score)
            if len(counts) == 5:
                self.counts[player.name] = []
                return True
        else:
            self.counts[player.name] = [score]

        return False


class BossFight(Achievement):
    """
    Achievement that can be won by beating the player whose name is contained in ~/boss.txt.
    """
    name = "Boss Fight"
    description = "Defeat the Final Boss"

    def __init__(self):
        super(BossFight, self).__init__()
        self.boss = None
        if os.path.isfile("boss.txt"):
            with open("boss.txt", "r") as f:
                self.boss = f.readline().strip()

    def applies(self, player, game, opponent, ladder):
        if self.boss is not None:
            won = game.blueScore > game.redScore if player.name == game.bluePlayer else game.redScore > game.blueScore
            return self.boss and self.boss == opponent.name and won
        return False
