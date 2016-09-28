#!/usr/bin/env python

import cgi
from tntfl.web import serve_template

form = cgi.FieldStorage()


def getTimeRange(form):
    timeRange = None
    if "gamesFrom" in form and "gamesTo" in form:
        fromTime = int(form["gamesFrom"].value)
        toTime = int(form["gamesTo"].value)
        timeRange = (fromTime, toTime)
    return timeRange


serve_template(
    "ladder.mako",
    timeRange=getTimeRange(form),
    base="",
    sortCol=form.getfirst('sortCol'),
    sortOrder=form.getfirst('sortOrder'),
    showInactive=form.getfirst('showInactive', 0),
)
