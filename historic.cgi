#!/usr/bin/env python
import cgi
from tntfl.web import serve_template, getInt
from datetime import date

form = cgi.FieldStorage()

fromTime = getInt('gamesFrom', form)
toTime = getInt('gamesTo', form)
if fromTime is not None and toTime is not None:
    timeRange = (fromTime, toTime)
else:
    epoch = date.fromtimestamp(0)
    startdate = date.today().replace(day=1)
    enddate = startdate.replace(month=startdate.month + 1) if startdate.month < 12 else date(startdate.year + 1, 1, 1)
    start = (startdate - epoch).total_seconds()
    end = (enddate - epoch).total_seconds()
    timeRange = (start, end)
serve_template("historic.mako", timeRange=timeRange)
