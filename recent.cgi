#!/usr/bin/env python

import cgi
from tntfl.web import serve_template


form = cgi.FieldStorage()

ladderFilePath = "ladder.txt"
serve_template("recent.mako", ladderFilePath=ladderFilePath, base="", limit=form["limit"].value if "limit" in form else 10)
