def transform(baseGameLoader, transforms):
    games = baseGameLoader()

    for t in transforms:
        games = t.transform(games)

    return games
