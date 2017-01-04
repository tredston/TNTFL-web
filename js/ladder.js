
function plotGamesPerDay(id, data){
  $.plot(
    id,
    data,
    {
      'legend' : {show: false},
      'xaxis': {mode: 'time'},
      grid: {hoverable: true},
      colors: ['#0000FF']
    }
  );
}

function getSortOptions(tableQuery) {
  //returns an array of a tablesorter sort order
  var hdrorder = null;
  $(tableQuery).each(function(index) {
    if ($(this).hasClass('headerSortDown')) {
      hdrorder = [index, 0];
    } else if ($(this).hasClass('headerSortUp')) {
      hdrorder = [index, 1];
    }
  });

  if (hdrorder == null && tableQuery != ".floatThead-table th") {
    return getSortOptions(".floatThead-table th")
  }

  if (hdrorder == null) {
    hdrorder = [10,1];
  }

  return hdrorder;
}

function isShowInactive() {
  return $("#inactiveButton").is(':visible');
}

function ladderTablePostProc(sortOpts, showInactive) {
  $("#ladder").tablesorter({'sortList': [[sortOpts[0], sortOpts[1]]], 'headers': { 11: { 'sorter': false}}});
  $("#ladder").floatThead();
  if (showInactive) {
    $('.inactive').show();
    $('.button_active').hide();
  }
}

function checkGameSubmitForm() {
  const allInputs = $(".game-entry input").map(function() { return $(this).val() !== ""}).get();
  var allFilled = true;
  for (var i = 0; i < allInputs.length; i++) {
    allFilled = allFilled && allInputs[i];
  }

  const redScore = $('input.red.score').val();
  const blueScore = $('input.blue.score').val();

  const scoreValid = function(score) {
    if (isNaN(score)) {
      return false;
    }
    if (score < 0) {
      return false;
    }
    if (score > 10) {
      return false;
    }
    return true;
  }
  $('#gameFormSubmit').prop("disabled", !allFilled || !scoreValid(redScore) || !scoreValid(blueScore));
}
