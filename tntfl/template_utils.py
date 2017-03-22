from collections import OrderedDict
from datetime import datetime
from tntfl.player import PerPlayerStat
from tntfl.achievements import Achievement


def getSharedGames(player1, player2):
    return [g for g in player1.games if g.redPlayer == player2.name or g.bluePlayer == player2.name]


def isPositionSwap(game):
    if game.bluePosAfter is not None and game.bluePosChange is not None and game.redPosAfter is not None and game.redPosChange is not None:
        return (game.bluePosAfter + game.bluePosChange == game.redPosAfter or game.redPosAfter + game.redPosChange == game.bluePosAfter)
    return None


def playerHref(base, name):
    return base + 'player/' + name + '/json'


def achievementsToJson(achievements):
    return [{'name': a.name, 'description': a.description} for a in achievements] if achievements is not None else []


def gameToJson(game, base):
    asJson = {
        'red': {
            'name': game.redPlayer,
            'href': playerHref(base, game.redPlayer),
            'score': game.redScore,
            'skillChange': -game.skillChangeToBlue,
            'rankChange': game.redPosChange,
            'newRank': game.redPosAfter,
            'achievements': achievementsToJson(game.redAchievements),
        },
        'blue': {
            'name': game.bluePlayer,
            'href': playerHref(base, game.bluePlayer),
            'score': game.blueScore,
            'skillChange': game.skillChangeToBlue,
            'rankChange': game.bluePosChange,
            'newRank': game.bluePosAfter,
            'achievements': achievementsToJson(game.blueAchievements),
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
    games = player.games[-min(len(player.games), 10):]
    skill = 0
    for game in games:
        skill += game.skillChangeToBlue if game.bluePlayer == player.name else -game.skillChangeToBlue
        trend.append((game.time, skill))
    return trend


def ladderToJson(ladder, base, showInactive, includePlayers):
    players = ladder.getPlayers() if showInactive else [p for p in ladder.getPlayers() if ladder.isPlayerActive(p)]
    if includePlayers:
        ranked = [p.name for p in ladder.getPlayers() if ladder.isPlayerActive(p)]
        return [{
            'player': playerLiteToJson(p, ranked),
            'trend': getTrendWithDates(p),
        } for p in players]
    else:
        return [{'rank': i + 1, 'name': p.name, 'skill': p.elo, 'href': playerHref(base, p.name)} for i, p in enumerate(players)]


def playerLiteToJson(player, ranked):
    rank = ranked.index(player.name) + 1 if player.name in ranked else -1
    return {
        'name': player.name,
        'rank': rank,
        'active': rank is not -1,
        'skill': player.elo,
        'total': {
            'for': player.goalsFor,
            'against': player.goalsAgainst,
            'games': len(player.games),
            'wins': player.wins,
            'losses': player.losses,
        },
        'games': {'href': 'games/json'},
    }


def playerToJson(player, ladder):
    ranked = [p.name for p in ladder.getPlayers() if ladder.isPlayerActive(p)]
    content = playerLiteToJson(player, ranked)
    content['total']['gamesAsRed'] = player.gamesAsRed
    content['total']['gamesToday'] = player.gamesToday
    return content


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


def getGamesPerDay(games):
    if len(games) == 0:
        return []
    gamesPerDay = [[games[0].timeAsDate().strftime('%s'), 0]]
    for game in games:
        day = game.timeAsDate().strftime('%s')
        if gamesPerDay[-1][0] != day:
            gamesPerDay.append([day, 0])
        gamesPerDay[-1][1] += 1
    return gamesPerDay


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
        'gamesPerDay': getGamesPerDay(ladder.games),
    }
