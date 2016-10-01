<%page args="base, limit=10, ladder=None, games=None"/>
<%namespace name="blocks" file="blocks.mako" />
<%!
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
import tntfl.transforms.transforms as PresetTransforms
%>
<%
    if ladder is None:
        ladder = TableFootballLadder(Constants.ladderFilePath)
    if games is None:
        games = ladder.games
    recentGames = [l for l in games if not l.isDeleted()][-limit:]
    recentGames.reverse()
%>
<div class="container-fluid">
    ${blocks.render("components/gameList", ladder=ladder, games=recentGames, base=base)}
</div>
