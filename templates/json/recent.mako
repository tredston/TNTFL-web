<%!
base = "../"
from tntfl.ladder import TableFootballLadder
import tntfl.transforms.transforms as PresetTransforms
%>
<%inherit file="json.mako" />[
<%
  ladder = TableFootballLadder(ladderFilePath, transforms=PresetTransforms.transforms_for_recent())
  recentGames = [l for l in ladder.games if not l.isDeleted()][-limit:]
  recentGames.reverse()
%>
% for game in recentGames:
    ${self.blocks.render("game", game=game, base=self.attr.base)}${"," if loop.index < len(recentGames) - 1 else ""}
% endfor
]
