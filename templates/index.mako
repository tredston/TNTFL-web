<%! title = "" %>
<%!
import tntfl.templateUtils as utils
%>
<%inherit file="html.mako" />
<div class="container-fluid">
  Using games between ${utils.formatTime(ladder._ladderTime['range'][0])} and ${utils.formatTime(ladder._ladderTime['range'][1])}
  <div class="row">
    <div class="col-md-8">
      <div class="panel panel-default">
        <div class="panel-body" id="ladderHolder">
          ${self.blocks.render("ladder", base=self.attr.base)}
        </div>
        <script type="text/javascript">
          setInterval(
            function() {
            	sortOpts = getSortOptions("#ladder th");
            	if ($("tr.inactive")[0].style.display == "table-row") {
            		showInactive = 1
            	}
            	else {
            		showInactive = 0
            	}
            	$("#ladderHolder").load("ladder.cgi?sortCol=" + sortOpts[0][0] + "&sortOrder="+sortOpts[0][1] + "&showInactive=" + showInactive)
          	},
            600000
          );
        </script>
      </div>
    </div>
    <div class="col-md-4">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2 class="panel-title">Recent Games</h2>
        </div>
        <div class="panel-body" id="recentHolder">
          ${self.blocks.render("recent", base=self.attr.base, games=ladder.games)}
        </div>
        <script type="text/javascript">
          setInterval(function() {$("#recentHolder").load("recent.cgi")}, 600000);
        </script>
      </div>
    </div>
  </div>
</div>
