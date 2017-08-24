#!/usr/bin/env python3

import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import getStatsJson
from tntfl.web import serve_template

base = '../'
ladder = TableFootballLadder(Constants.ladderFilePath)

serve_template("stats.html", lambda: getStatsJson(ladder, base))
