<%page args='base, game'/>
<%!
import json


def isPositionSwap(game):
    bluePosBefore = game.bluePosAfter + game.bluePosChange
    redPosBefore = game.redPosAfter + game.redPosChange
    positionSwap = False
    if bluePosBefore > 0 and redPosBefore > 0:
        if bluePosBefore == game.redPosAfter or redPosBefore == game.bluePosAfter:
            positionSwap = True
    return positionSwap


def toJson(game, base):
    asJson = {
        'red': {
            'name': game.redPlayer,
            'href': base + 'player/' + game.redPlayer + '/json',
            'score': game.redScore,
            'skillChange': -game.skillChangeToBlue,
            'rankChange': game.redPosChange,
            'newRank': game.redPosAfter,
            'achievements': [{'name': a.name, 'description': a.description} for a in game.redAchievements],
        },
        'blue': {
            'name': game.bluePlayer,
            'href': base + 'player/' + game.bluePlayer + '/json',
            'score': game.blueScore,
            'skillChange': game.skillChangeToBlue,
            'rankChange': game.bluePosChange,
            'newRank': game.bluePosAfter,
            'achievements': [{'name': a.name, 'description': a.description} for a in game.blueAchievements],
        },
        'positionSwap': isPositionSwap(game),
        'date': game.time,
    }
    if game.isDeleted():
        asJson['deleted'] = {
            'at': game.deletedAt,
            'by': game.deletedBy
        }
    return asJson
%>
${json.dumps(toJson(game, base))}
