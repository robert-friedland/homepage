const icon = document.getElementById('icon');
const temp = document.getElementById('temp');
const loc = document.getElementById('location');
const button = document.getElementById('button');
const icon_size = document.getElementById('icon-size')
const temp_size = document.getElementById('temp-size')
const loc_size = document.getElementById('loc-size')
const settings = document.getElementById('settings')
const form = document.getElementById('form')

form.style.display='none'

settings.addEventListener('click', function(){
	console.log(form.style.display)
	if(form.style.display == 'none'){
		form.style.display = 'inline-block'
	}
	else{
		form.style.display = 'none'
	}
})

button.addEventListener('click', function(){
	if(icon_size.value != ''){icon.style.fontSize = icon_size.value + 'px'}
	if(temp_size.value != ''){temp.style.fontSize = temp_size.value + 'px'}
	if(loc_size.value != ''){loc.style.fontSize = loc_size.value + 'px'}
})

function updateTime(){
	var now = new Date();

	var time1 = document.getElementById("time-portion");
	var time2 = document.getElementById("ampm-portion");
	var timeString = now.toLocaleTimeString('US', {hour: 'numeric', minute: 'numeric'});
	var timePortion = timeString.substring(0, timeString.length - 3);
	var amPmPortion = timeString.slice(-2).toLowerCase();
	time1.innerHTML = timePortion;
	time2.innerHTML = amPmPortion;
			
	var greeting = document.getElementById("greeting");
	var greetingMsg = "";
	var hours = now.getHours();
	if(hours >= 5 && hours < 12){
		greetingMsg = "Good Morning :)";
	}
	else if(hours >= 12 && hours < 17){
		greetingMsg = "Good Afternoon :)";
	}
	else if(hours >= 17 && hours < 22){
		greetingMsg = "Good Evening :)";
	}
	else{
		greetingMsg = "Goodnight :)";
	}
	greeting.innerHTML = greetingMsg;
}

function updateWeather() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(openWeatherMap);
	}
}
function showPosition(position) {
	console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
}

function openWeatherMap(position){
	const url = `http://localhost:5000/homepage`;
	const data = {
		latitude: position.coords.latitude,
		longitude: position.coords.longitude
	}
	
	var http = new XMLHttpRequest();
	http.open("POST", url, true);
	http.setRequestHeader('Content-type', 'application/json');

	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status == 200){
			var json = JSON.parse(http.responseText)
			console.log(json)
			var iconID = json.weather[0].id.toString() 
			if(json.weather[0].icon.slice(-1)=='n'){
				iconID += '-n'
			}
			icon.className = `owf owf-${iconID}`

			temp.innerHTML = `${Math.round(json.main.temp_min).toString()}°`
			loc.innerHTML = json.name
		}
	}
	http.send(JSON.stringify(data));
}
		
updateTime();
setInterval(updateTime, 1000);
updateWeather();
setInterval(updateWeather, 1000 * 60 * 30)