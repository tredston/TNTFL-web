#!/usr/bin/env python

import cgi
from tntfl.web import serve_template, getInt

form = cgi.FieldStorage()


def getTimeRange(form):
    timeRange = None
    fromTime = getInt('gamesFrom', form)
    toTime = getInt('gamesTo', form)
    if fromTime and toTime:
        timeRange = (fromTime, toTime)
    return timeRange


serve_template(
    "ladder.mako",
    timeRange=getTimeRange(form),
    base="",
    sortCol=getInt('sortCol', form),
    sortOrder=getInt('sortOrder', form),
    showInactive=getInt('showInactive', form, 0),
)
