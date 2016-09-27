<%!
from tntfl.ladder import TableFootballLadder
import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
base = "../"
%>
<%inherit file="json.mako" />[
<%
ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=timeRange, transforms=PresetTransforms.transforms_for_ladder())
players = [p for p in ladder.getPlayers() if ladder.isPlayerActive(p) ]
%>
%for player in players:
{
  "rank" : ${loop.index + 1},
  "name" : "${player.name}",
  "skill" : ${player.elo},
  "href" : "${self.attr.base}player/${player.name | u}/json"
}${"," if loop.index < len(players) - 1 else ""}
%endfor
]
