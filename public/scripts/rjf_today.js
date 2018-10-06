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
const settings = document.getElementById('settings')

setTime()
setInterval(setTime, 1000)
setWeather()
setInterval(setWeather, 1000 * 60 * 60)
var slideIndex = Math.floor(Math.random() * Math.floor(backgrounds.length - 1))
showSlides()

settings.addEventListener('click', function(){
	if (signin.style.visibility == 'visible'){
		signin.style.visibility = 'hidden'
		signout.style.visibility = 'hidden'
	}
	else{
		signin.style.visibility = 'visible'
		signout.style.visibility = 'visible'
	}
})

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