#!/usr/bin/env python

import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import serve_template

serve_template("index.mako")
