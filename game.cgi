#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import redirect_302, fail_404, serve_template

form = cgi.FieldStorage()

ladder = TableFootballLadder(Constants.ladderFilePath)
if form.getfirst('method') == "add":
    redPlayer = form.getfirst('redPlayer')
    bluePlayer = form.getfirst('bluePlayer')
    redScore = form.getfirst('redScore')
    blueScore = form.getfirst('blueScore')
    if redPlayer and bluePlayer and redScore and blueScore:
        ladder.addAndWriteGame(redPlayer, redScore, bluePlayer, blueScore)
        if form.getfirst('view') == 'json':
            serve_template("wrappedGame.mako", game=game, ladder=ladder)
        else:
            redirect_302("../%.0f" % game.time)
elif form.getfirst('method') == 'view':
    gameTime = int(form.getfirst('game'))
    if gameTime is not None:
        try:
            game = next(g for g in ladder.games if g.time == gameTime)
            serve_template("wrappedGame.mako", game=game, ladder=ladder)
        except StopIteration:
            fail_404()
