import abc


class SkillChange(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def getBlueGoalRatio(self, red, blue):
        pass

    @abc.abstractproperty
    def apply(self, red, game, blue):
        pass


class Elo(SkillChange):
    def getBlueGoalRatio(self, red, blue):
        return 1 / (1 + 10 ** ((red.elo - blue.elo) / 180))

    def apply(self, red, game, blue):
        predict = self.getBlueGoalRatio(red, blue)
        result = float(game.blueScore) / (game.blueScore + game.redScore)
        delta = 25 * (result - predict)
        game.skillChangeToBlue = delta
