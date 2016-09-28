#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.web import serve_template

form = cgi.FieldStorage()

serve_template(
    "games.mako",
    ladder=TableFootballLadder(Constants.ladderFilePath),
    fromTime=int(form.getfirst('from')) if "from" in form else None,
    toTime=int(form["to"].value) if "to" in form else None,
    limit=int(form['limit'].value) if "limit" in form else None,
    includeDeleted=int(form.getfirst('includeDeleted', 0))
)
