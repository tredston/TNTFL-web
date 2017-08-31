def transform(baseGameLoader, transforms, useCache):
    for t in transforms:
        t.setUseCache(useCache)

    games = None
    transformsToRun = []
    for t in reversed(transforms):
        games = t.loadCached()
        if games:
            break
        else:
            transformsToRun.append(t)

    if games is None:
        games = baseGameLoader()

    for t in reversed(transformsToRun):
        games = t.transform(games)

    return games
