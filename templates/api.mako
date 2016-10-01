<%!
import markdown
title = "API | "
base = "../"
%>
<%inherit file="html.mako" />
${markdown.markdown(open('README.md', 'r').read(), ['sane_lists'])}
