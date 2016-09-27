import tntfl.transforms.elo as eloTransform
import tntfl.transforms.rank as rankTransform
import tntfl.transforms.achievement as achievementTransform
from tntfl.transforms.transform_wrapper import TransformWrapper


Transforms = {
    'elo': TransformWrapper(eloTransform.do, 'elo'),
    'rank': TransformWrapper(rankTransform.do, 'rank'),
    'achievement': TransformWrapper(achievementTransform.do, 'achievement'),
}


def transforms_for_full_games(ladderTime):
    transforms = [
        Transforms['elo'],
        Transforms['rank'],
    ]
    if ladderTime['now']:
        transforms.append(Transforms['achievement'])
    return transforms


def transforms_for_ladder():
    return [
        Transforms['elo'],
    ]
