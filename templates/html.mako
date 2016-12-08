<%!
from datetime import datetime
base = ""
version = '4.0.1'
%><%namespace name="blocks" file="blocks.mako" inheritable="True"/>Content-Type: text/html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${self.attr.title}Table Football Ladder ${self.attr.version}</title>

    <!-- CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" integrity="sha384-Nlo8b0yiGl7Dn+BgLn4mxhIIBU6We7aeeiulNCjHdUv/eKHx59s3anfSUjExbDxn" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.4/css/ion.rangeSlider.min.css" integrity="sha384-Wq9DAJUP5kU9Dk244QvEHs3ZXLGzxXxwU338D+D+czP5fUSWkRoF6VhjUPnMk6if" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.4/css/ion.rangeSlider.skinModern.min.css" integrity="sha384-7BZOVCgNHI0de9biH6OtG+p+ZGvcyLZTF2OyorTMm705uvbI1iWwxF2qUvGFrVNY" crossorigin="anonymous">
    <link rel="stylesheet" href="${self.attr.base}css/ladder.css?v=${self.attr.version}">

    % if datetime.now().month == 12:
      <link href="${self.attr.base}css/christmas.css" rel="stylesheet">
    % endif

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha384-3ceskX3iaEnIogmQchP8opvBy3Mi7Ce34nWjpBIwVTHfGYWQS9jwHDVRnpKKHJg7" crossorigin="anonymous"></script>
    <script type="text/javascript" src="${self.attr.base}js/jquery.tablesorter.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min.js" integrity="sha384-RwhSkUmEGeOAldfwpJck6gcmrGxI7Q8shFWFF5lqnOihJnV556qpqUVpYNP7wSew" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time.min.js" integrity="sha384-qSVSrwJ8D6S0H6+MOkF7MBxx9C21JN6c8O8uZlZzGPMpLhsV0N015e/P4bdc4Whj" crossorigin="anonymous"></script>
    <script type="text/javascript" src="${self.attr.base}js/jquery.floatThead.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.4.2/showdown.min.js" integrity="sha384-2gwhiMwCT8Gn9vUPl8LDE++FwvUzTjsahQ8uVjkHAdc573wdAPdwLNTunNlJZKvL" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js" integrity="sha384-iExPlOYmpYCl6QdVZIxpaVbrQEPIef7hPsjKoic/UIBkQdY4UYpP6j3C90Dx5G74" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.4/js/ion.rangeSlider.min.js" integrity="sha384-cLiwOQUID7syKYVMzMNdO6tstxjyBP/v4w9rr6/W9AwqOnHar+FKn+kHRZmFI/GF" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.min.js" integrity="sha384-7pfELK0arQ3VANqV4kiPWPh5wOsrfitjFGF/NdyHXUJ3JJPy/rNhasPtdkaNKhul" crossorigin="anonymous"></script>
    <script type="text/javascript" src="${self.attr.base}js/ladder.js?v=${self.attr.version}"></script>
  </head>
  <body>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <p class="navbar-text tntfl-header">Table Football Ladder</p>
        <ul class="nav navbar-nav">
        <li><a href="${self.attr.base}.">Home</a></li>
        <li><a href="${self.attr.base}stats/">Stats</a></li>
        <li><a href="${self.attr.base}speculate/">Speculate</a></li>
        <li><a href="${self.attr.base}api/">API</a></li>
        <li><a href="${self.attr.base}historic.cgi">Slice</a></li>
      </ul>

        <form class="navbar-form navbar-right game-entry" method="post" action="${self.attr.base}game/add/">
          <div class="form-group">
            <input type="text" name="redPlayer" class="form-control red player" placeholder="Red">
            <input type="text" name="redScore" class="form-control red score" placeholder="0" maxlength="2"> - <input type="text" name="blueScore" class="form-control blue score" placeholder="0" maxlength="2">
            <input type="text" name="bluePlayer" class="form-control blue player" placeholder="Blue">
            <script type="text/javascript">
            (function($){
              $(".red.score").change(function() {
                $(".blue.score").val(10 - $(".red.score").val());
              })
            })( jQuery );
            (function($){
              $(".game-entry input").keyup(function() {
                checkGameSubmitForm();
              })
            })( jQuery );
            </script>
          </div>
          <button type="submit" id="gameFormSubmit" disabled="true" class="btn btn-default" onClick="this.form.submit(); this.disabled=true;">Add game <span class="glyphicon glyphicon-triangle-right"></span></button>
        </form>
      </div><!-- /.container-fluid -->
    </nav>
    ${self.body()}
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>

</html>
