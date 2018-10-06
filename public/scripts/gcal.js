const CLIENT_ID = '481309020480-m9rivmt5dpqi5usbrjsvdeg8hp7q3l79.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB1jwVM87UJa7UEYUo05tyw5d0_dFAGYBs';

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];

var SCOPES = "https://www.googleapis.com/auth/calendar.readonly email";

function handleClientLoad() {
  gapi.load('client:auth2', initClient)
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
  })

 	signin.addEventListener('click', function(){
		gapi.auth2.getAuthInstance().signIn()
	})

	signin.addEventListener('click', function(){
		gapi.auth2.getAuthInstance().signOut()
	})
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
  	// gapi.auth2.getAuthInstance().signOut()
  	setUpcoming()
  	setInterval(setUpcoming, 1000 * 60 * 10)
  } 
  else {
    gapi.auth2.getAuthInstance().signIn()
  }
  
}

function getCalendarEvents(calendarId, timeMin, timeMax, maxResults){
  return gapi.client.calendar.events.list({
    'calendarId': calendarId,
    'timeMin': timeMin,
    'timeMax': timeMax,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': maxResults,
    'orderBy': 'startTime',
    // 'timeZone': 'America/New_York'//'America/Los_Angeles'
  }).then(function(response, events){
    return response.result.items
  })
}

Date.prototype.addDays = function(days){
	var date = new Date(this.valueOf())
	date.setDate(date.getDate() + days)
	return new Date(date)
}

function setUpcoming(){
	var now = new Date()
	var tomorrow = new Date()
	tomorrow.setHours(23,59,59,59)
	getCalendarEvents('primary', now.toISOString(), tomorrow.toISOString(), 1).then(function(e){
		console.log(e)
		if(e.length > 0){
			let event = e[0]
			eventTitle.text(event.summary)
			eventTime.text(new Date(event.start.dateTime).toLocaleString('US', {hour: 'numeric', minute: 'numeric'}).toLowerCase() 
				+ ' - ' 
				+ new Date(event.end.dateTime).toLocaleString('US', {hour: 'numeric', minute: 'numeric'}).toLowerCase())
		}
		else{
			eventTitle.text('No more events today.')
      eventTime.text('')
		}
	})
}