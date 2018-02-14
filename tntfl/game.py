from datetime import date


class Game(object):
    __slots__ = 'redPlayer', 'redScore', 'bluePlayer', 'blueScore', 'time', 'skillChangeToBlue', 'redSkillAfter', 'blueSkillAfter', 'redPosChange', 'redPosAfter', 'bluePosChange', 'bluePosAfter', 'redAchievements', 'blueAchievements', 'deletedBy', 'deletedAt'

    def __init__(self, redPlayer, redScore, bluePlayer, blueScore, time):
        self.redPlayer = redPlayer
        self.redScore = int(redScore)
        self.bluePlayer = bluePlayer
        self.blueScore = int(blueScore)
        self.time = int(time)
        self.skillChangeToBlue = 0
        self.redSkillAfter = 0
        self.blueSkillAfter = 0
        self.redPosChange = None
        self.redPosAfter = None
        self.bluePosChange = None
        self.bluePosAfter = None
        self.redAchievements = None
        self.blueAchievements = None
        self.deletedBy = None
        self.deletedAt = None

    def isDeleted(self):
        return self.deletedAt is not None

    def timeAsDate(self):
        return date.fromtimestamp(self.time)
