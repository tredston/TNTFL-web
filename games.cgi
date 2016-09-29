#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import serve_template, getInt

form = cgi.FieldStorage()

serve_template(
    "games.mako",
    ladder=TableFootballLadder(Constants.ladderFilePath),
    fromTime=getInt('from', form),
    toTime=getInt('to', form),
    limit=getInt('limit', form),
    includeDeleted=getInt('includeDeleted', form, 0),
)
