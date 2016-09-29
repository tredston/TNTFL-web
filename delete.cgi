#!/usr/bin/env python

import cgi
import os
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import redirect_302, fail_404, serve_template, getInt, getString

form = cgi.FieldStorage()


ladder = TableFootballLadder(Constants.ladderFilePath)

gameTime = getInt('game', form)
if gameTime is not None:
    if getString('deleteConfirm', form) == "true":
        deletedBy = os.environ["REMOTE_USER"] if "REMOTE_USER" in os.environ else "Unknown"
        deleted = ladder.deleteGame(gameTime, deletedBy)
        if deleted:
            redirect_302("./")
        else:
            fail_404()
    else:
        try:
            game = next(g for g in ladder.games if g.time == gameTime)
            serve_template("deleteGame.mako", ladder=ladder, game=game)
        except StopIteration:
            fail_404()
else:
    fail_404()
