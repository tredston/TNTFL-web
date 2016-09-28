#!/usr/bin/env python

import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import serve_template


ladder = TableFootballLadder(Constants.ladderFilePath)
serve_template("stats.mako", ladder=ladder)
