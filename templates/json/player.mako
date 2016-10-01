<%!
import json
base = '../'


def toJson(player, ladder):
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
            'wins': player.wins,
            'losses': player.losses,
            'gamesToday': player.gamesToday,
        },
        'games': {'href': 'games/json'},
    }
%>
<%inherit file='json.mako' />
${json.dumps(toJson(player, ladder))}
