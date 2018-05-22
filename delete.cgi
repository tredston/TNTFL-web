#!/usr/bin/env python3

import cgi
import os

import tntfl.constants as Constants
from tntfl.hooks.deleteGame import do
from tntfl.ladder import TableFootballLadder
from tntfl.web import fail_404, getInt, fail_400, redirect_302, getString, no_content_204

form = cgi.FieldStorage()

gameTime = getInt('game', form)
redirect = getString('redirect', form)
if gameTime is not None:
    ladder = TableFootballLadder(Constants.ladderFilePath, postGameHooks=[do])
    deletedBy = os.environ["REMOTE_USER"] if "REMOTE_USER" in os.environ else "Unknown"
    deleted = ladder.deleteGame(gameTime, deletedBy)
    if deleted:
        if redirect:
            redirect_302(redirect)
        else:
            no_content_204()
    else:
        fail_404()
else:
    fail_400()
