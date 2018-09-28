class TransformWrapper(object):
    def __init__(self, transform, name):
        self._transform = transform
        self._name = name

    def getName(self):
        return self._name

    def transform(self, games):
        return self._transform(games)
