from datetime import date


class Game(object):

    def __init__(self, redPlayer, redScore, bluePlayer, blueScore, time):
        self.redPlayer = redPlayer
        self.redScore = int(redScore)
        self.bluePlayer = bluePlayer
        self.blueScore = int(blueScore)
        self.time = int(time)
        self.skillChangeToBlue = 0
        self.redPosChange = None
        self.redPosAfter = None
        self.bluePosChange = None
        self.bluePosAfter = None
        self.redAchievements = None
        self.blueAchievements = None
        self.deletedBy = None
        self.deletedAt = None

    def isDeleted(self):
        return self.deletedAt > None

    def timeAsDate(self):
        return date.fromtimestamp(self.time)
