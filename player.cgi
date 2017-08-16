#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import gameToJson, perPlayerStatsToJson, getPerPlayerStats, getPlayerAchievementsJson, \
    playerToJson
from tntfl.web import fail_404, fail_400, serve_template, getString

base = "../../../"

form = cgi.FieldStorage()

player = getString('player', form)
if player:
    ladder = TableFootballLadder(Constants.ladderFilePath)
    if player in ladder.players:
        player = ladder.getPlayer(player)
        method = getString('method', form)
        if method == "games":
            serve_template("playergames.html", lambda: [gameToJson(game, base) for game in player.games])
        elif method == 'perplayerstats':
            serve_template('', lambda: perPlayerStatsToJson(getPerPlayerStats(player)))
        elif method == 'achievements':
            serve_template('', lambda: getPlayerAchievementsJson(player))
        else:
            serve_template("player.html", lambda: playerToJson(player, ladder))
    else:
        fail_404()
else:
    fail_400()
