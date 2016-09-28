#!/usr/bin/env python

import cgi
from tntfl.web import serve_template, getInt


form = cgi.FieldStorage()

serve_template("recent.mako", base="", limit=getInt('limit', form, 10))
