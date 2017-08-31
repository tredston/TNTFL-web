import abc


class SkillChange(metaclass=abc.ABCMeta):
    @abc.abstractproperty
    def getBlueGoalRatio(self, red, blue):
        pass

    @abc.abstractproperty
    def apply(self, red, game, blue):
        pass


class Elo(SkillChange):
    def getBlueGoalRatio(self, redElo, blueElo):
        return 1 / (1 + 10 ** ((redElo - blueElo) / 180))

    def apply(self, red, game, blue):
        predict = self.getBlueGoalRatio(red.elo, blue.elo)
        result = float(game.blueScore) / (game.blueScore + game.redScore)
        delta = 25 * (result - predict)
        game.skillChangeToBlue = delta
