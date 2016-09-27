<%page args="ladderFilePath, base, limit=10"/>
<%namespace name="blocks" file="blocks.mako" />
<%!
from tntfl.ladder import TableFootballLadder
import tntfl.transforms.transforms as PresetTransforms
%>
<%
  ladder = TableFootballLadder(ladderFilePath)
  recentGames = [l for l in ladder.games if not l.isDeleted()][-limit:]
  recentGames.reverse()
%>
<div class="container-fluid">
    ${blocks.render("gameList", ladder=ladder, games=recentGames, base=base)}
</div>
