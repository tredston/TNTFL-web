#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import fail_404, serve_template


form = cgi.FieldStorage()

player = form.getfirst('player')
if player:
    ladder = TableFootballLadder(Constants.ladderFilePath)
    player = player.lower()
    if player in ladder.players:
        player = ladder.getPlayer(player)
        if form.getfirst('method') == "games":
            serve_template("playerGames.mako", pageTitle="%s's games" % player.name, games=player.games, ladder=ladder)
        else:
            serve_template("player.mako", player=player, ladder=ladder)
    else:
        fail_404()
