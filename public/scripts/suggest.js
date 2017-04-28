// dependencies: search.js

/* MEL: ideally these const arrays will be stored in the database */

const allcourses = {
  '*': 'All Courses'
}

// distributions
const distributions = {
  'EC': 'Epistemology and Cognition',
  'EM': 'Ethical Thought and Moral Values',
  'HA': 'Historical Analysis',
  'LA': 'Literature and the Arts',
  'SA': 'Social Analysis',
  'QR': 'Quantitative Reasoning',
  'STL': 'Science and Technology with Lab',
  'STN': 'Science and Technology without Lab'
}

// pdf options
const pdfoptions = {
  'PDF': 'P/D/F available',
  'PDFO': 'P/D/F only',
  'NPDF': 'No P/D/F',
  'AUDIT': 'Audit available',
  'NEW': 'New Course'
}

// departments
const departments = {
 'AAS': 'African American Studies',
 'AFS': 'African Studies',
 'AMS': 'American Studies',
 'ANT': 'Anthropology',
 'AOS': 'Atmospheric & Oceanic Sciences',
 'APC': 'Appl and Computational Math',
 'ARA': 'Arabic',
 'ARC': 'Architecture',
 'ART': 'Art and Archaeology',
 'AST': 'Astrophysical Sciences',
 'ATL': 'Atelier',
 'BCS': 'Bosnian-Croatian-Serbian',
 'CBE': 'Chemical and Biological Engr',
 'CEE': 'Civil and Environmental Engr',
 'CGS': 'Cognitive Science',
 'CHI': 'Chinese',
 'CHM': 'Chemistry',
 'CHV': 'Center for Human Values',
 'CLA': 'Classics',
 'CLG': 'Classical Greek',
 'COM': 'Comparative Literature',
 'COS': 'Computer Science',
 'CTL': 'Center for Teaching & Learning',
 'CWR': 'Creative Writing',
 'CZE': 'Czech',
 'DAN': 'Dance',
 'EAS': 'East Asian Studies',
 'ECO': 'Economics',
 'ECS': 'European Cultural Studies',
 'EEB': 'Ecology and Evol Biology',
 'EGR': 'Engineering',
 'ELE': 'Electrical Engineering',
 'ENE': 'Energy Studies',
 'ENG': 'English',
 'ENT': 'Entrepreneurship',
 'ENV': 'Environmental Studies',
 'EPS': 'Contemporary European Politics',
 'FIN': 'Finance',
 'FRE': 'French',
 'FRS': 'Freshman Seminars',
 'GEO': 'Geosciences',
 'GER': 'German',
 'GHP': 'Global Health & Health Policy',
 'GLS': 'Global Seminar',
 'GSS': 'Gender and Sexuality Studies',
 'HEB': 'Hebrew',
 'HIN': 'Hindi',
 'HIS': 'History',
 'HLS': 'Hellenic Studies',
 'HOS': 'History of Science',
 'HPD': 'History/Practice of Diplomacy',
 'HUM': 'Humanistic Studies',
 'ISC': 'Integated Science Curriculum',
 'ITA': 'Italian',
 'JDS': 'Judaic Studies',
 'JPN': 'Japanese',
 'JRN': 'Journalism',
 'KOR': 'Korean',
 'LAO': 'Latino Studies',
 'LAS': 'Latin American Studies',
 'LAT': 'Latin',
 'LCA': 'Lewis Center for the Arts',
 'LIN': 'Linguistics',
 'MAE': 'Mech and Aerospace Engr',
 'MAT': 'Mathematics',
 'MED': 'Medieval Studies',
 'MOD': 'Media and Modernity',
 'MOG': 'Modern Greek',
 'MOL': 'Molecular Biology',
 'MSE': 'Materials Science and Engr',
 'MTD': 'Music Theater',
 'MUS': 'Music',
 'NES': 'Near Eastern Studies',
 'NEU': 'Neuroscience',
 'ORF': 'Oper Res and Financial Engr',
 'PAW': 'Ancient World',
 'PER': 'Persian',
 'PHI': 'Philosophy',
 'PHY': 'Physics',
 'PLS': 'Polish',
 'POL': 'Politics',
 'POP': 'Population Studies',
 'POR': 'Portuguese',
 'PSY': 'Psychology',
 'QCB': 'Quantitative Computational Bio',
 'REL': 'Religion',
 'RES': 'Russian, East Europ, Eurasian',
 'RUS': 'Russian',
 'SAN': 'Sanskrit',
 'SAS': 'South Asian Studies',
 'SLA': 'Slavic Languages and Lit',
 'SML': 'Statistics & Machine Learning',
 'SOC': 'Sociology',
 'SPA': 'Spanish',
 'STC': 'Science and Technology Council',
 'SWA': 'Swahili',
 'THR': 'Theater',
 'TPP': 'Teacher Preparation',
 'TRA': 'Translation, Intercultural Com',
 'TUR': 'Turkish',
 'TWI': 'Twi',
 'URB': 'Urban Studies',
 'URD': 'Urdu',
 'VIS': 'Visual Arts',
 'WRI': 'Princeton Writing Program',
 'WWS': 'Woodrow Wilson School'
}

// handles click in navbar to toggle suggest pane
function toggleSuggest() {
  // swipe if in mobile
  if (document.isMobile) {
    $('#main-pane').slick('slickGoTo', 0)
    $('.navbar-collapse').collapse('hide')
    $('#suggest-toggle').tooltip('hide')
    $('#suggest-toggle').blur()
    return false
  }

  var isVisible = $('#suggest-pane').is(':visible')

  $('#suggest-pane').animate({width: 'toggle'})
  if (isVisible) $('#suggest-toggle').removeClass('active')
  else $('#suggest-toggle').addClass('active')
  $('#suggest-toggle').attr('data-original-title', isVisible ? 'Show search suggestions' : 'Hide search suggestions')
  $('#suggest-toggle').tooltip('hide')
  $('#suggest-toggle').blur()

  return false
}

// loads contents of suggest pane
function suggest_load() {
  for (var term in allcourses) {
    var description = allcourses[term]
    $('#suggest-allcourses-body').append(newDOMsuggestResult(term, description))
  }

  for (var term in distributions) {
    var description = distributions[term]
    $('#suggest-distributions-body').append(newDOMsuggestResult(term, description))
  }

  for (var term in pdfoptions) {
    var description = pdfoptions[term]
    $('#suggest-pdfoptions-body').append(newDOMsuggestResult(term, description))
  }

  for (var term in departments) {
    var description = departments[term]
    $('#suggest-departments-body').append(newDOMsuggestResult(term, description))
  }
}

// returns a DOM object for a search suggestion
function newDOMsuggestResult(term, description) {

  var tooltip = ' title="' + description + '"'

  var htmlString = (
    '<li class="list-group-item suggest-result truncate" ' + tooltip + '>'
    + '<strong>' + term + '</strong>&nbsp; '
    + description
  + '</li>'
  )

  var entry = $.parseHTML(htmlString)[0] // create DOM object
  // enable click to search
  $(entry).click(function() {
    $('#searchbox').val(term)
    searchFromBox()
    return false
  })

  return entry
}
