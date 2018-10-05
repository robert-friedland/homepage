const CLIENT_ID = '481309020480-m9rivmt5dpqi5usbrjsvdeg8hp7q3l79.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB1jwVM87UJa7UEYUo05tyw5d0_dFAGYBs';

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];

var SCOPES = "https://www.googleapis.com/auth/calendar.readonly email";

const day = d3.selectAll('#day')
const date = d3.select('#date')
const time = d3.select('#time')
const weather1Header = d3.select('#weather1-header')
const weather2Header = d3.select('#weather2-header')
const weather1Icon = d3.select('#weather1-icon')
const weather1Temp = d3.select('#weather1-temp')
const weather2Icon = d3.select('#weather2-icon')
const weather2Temp = d3.select('#weather2-temp')
const eventTitle = d3.select('#event-title')
const eventTime = d3.select('#event-time')
const backgrounds = document.getElementsByClassName('bg')
const signin = document.getElementById('signin')
const signout = document.getElementById('signout')

signin.addEventListener('click', function(){
	gapi.auth2.getAuthInstance().signIn()
})

signin.addEventListener('click', function(){
	gapi.auth2.getAuthInstance().signOut()
})

setTime()
setInterval(setTime, 1000)
setWeather()
setInterval(setWeather, 1000 * 60 * 60)
var slideIndex = Math.floor(Math.random() * Math.floor(backgrounds.length - 1))
showSlides()

function showSlides() {
	var i;
	for(i=0;i<backgrounds.length;i++){
		backgrounds[i].style.left = '-100vw'
	}

	backgrounds[slideIndex].style.opacity = 1
	backgrounds[slideIndex].style.left = '0vw'
	
	slideIndex++;
	if(slideIndex > backgrounds.length - 1){
		slideIndex = 0
	}
	backgrounds[slideIndex].style.opacity = 0
	backgrounds[slideIndex].style.left = '100vw'
	setTimeout(showSlides, 10000);
}

function setTime(){
	let now = new Date()
	day.text(now.toLocaleString('US', {weekday: 'long'}))
	date.text(now.toLocaleString('US', {month: 'long', day: 'numeric'}))
	time.text(now.toLocaleString('US', {hour: 'numeric', minute: 'numeric'}).toLowerCase())
}

function setWeather() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(darkSky);
	}
}

function darkSky(position){
	const url = 'darksky'
	const data = {
		latitude: position.coords.latitude,
		longitude: position.coords.longitude
	}

	var http = new XMLHttpRequest();
	http.open("POST", url, true);
	http.setRequestHeader('Content-type', 'application/json');

	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status == 200){
			let json = JSON.parse(http.responseText)
			let now = new Date()
			console.log(json)

			var weather1, weather2

			if (now.getHours() >= 5 && now.getHours() < 20){
				weather1Header.text('Today')
				weather2Header.text('Tonight')
				weather1 = json.daily.data.find(function(d){
					let date = new Date(d.time * 1000)
					return date.getDate() == (new Date()).getDate()
				})
				weather2 = json.hourly.data.find(function(d){
					let time = new Date(d.time * 1000)
					return (time >= new Date() && (time.getHours() >= 20 || time.getHours() <= 4))
				})
			}
			else{
				weather1Header.text('Tonight')
				weather2Header.text('Tomorrow')
				weather2 = json.daily.data.find(function(d){
					let date = new Date(d.time * 1000)
					return date >= new Date()
				})
				weather1 = json.hourly.data.find(function(d){
					let time = new Date(d.time * 1000)
					return (time >= new Date() && (time.getHours() >= 20 || time.getHours() <= 4))
				})
			}

			weather1Temp.text(`${Math.round(weather1.temperature || weather1.temperatureHigh).toString()}°`)
			let skycons1 = new Skycons({"color": "#ffffff"})
			skycons1.set("weather1-icon", weather1.icon)
			skycons1.play()
			
			weather2Temp.text(`${Math.round(weather2.temperature || weather2.temperatureHigh).toString()}°`)
			let skycons2 = new Skycons({"color": "#ffffff"})
			skycons2.set("weather2-icon", weather2.icon)
			skycons2.play()
		}
	}
	http.send(JSON.stringify(data));
}

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
		}
	})
}