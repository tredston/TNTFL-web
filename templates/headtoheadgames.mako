<%!
title = ""
base = "../../../../"
%>
<%inherit file="html.mako" />
  ${self.blocks.render("components/gamesListPage", ladder=ladder, pageTitle=pageTitle, games=reversed(games), base=self.attr.base)}
