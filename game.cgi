#!/usr/bin/env python3

import cgi

import tntfl.constants as Constants
from tntfl.caching_game_store import CachingGameStore
from tntfl.hooks.addGame import do
from tntfl.ladder import TableFootballLadder
from tntfl.web import fail_400, getInt, getString, no_content_204

form = cgi.FieldStorage()
redPlayer = getString('redPlayer', form)
bluePlayer = getString('bluePlayer', form)
redScore = getInt('redScore', form)
blueScore = getInt('blueScore', form)
if redPlayer is not None and bluePlayer is not None and redScore is not None and blueScore is not None and redPlayer != bluePlayer:
    ladder = TableFootballLadder(Constants.ladderFilePath, games=[], postGameHooks=[do])
    ladder._gameStore = CachingGameStore(Constants.ladderFilePath)
    ladder.appendGame(redPlayer, redScore, bluePlayer, blueScore)
    no_content_204()
else:
    fail_400()
