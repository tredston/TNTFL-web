#!/usr/bin/env python

import cgi
from tntfl.web import serve_template


form = cgi.FieldStorage()

serve_template("recent.mako", base="", limit=form["limit"].value if "limit" in form else 10)
