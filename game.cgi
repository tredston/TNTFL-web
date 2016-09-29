#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import redirect_302, fail_404, serve_template, getInt, getString

form = cgi.FieldStorage()

ladder = TableFootballLadder(Constants.ladderFilePath)
if getString('method', form) == "add":
    redPlayer = getString('redPlayer', form)
    bluePlayer = getString('bluePlayer', form)
    redScore = getInt('redScore', form)
    blueScore = getInt('blueScore', form)
    if redPlayer and bluePlayer and redScore and blueScore:
        ladder.appendGame(redPlayer, redScore, bluePlayer, blueScore)
        # Invalidated, regenerate
        ladder = TableFootballLadder(Constants.ladderFilePath)
        if getString('view', form) == 'json':
            serve_template("wrappedGame.mako", game=game, ladder=ladder)
        else:
            redirect_302("../%.0f" % game.time)
elif getString('method', form) == 'view':
    gameTime = getInt('game', form)
    if gameTime is not None:
        try:
            game = next(g for g in ladder.games if g.time == gameTime)
            serve_template("wrappedGame.mako", game=game, ladder=ladder)
        except StopIteration:
            fail_404()
