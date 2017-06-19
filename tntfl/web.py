from __future__ import print_function
from builtins import str
import cgi
import json
import os


def serve_template(templatename, generate=None):
    print(get_template(templatename, generate))


def get_template(templatename, generate):
    form = cgi.FieldStorage()
    if form.getfirst("view") == "json":
        return 'Content-Type: application/json\n\n%s' % json.dumps(generate())
    else:
        template = os.path.join('dist', templatename)
        if os.path.exists(template):
            with open(template, 'r') as fh:
                return 'Content-Type: text/html\n\n%s' % fh.read()
        else:
            raise Exception('Missing HTML: %s' % template)


def redirect_302(redirectionTo):
    print("Status: 302 Found")
    print("Location: " + redirectionTo)
    print()


def fail_404():
    print("Status: 404 Not Found")
    print()


def fail_400():
    print("Status: 400 Bad Request")
    print()


def getString(key, form):
    value = form.getfirst(key)
    if value:
        value = str(value).lower()
    return value


def getInt(key, form, default=None):
    value = form.getfirst(key)
    value = int(value) if value else default
    return value


def getFloat(key, form, default=None):
    value = form.getfirst(key)
    value = float(value) if value else default
    return value
