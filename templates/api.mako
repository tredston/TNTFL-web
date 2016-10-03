<%!
title = "API | "
base = "../"
%>
<%inherit file="html.mako" />
<%
text = open('README.md', 'r').read().replace('\n', '\\n')
%>
<div class="container-fluid">
  <div class="row">
  <div class="col-md-8">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h1 class="panel-title">Docs</h1>
      </div>
      <div class="panel-body">
        <div id="markdown">
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  const converter = new showdown.Converter();
  $("#markdown").html(converter.makeHtml("${text}"));
</script>
