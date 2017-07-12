#!/usr/bin/env python

import cgi
import json
from tntfl.skill_change import Elo
from tntfl.web import fail_400, fail_404, getFloat

form = cgi.FieldStorage()

player1Elo = getFloat('redElo', form)
player2Elo = getFloat('blueElo', form)
if player1Elo is not None and player2Elo is not None:
    try:
        elo = Elo()
        blueGoalRatio = {'blueGoalRatio': elo.getBlueGoalRatio(player1Elo, player2Elo)}
        print 'Content-Type: application/json'
        print
        print json.dumps(blueGoalRatio)
    except StopIteration:
        fail_404()
else:
    fail_400()
