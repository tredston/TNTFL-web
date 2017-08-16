#!/usr/bin/env python

import cgi
from time import time

import tntfl.constants as Constants
import tntfl.transforms.transformer as Transformer
import tntfl.transforms.transforms as PresetTransforms
from tntfl.game import Game
from tntfl.game_store import GameStore
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import ladderToJson, gameToJson
from tntfl.web import serve_template, getInt


def deserialise(serialisedGames):
    gameParts = serialisedGames.split(',')
    games = []
    now = time()
    numGames = len(gameParts) / 4
    for i in range(0, numGames):
        g = Game(gameParts[4 * i].lower(), gameParts[4 * i + 1], gameParts[4 * i + 3].lower(), gameParts[4 * i + 2], now - (numGames - i))
        games.append(g)
    return games


def getLadder():
    transforms = PresetTransforms.transforms_for_recent()
    games = Transformer.transform(lambda: GameStore(Constants.ladderFilePath).getGames(), transforms, False)

    if len(speculativeGames) > 0:
        games += speculativeGames
        games = Transformer.transform(lambda: games, transforms, False)

    return TableFootballLadder(None, games=games)


base = '../'
form = cgi.FieldStorage()
showInactive = getInt('showInactive', form, 0)
includePlayers = getInt('players', form, 0)

speculativeGames = deserialise(form.getfirst('previousGames', ''))

ladder = getLadder()
speculatedGames = ladder.games[-len(speculativeGames):] if len(speculativeGames) > 0 else []

serve_template('speculate.html', lambda: {
    'entries': ladderToJson(ladder, base, showInactive, includePlayers),
    'games': [gameToJson(game, base) for game in speculatedGames],
})
