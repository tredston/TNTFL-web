from collections import OrderedDict
from datetime import date, datetime, timedelta
from tntfl.player import PerPlayerStat
from tntfl.achievements import Achievement


def getTrend(player):
    trend = []
    games = player.games[-10:] if len(player.games) >= 10 else player.games
    skill = 0
    for i, game in enumerate(games):
        skill += game.skillChangeToBlue if game.bluePlayer == player.name else -game.skillChangeToBlue
        trend.append([i, skill])
    if len(trend) > 0:
        trendColour = "#0000FF" if trend[0][1] < trend[len(games) - 1][1] else "#FF0000"
    else:
        trendColour = "#000000"
    return {'trend': trend, 'colour': trendColour}


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


def getTrendWithDates(player):
    trend = []
    games = player.games[-10:] if len(player.games) >= 10 else player.games
    skill = 0
    for i, game in enumerate(games):
        skill += game.skillChangeToBlue if game.bluePlayer == player.name else -game.skillChangeToBlue
        trend.append((game.time, skill))
    return trend


def ladderToJson(players, ladder, base, includePlayers):
    if includePlayers:
        return [{
            'rank': ladder.getPlayerRank(p.name),
            'name': p.name,
            'player': playerToJson(p, ladder),
            'trend': getTrendWithDates(p),
        } for i, p in enumerate(players)]
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


def getPerPlayerStats(player):
    pps = {}
    for game in player.games:
        if game.redPlayer == player.name:
            if game.bluePlayer not in pps:
                pps[game.bluePlayer] = PerPlayerStat(game.bluePlayer)
            pps[game.bluePlayer].append(game.redScore, game.blueScore, -game.skillChangeToBlue)
        elif game.bluePlayer == player.name:
            if game.redPlayer not in pps:
                pps[game.redPlayer] = PerPlayerStat(game.redPlayer)
            pps[game.redPlayer].append(game.blueScore, game.redScore, game.skillChangeToBlue)
    return pps


def perPlayerStatsToJson(stats):
    return [{
        'opponent': opponent,
        'skillChange': stats[opponent].skillChange,
        'for': stats[opponent].goalsFor,
        'against': stats[opponent].goalsAgainst,
        'games': stats[opponent].games,
        'wins': stats[opponent].wins,
        'losses': stats[opponent].losses,
    } for opponent in stats.keys()]


def getPlayerAchievementsJson(player):
    achievements = [{
        'name': a.name,
        'description': a.description,
        'time': player.achievements[a]
    } for a in player.achievements.keys()]
    [achievements.append({
        'name': clz.name,
        'description': clz.description,
    }) for clz in Achievement.__subclasses__() if clz not in player.achievements.keys()]
    return achievements


def appendChristmas(links, base):
    if datetime.now().month == 12:
        links.append('<link href="%scss/christmas.css" rel="stylesheet">' % base)
    return links


def getGamesPerDay(ladder):
    gamesPerDay = OrderedDict()
    for game in ladder.games:
        day = date.fromtimestamp(game.time).strftime('%s')
        if day not in gamesPerDay:
            gamesPerDay[day] = 0
        gamesPerDay[day] += 1
    plotData = []
    for day, tally in gamesPerDay.iteritems():
        plotData.append([day, tally])
    return plotData


def getStatsJson(ladder, base):
    winningStreak = ladder.getStreaks()['win']
    mostSignificantGames = sorted([g for g in ladder.games if not g.isDeleted()], key=lambda x: abs(x.skillChangeToBlue), reverse=True)
    return {
        'totals': {
            'games': len(ladder.games),
            'players': len(ladder.players),
            'activePlayers': ladder.getNumActivePlayers(),
            'achievements': [[{
                'name': a.name,
                'description': a.description,
            }, c] for a, c in sorted(ladder.getAchievements().iteritems(), reverse=True, key=lambda t: t[1])],
        },
        'records': {
            'winningStreak': {
                'player': winningStreak['player'].name,
                'count': winningStreak['streak'].count,
            },
            'mostSignificant': [gameToJson(g, base) for g in mostSignificantGames[0:5]],
            'leastSignificant': [gameToJson(g, base) for g in reversed(mostSignificantGames[-5:])],
        },
        'gamesPerDay': getGamesPerDay(ladder),
    }
