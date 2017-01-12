from datetime import date


class Game(object):

    def __init__(self, redPlayer, redScore, bluePlayer, blueScore, time):
        self.redPlayer = redPlayer
        self.redScore = int(redScore)
        self.redPosChange = 0
        self.redPosAfter = -1
        self.bluePlayer = bluePlayer
        self.blueScore = int(blueScore)
        self.bluePosChange = 0
        self.bluePosAfter = -1
        self.time = int(time)
        self.redAchievements = []
        self.blueAchievements = []
        self.skillChangeToBlue = 0
        self.deletedBy = None
        self.deletedAt = 0

    def isDeleted(self):
        return self.deletedAt > 0

    def timeAsDate(self):
        return date.fromtimestamp(self.time)
