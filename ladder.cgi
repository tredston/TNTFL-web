#!/usr/bin/env python

import cgi
from tntfl.web import serve_template


form = cgi.FieldStorage()

ladderFilePath = "ladder.txt"
timeRange = None
if "gamesFrom" in form and "gamesTo" in form:
    fromTime = int(form["gamesFrom"].value)
    toTime = int(form["gamesTo"].value)
    timeRange=(fromTime, toTime)
serve_template("ladder.mako", ladderFilePath=ladderFilePath, timeRange=timeRange, base="",
               sortCol=form['sortCol'].value if "sortCol" in form else None,
               sortOrder=form["sortOrder"].value if "sortOrder" in form else None,
               showInactive=form["showInactive"].value if "showInactive" in form else 0)
