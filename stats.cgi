#!/usr/bin/env python

import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import getStatsJson
from tntfl.web import serve_template

base = '../'
ladder = TableFootballLadder(Constants.ladderFilePath)

serve_template("stats.mako", lambda: getStatsJson(ladder, base))
