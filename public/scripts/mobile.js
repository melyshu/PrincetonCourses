/* BENSU: Mobile-only methods */

// Go back to search results
var goBackToSearch = function() {
  $('#search-pane').css('display','block')
  $('#display-pane').css('display','none')
  $('#navbar-toggle-button').css('display','block')
  $('#navbar-back-button').css('display','none')
}

// Go to course page
var goToCoursePage = function() {
	$('#search-pane').css('display','none')
  $('#display-pane').css('display','block')
  $('#navbar-toggle-button').css('display','none')
  $('#navbar-back-button').css('display','block')
  $('#navigationbar').css('height', '1');
  document.getElementById("navigationbar").setAttribute("aria-expanded", false);
}

// var displayPaneInStack = function(stack) {
  
// }

// var addPaneToStack = function(pane) {

// }