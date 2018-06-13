def no_content_204():
    print("Status: 204 No Content")
    print()


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
