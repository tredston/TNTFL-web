<%page args="ladder, base, games, speculative=False"/>
<%namespace name="blocks" file="blocks.mako" />
<%!
from tntfl.pundit import Pundit
import tntfl.template_utils as utils
%>
<%
  pundit = Pundit()
%>
<div class="table-responsive">
	<table class="table no-table-boder" style="margin-top: 20px;">
		<tbody>
		% for game in games:
		    ${blocks.render("game", game=game, base=base, punditryAvailable=utils.punditryAvailable(pundit, game, ladder), speculative=speculative, totalActivePlayers=ladder.getNumActivePlayers(game.time-1))}
		% endfor
		</tbody>
	</table>
</div>
