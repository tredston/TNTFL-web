from datetime import date, datetime, timedelta


def getNumYellowStripes(player, games):
    return len([g for g in games if (g.redPlayer == player.name and g.redScore == 10 and g.blueScore == 0) or (g.bluePlayer == player.name and g.blueScore == 10 and g.redScore == 0)])


def getSharedGames(player1, player2):
    return [g for g in player1.games if g.redPlayer == player2.name or g.bluePlayer == player2.name]


def punditryAvailable(pundit, game, ladder):
    red = ladder.getPlayer(game.redPlayer)
    blue = ladder.getPlayer(game.bluePlayer)
    return pundit.anyComment(red, game, blue)


def formatTime(inTime):
    time = datetime.fromtimestamp(float(inTime))
    dateStr = time.strftime("%Y-%m-%d %H:%M")
    if date.fromtimestamp(float(inTime)) == date.today():
        dateStr = "%02d:%02d" % (time.hour, time.minute)
    elif date.fromtimestamp(float(inTime)) > (date.today() - timedelta(7)):
        dateStr = "%s %02d:%02d" % (("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")[time.weekday()], time.hour, time.minute)
    return dateStr


def getRankCSS(rank, totalActivePlayers):
    ladderPositionCSS = "ladder-position"
    if rank == -1:
        ladderPositionCSS = ladderPositionCSS + " inactive"
    elif rank == 1:
        ladderPositionCSS = ladderPositionCSS + " ladder-first"
    elif rank <= totalActivePlayers * 0.1:
        ladderPositionCSS = ladderPositionCSS + " ladder-silver"
    elif rank <= totalActivePlayers * 0.3:
        ladderPositionCSS = ladderPositionCSS + " ladder-bronze"
    return ladderPositionCSS


def isPositionSwap(game):
    bluePosBefore = game.bluePosAfter + game.bluePosChange
    redPosBefore = game.redPosAfter + game.redPosChange
    positionSwap = False
    if bluePosBefore > 0 and redPosBefore > 0:
        if bluePosBefore == game.redPosAfter or redPosBefore == game.bluePosAfter:
            positionSwap = True
    return positionSwap


def playerHref(base, name):
    return base + 'player/' + name + '/json'


def gameToJson(game, base):
    asJson = {
        'red': {
            'name': game.redPlayer,
            'href': playerHref(base, game.redPlayer),
            'score': game.redScore,
            'skillChange': -game.skillChangeToBlue,
            'rankChange': game.redPosChange,
            'newRank': game.redPosAfter,
            'achievements': [{'name': a.name, 'description': a.description} for a in game.redAchievements],
        },
        'blue': {
            'name': game.bluePlayer,
            'href': playerHref(base, game.bluePlayer),
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


def ladderToJson(players, ladder, base, includePlayers):
    if includePlayers:
        return [{'rank': ladder.getPlayerRank(p.name), 'name': p.name, 'player': playerToJson(p, ladder)} for i, p in enumerate(players)]
    else:
        return [{'rank': i + 1, 'name': p.name, 'skill': p.elo, 'href': playerHref(base, p.name)} for i, p in enumerate(players)]


def playerToJson(player, ladder):
    return {
        'name': player.name,
        'rank': ladder.getPlayerRank(player.name),
        'active': ladder.isPlayerActive(player),
        'skill': player.elo,
        'overrated': player.overrated(),
        'total': {
            'for': player.goalsFor,
            'against': player.goalsAgainst,
            'games': len(player.games),
            'gamesAsRed': player.gamesAsRed,
            'wins': player.wins,
            'losses': player.losses,
            'gamesToday': player.gamesToday,
        },
        'games': {'href': 'games/json'},
    }
