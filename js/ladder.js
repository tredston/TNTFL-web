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
