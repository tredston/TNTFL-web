<%!
title = ""
base = "../../../"
%>
<%inherit file="html.mako" />
  ${self.blocks.render("gamesListPage", ladder=ladder, pageTitle=pageTitle, games=reversed(games), base=self.attr.base)}
