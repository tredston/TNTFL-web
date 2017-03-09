import cgi

from mako.lookup import TemplateLookup
from mako import exceptions

tl = TemplateLookup(directories=['templates'])


def serve_template(templatename, **kwargs):
    print get_template(templatename, **kwargs)


def get_template(templatename, **kwargs):
    form = cgi.FieldStorage()
    if form.getfirst("view") == "json":
        template = "json/" + templatename
    else:
        template = templatename
    try:
        mytemplate = tl.get_template(template)
        return mytemplate.render(**kwargs)
    except:
        return exceptions.text_error_template().render()


def redirect_302(redirectionTo):
    print "Status: 302 Found"
    print "Location: " + redirectionTo
    print


def fail_404():
    print "Status: 404 Not Found"
    print


def fail_400():
    print "Status: 400 Bad Request"
    print


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
