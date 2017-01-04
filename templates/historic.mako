<%!
from tntfl.template_utils import appendChristmas
base = ''
pageName = 'historic'
links = [
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/2.5.5/react-bootstrap-table.min.css" integrity="sha384-VIXf7ijRNoaapcQEvARxuDSoSqHwZOTEXGpFw8r1dZ6PC0s3vOFhYUrOHO7SQRUl" crossorigin="anonymous">',
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.5/css/ion.rangeSlider.min.css" integrity="sha384-Wq9DAJUP5kU9Dk244QvEHs3ZXLGzxXxwU338D+D+czP5fUSWkRoF6VhjUPnMk6if" crossorigin="anonymous">',
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.1.5/css/ion.rangeSlider.skinModern.min.css" integrity="sha384-7BZOVCgNHI0de9biH6OtG+p+ZGvcyLZTF2OyorTMm705uvbI1iWwxF2qUvGFrVNY" crossorigin="anonymous">',
]
appendChristmas(links, base)
%><%inherit file="htmlts.mako" />
