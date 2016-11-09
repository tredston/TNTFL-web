#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import fail_404, fail_400, serve_template, getString


form = cgi.FieldStorage()

player = getString('player', form)
if player:
    ladder = TableFootballLadder(Constants.ladderFilePath)
    if player in ladder.players:
        player = ladder.getPlayer(player)
        method = getString('method', form)
        if method == "games":
            serve_template("playerGames.mako", pageTitle="%s's games" % player.name, games=player.games, ladder=ladder)
        elif method == 'perplayerstats':
            serve_template('perPlayerStats.mako', player=player, ladder=ladder)
        else:
            serve_template("player.mako", player=player, ladder=ladder)
    else:
        fail_404()
else:
    fail_400()
