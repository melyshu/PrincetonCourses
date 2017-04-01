// when document loads
$(document).ready(function () {

  //var winWidth = $(window).height();
  var winWidth = $(window).width();

  // Saving the user's netid so it is globally available
  document.netid = $("#netid").text()

  var onresize = function() {
    //your code here
    //this is just an example
    var prevWidth = winWidth;
    winWidth = document.body.clientWidth;
    winHeight = document.body.clientHeight;
    if ((winWidth > 767) && (prevWidth < 767))
    {
      //var backButton = '<div><button type="button" onclick="goBackToSearchResults();" class="btn btn-secondary">Back</div></span>'
      $('#search-pane').css("display", "");
      $('#display-pane').css("display", "");
      $('body').css("background-color", "#ffffff");
      $('#backButton').css("display", "none");
    }
    if ((winWidth < 767) && (prevWidth > 767))
    {
      //var backButton = '<div><button type="button" onclick="goBackToSearchResults();" class="btn btn-secondary">Back</div></span>'
      $('#search-pane').css("display", "");
      $('#display-pane').css("display", "none");
      $('body').css("background-color", "#dddddd");
    }
  }
  window.addEventListener("resize", onresize);

  // construct local favorites list
  document.favorites = []
  $.get('/api/user/favorites', function(courses) {
    for (var course in courses) {
      document.favorites.push(courses[course]["_id"])
    }
  })

  // initial displaying favorites
  var dispFavorites = function() {

    // call api to get favorites and display
    $.get('/api/user/favorites', function(courses) {

      $('#favorite-header').css('display', (courses == undefined || courses.length == 0) ? 'none' : '')

      $('#favs').html('');
      $('#favorite-title').html('');

      $('#favorite-title').append(courses.length + ' Favorite Course' + (courses.length !== 1 ? 's' : ''))
      for (var courseIndex in courses) {
        var thisCourse = courses[courseIndex];

        // append favorite into favs pane
        $('#favs').append(newDOMResult(thisCourse, {"semester": 1, "tags": 1}));
      }
    })
  }

  // function for updating search results
  var searchForCourses = function () {
    // Construct the search query
    var query = {
      $text: {
        $search: $('#searchbox').val()
      },
      semester: $('#semester').val()
    }

    // Send the query to the server
    $.post('/api/courses', {
      query: JSON.stringify(query),
      sort: $('#sort').val(),
      brief: true
    }, function (courses, status) {
      // Basic error handling
      if (status !== 'success') {
        window.alert('An error occured and your search could not be completed.')
      }

      // Remove any search results already in the results pane
      $('#results').children().remove()

      // Update the search results sub-heading
      $('#search-title').text(courses.length + ' Search Result' + (courses.length !== 1 ? 's' : ''))

      // List the returned courses in the search results pane
      for (var courseIndex in courses) {
        var thisCourse = courses[courseIndex]
        $('#results').append(newDOMResult(thisCourse, {"tags": 1}))
      }
    })
  }

  // function for displaying course details
  var displayCourseDetails = function(courseID) {


    $.get('/api/course/' + courseID, function (course, status) {
        // Basic error handling
        if (status !== 'success') {
          window.alert('An error occured and your course could not be displayed.')
          return
        }

        $("#welcome-display-pane").hide()
        $("#display-pane").show()

        // Remove content from any previously displayed course
        $('#disp-title, #disp-subtitle, #disp-profs, #disp-body, #evals, #comments').html('')

        if (winWidth < 770)
        {
          var backButton = '<div><button type="button" id="backButton" onclick="goBackToSearchResults();" class="btn btn-secondary">Back</div></span>'
          $('#search-pane').css("display", "none");
          $('#display-pane').css("display", "inline");
          $('body').css("background-color", "#ffffff");
          $('#disp-title').append(backButton);
          $(this).removeClass("active")
        }

        var thisCourse = course

        // string for course listings
        var listings =  getListings(thisCourse)

        $('#disp-title').append(thisCourse.title)

        $('#disp-subtitle').append(listings + ' '
                                + (thisCourse.distribution == undefined ? '' : ' <span class="label label-info">' + thisCourse.distribution + '</span>')
                                + (thisCourse.pdf["required"]  ? ' <span class="label label-danger">PDF ONLY</span>'
                                : (thisCourse.pdf["permitted"] ? ' <span class="label label-warning">PDF</span>'
                                                                       : ' <span class="label label-danger">NPDF</span>'))
                                + (thisCourse.audit ? ' <span class="label label-warning">AUDIT</span>' : '')
                                /*+ ' <span type="button" class="btn-primary btn-default btn-sm" id="fav-button" style="font-weight:bold">Favorite</span>'*/
                                + (thisCourse.website == undefined ? '' : ' <a href="' + thisCourse.website
                                                                          + '" target="_blank"><i class="fa fa-link"></i></a>')
                                + ' <a href="https://registrar.princeton.edu/course-offerings/course_details.xml?courseid=' + thisCourse["courseID"]
                                          + '&term=' + thisCourse["semester"]["code"] + '" target="_blank"><i class="fa fa-external-link"></i></a>')

        //$('#fav-button')[0].course = thisCourse;
        //$('#comments').append(thisCourse.evaluations.studentComments)
        // stuff for course evaluations
        var evals = ""
        for (var field in thisCourse.evaluations[0].evaluations.scores) {
          var val = thisCourse.evaluations[0].evaluations.scores[field]
          evals += '<div>' + field + '</div>'
                 + '<div class="progress"><div class="progress-bar" role="progressbar" '
                 + 'style="width: ' + (val*20) + '%; background-color: ' + colorAt(val) + '"><strong>'
                 + val.toFixed(2) + '</strong></div></div>' // as percentage of 5
        }
        if (evals == "") {
          $('#evals').append('No course evaluations available.')
        }
        else {
          $('#evals').append(evals)
        }

        // stuff for student comments
        var comments = ""
        for (var studentComment in thisCourse.evaluations[0].evaluations.studentComments) {
            var val = thisCourse.evaluations[0].evaluations.studentComments[studentComment]
            comments += '<li class="comments-list-comment">' + val + '</li>'
        }
        if (comments == "") {
          $('#comments').append('No student comments available.')
        }
        else {
          $('#comments').append(comments)
        }

        var dispbody = ''
        dispbody += '<h4 style= "font-weight:bold" id="disp-profs"></h4>'
                    + '<div id="instructor-info" style="display: none; background-color:#eeeeee;" class="col-sm-12 pre-scrollable flex-item"></div>'
                    + '<p>' + thisCourse.description + '</p>'
                    + (thisCourse.prerequisites == undefined ? '' :
                    '<h4 style="font-weight:bold">Prerequisites</h4><p>' + thisCourse.prerequisites + '</p>')
                    + (thisCourse.equivalentcourses == undefined ? '' :
                    '<h4 style="font-weight:bold">Equivalent Courses</h4><p>' + thisCourse.equivalentcourses + '</p>')
                    + (thisCourse.otherinformation == undefined ? '' :
                    '<h4 style="font-weight:bold">Other Information</h4><p>' + thisCourse.otherinformation + '</p>')
                    + (thisCourse.otherrequirements == undefined ? '' :
                    '<h4 style="font-weight:bold">Equivalent Courses</h4><p>' + thisCourse.otherrequirements + '</p>')
                    // '<h4 style="font-weight:bold">Classes</h4><p>' + thisCourse.classes[0] + '</p>'

        var openClasses = { table: '' };
        var closedClasses = { table: '' };
        var cancelledClasses = { table: '' };

        // Show classes of a course
        var makeClassTable = function(val, classes) {
          classes.table += '<tr class = "course-classes-tr">'
                    + '<td>' + val['section'] + '</td>'
                    + '<td>'
            for (var day in val.schedule.meetings[0].days) {
              //classes += thisCourse.classes.schedule.meetings[0].days[day]
              classes.table += val.schedule.meetings[0].days[day] + ' '
            }
            classes.table += '</td>'
            classes.table += (val.schedule.meetings[0] == undefined ? '' :
                      '<td>' + (val.schedule.meetings[0].start_time == undefined ? '' :
                        val.schedule.meetings[0].start_time) + ' - '
                      + (val.schedule.meetings[0].end_time == undefined ? '' :
                        val.schedule.meetings[0].end_time) + '</td>'
                      + '<td>' + (val.schedule.meetings[0].building == undefined ? '' :
                        val.schedule.meetings[0].building.short_name) + ' '
                      + (val.schedule.meetings[0].room == undefined ? '' :
                        val.schedule.meetings[0].room) + '</td>'
                    )
            classes.table += '<td>' + val['enrollment'] + ' / ' + val['capacity'] + '</td>'
                      + '</tr>'
        }

        for (var field in thisCourse.classes) {
          var val = thisCourse.classes[field]
          if (val['status'] == "Open") {
            makeClassTable(val, openClasses);
          }
          if (val['status'] == "Cancelled") {
            makeClassTable(val, cancelledClasses);
          }
          if (val['status'] == "Closed") {
            makeClassTable(val, closedClasses);
          }
        }
        dispbody += (openClasses.table == ''? '' :
                  '<table id="class-table">' +
                  '<th>Section</th><th>Days</th><th>Time</th><th>Room</th><th>Enrolled</th>' +
                  '<h4 style="font-weight:bold">Open Classes</h4>' + openClasses.table + '</table>');
        dispbody += (closedClasses.table == ''? '' :
                  '<table id="class-table">' +
                  '<th>Section</th><th>Days</th><th>Time</th><th>Room</th><th>Enrolled</th>' +
                  '<h4 style="font-weight:bold">Closed Classes</h4>' + closedClasses.table + '</table>');
        dispbody += (cancelledClasses.table == ''? '' :
                  '<table id="class-table">' +
                  '<th>Section</th><th>Days</th><th>Time</th><th>Room</th><th>Enrolled</th>' +
                  '<h4 style="font-weight:bold">Cancelled Classes</h4>' + cancelledClasses.table + '</table>');
        $('#disp-body').append(dispbody)

        for (var instructor in thisCourse.instructors) {
          var name = '<a href="javascript:void(0)" class="course-prof" id = "'
                   + thisCourse.instructors[instructor]._id + '">'
                   + thisCourse.instructors[instructor].name['first'] + ' '
                   + thisCourse.instructors[instructor].name['last'] + '</a>'
            if ($('#disp-profs').html() !== '') {
              $('#disp-profs').append(', ')
            }
            $('#disp-profs').append(name)
        }

        var prevInstId = 0;
        $('.course-prof').on("click",function(){
          var instId =  $(this).attr("id");
          if (instId != prevInstId)
          {
            $('#instructor-info').hide();
            toggleInstructor(instId);
          }
          else
          {
            $('#instructor-info').slideToggle();
          }
          prevInstId = instId;
        })

        // Instructor page toggling
        var toggleInstructor = function(instId) {
          $('#instructor-info').html('');
          var instInfo = '';

          $.get('/api/instructor/' + instId, function (data) {
            var thisInst = data;
            instInfo += '<p> Courses taught by <strong>' + thisInst.name['first'] + ' ' + thisInst.name['last'] + '</strong></p>';
            instInfo += '<ul id="prof-courses">'
            $('#instructor-info').append(instInfo);
            for (var courseIndex in thisInst.courses) {
              var thisCourse = thisInst.courses[courseIndex];
              var entry = newDOMResult(thisCourse, {"semester": 1, "tags": 1})
              $('#prof-courses').append(entry);
            }
            /*for (course in thisInst.courses)
            {
              var courseId = thisInst.courses[course];
              instInfo += '<li id="prof-course"><div>' + courseId["title"] + '</div></li>';
            }*/
            $('#instructor-info').slideToggle();
          })
        }

    })

  }

  // Every time a key is pressed inside the #searchbox, call the searchForCourses function
  $('#searchbox').keyup(searchForCourses)
  $('#semester, #sort').change(searchForCourses)

  // Display the details for a course upon clicking the course in favorites or search result
  $('#results, #favs').on('click', 'li.search-result', function () {
    // Visually show this course has been clicked
    $('li.search-result.active').removeClass('active')
    $(this).addClass('active')

    // Push to the history this course
    var courseID = this.course._id
    window.history.pushState({courseID: courseID}, courseID, '/course/' + courseID)

    // Display the information for this course
    displayCourseDetails(courseID)
  })

  // Handle displaying a course after pushing the back/forward button in the browser
  window.onpopstate = function (event) {
    displayCourseDetails(event.state.courseID)
  }

  $(document).ready(function() {
      // On pageload, check if the URL contains a valid course
      var pathnameMatch = /^\/course\/(\d+)$/.exec(window.location.pathname)
      if (pathnameMatch.length === 2) {
          // Load the course
          displayCourseDetails(pathnameMatch[1])
      }
  })

  // Toggle between netid and "Logout" in navigation bar
  $('#nav-netid').hover(function() {
    $(this).children().toggle()
  })

  // feedback form toggling
  var toggleFeedback = function() {
    $('#feedback-container').slideToggle()
    if ($('#feedback-toggle').hasClass("active")) {
      $('#feedback-toggle').removeClass("active")
    } else {
      $('#feedback-toggle').addClass("active")
      $('#feedback-text').focus()
    }
  }

  // $('#feedback-form').one('submit', function() {
  //    var submitURL = ''
  //    submitURL += 'https://docs.google.com/a/princeton.edu/forms/d/e/1FAIpQLSdX3VTSbVfwOOtwMxhWiryQFrlBNuJDUTlp-lUmsV-S0xFM_g/formResponse?'
  //    submitURL += 'entry.1257302391=' + document.netid
  //    submitURL += '&entry.680057223=' + encodeURIComponent($('#feedback-text').val())

  //    $(this)[0].action = submitURL
  //    $('#feedback-submit').text('Thank You!')
  //    $('#feedback-submit').addClass('disabled')
  //    $('#feedback-text').attr('disabled', true)
  //    setTimeout(toggleFeedback, 1000)
  //  })

  $('#feedback-form').one('submit', function() {
    var submitURL = ''
    submitURL += 'https://docs.google.com/a/princeton.edu/forms/d/e/1FAIpQLSdX3VTSbVfwOOtwMxhWiryQFrlBNuJDUTlp-lUmsV-S0xFM_g/formResponse?'
    submitURL += 'entry.1257302391=' + document.netid
    submitURL += '&entry.680057223=' + encodeURIComponent($('#feedback-text').val())

    $(this)[0].action = submitURL
    $('#feedback-submit').text('Thank You!')
    $('#feedback-submit').addClass('disabled')
    $('#feedback-text').attr('disabled', true)
    setTimeout(toggleFeedback, 1000)
  })


  $('#feedback-toggle').click(toggleFeedback)

  // toggle display of favorite things
  var toggleFavDisplay = function() {
    var isVisible = $('#favorite-courses').css('display') !== 'none'

    var icon = $('#fav-display-toggle')
    icon.removeClass(isVisible ? 'fa-minus' : 'fa-plus')
    icon.addClass(isVisible ? 'fa-plus' : 'fa-minus')
    $('#favorite-courses').slideToggle()
  }
  $('#fav-display-toggle').click(toggleFavDisplay)
  $('#favorite-courses').css('max-height', '30%')

  // toggle display of search result things
  var toggleSearchDisplay = function() {
    var isVisible = $('#search-results').css('display') !== 'none'

    var icon = $('#search-display-toggle')
    icon.removeClass(isVisible ? 'fa-minus' : 'fa-plus')
    icon.addClass(isVisible ? 'fa-plus' : 'fa-minus')
    $('#favorite-courses').animate({'max-height': (isVisible ? '100%' : '30%')})

    $('#search-results').slideToggle()
  }
  $('#search-display-toggle').click(toggleSearchDisplay)


  // load the semesters for the dropdown
  $.get('/api/semesters', function (semesters) {
    for (var semesterIndex in semesters) {
      var thisSemester = semesters[semesterIndex]
      $('#semester').append('<option value="' + thisSemester.code + '">' + thisSemester.name + '</select>')
    }
  })

  for (var i = 1.0; i < 5.05; i += 0.1) {
    $('#disp-body').append('<span class="badge" style="background-color: '
      + colorAt(i) + '">'
      + i.toFixed(2)
      + '</span>')
  }
  $('#disp-body').append('<span class="badge"> N/A </span>')

  dispFavorites();
})

var goBackToSearchResults = function() {
  $('#search-pane').css("display", "inline");
  $('#display-pane').css("display", "none");
  $('body').css("background-color", "#dddddd");
}
