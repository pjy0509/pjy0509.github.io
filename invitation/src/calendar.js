import Constant from "./constant.js";

const Calendar = {
	init: function () {
		window.Calendar = Calendar;
		
		const calendar = document.getElementById("calendar");
		
		calendar.innerHTML = "";
		
		const startDay = new Date(Constant.WEDDING_DATE_TIME_START.getFullYear(), Constant.WEDDING_DATE_TIME_START.getMonth()).getDay();
		const lastDate = new Date(Constant.WEDDING_DATE_TIME_START.getFullYear(), Constant.WEDDING_DATE_TIME_START.getMonth() + 1, 0).getDate();
		const targetDate = Constant.WEDDING_DATE_TIME_START.getDate();
		const grid = document.createElement("div");
		
		['일', '월', '화', '수', '목', '금', '토'].forEach(d => {
			const weekday = document.createElement("div");
			const el = document.createElement("p");
			
			el.innerText = d;
			weekday.appendChild(el);
			grid.appendChild(weekday);
		});
		
		for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement("div"));
		
		for (let d = 1; d <= lastDate; d++) {
			const day = document.createElement("div");
			const el = document.createElement("p");
			
			if (d === targetDate) day.id = "target";
			
			el.innerText = d.toString();
			day.appendChild(el);
			grid.appendChild(day);
		}
		
		calendar.appendChild(grid);
		
		Calendar.initTimer();
		Calendar.initWeather();
	},
	initTimer: function () {
		const components = [document.getElementById("remain-date"), document.getElementById("days"), document.getElementById("hours"), document.getElementById("minutes"), document.getElementById("seconds")];
		const targetTimestamp = +Constant.WEDDING_DATE_TIME_START;
		
		setInterval(() => {
			let subtract = Math.floor((targetTimestamp - Date.now()) / 1000);
			
			const days = Math.floor(subtract / 86400);
			const hours = Math.floor((subtract %= 86400) / 3600);
			const minutes = Math.floor((subtract %= 3600) / 60);
			const seconds = subtract % 60;
			
			components[0].textContent = (days + 1).toString() + "일";
			components[1].textContent = days.toString();
			components[2].textContent = hours.toString();
			components[3].textContent = minutes.toString();
			components[4].textContent = seconds.toString();
		}, 1000);
	},
	initWeather: function () {
		const components = [document.getElementById("icon"), document.getElementById("detail"), document.getElementById("temperature"), document.getElementById("apparent-temperature"), document.getElementById("precipitation-probability")];
		const weather = document.getElementById("weather");
		
		try {
		
		} catch (e) {
		}
		fetch(
			"https://api.open-meteo.com/v1/forecast?"
			+ new URLSearchParams({
				latitude: Constant.LATITUDE,
				longitude: Constant.LONGITUDE,
				hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,precipitation_probability,apparent_temperature,weathercode",
				start_date: Constant.WEDDING_DATE_ISO_STRING,
				end_date: Constant.WEDDING_DATE_ISO_STRING,
				timezone: Constant.TIMEZONE
			})
		)
			.then(response => response.json())
			.then(data => {
				let i = data.hourly.time.indexOf(Constant.WEDDING_DATE_ISO_STRING + "T12:00");
				
				if (i === -1) return;
				
				const weatherCodeMap = {
					0: {emoji: "☀️", detail: "맑음"},
					1: {emoji: "🌤", detail: "조금 흐림"},
					2: {emoji: "⛅️", detail: "흐림"},
					3: {emoji: "🌥", detail: "흐림"},
					45: {emoji: "🌫", detail: "안개"},
					48: {emoji: "🌫", detail: "서리 안개"},
					51: {emoji: "🌦", detail: "이슬비"},
					53: {emoji: "🌦", detail: "이슬비"},
					55: {emoji: "🌦", detail: "이슬비"},
					56: {emoji: "🌧", detail: "어는 이슬비"},
					57: {emoji: "🌧", detail: "어는 이슬비"},
					61: {emoji: "🌧", detail: "비"},
					63: {emoji: "🌧", detail: "비"},
					65: {emoji: "🌧", detail: "비"},
					66: {emoji: "🌧", detail: "어는 비"},
					67: {emoji: "🌧", detail: "어는 비"},
					71: {emoji: "🌨", detail: "눈"},
					73: {emoji: "🌨", detail: "눈"},
					75: {emoji: "🌨", detail: "눈"},
					77: {emoji: "🌨", detail: "진눈깨비"},
					80: {emoji: "🌧", detail: "소나기"},
					81: {emoji: "🌧", detail: "소나기"},
					82: {emoji: "🌧", detail: "소나기"},
					85: {emoji: "🌨", detail: "눈 소나기"},
					86: {emoji: "🌨", detail: "눈 소나기"},
					95: {emoji: "⚡️", detail: "천둥"},
					96: {emoji: "🌩", detail: "우박, 천둥"},
					99: {emoji: "🌩", detail: "우박, 천둥"}
				};
				
				const weatherCode = weatherCodeMap[data.hourly.weathercode[i]];
				
				components[0].innerText = weatherCode.emoji;
				components[1].innerText = weatherCode.detail;
				components[2].innerText = data.hourly.temperature_2m[i] + " °C";
				components[3].innerText = data.hourly.apparent_temperature[i] + " °C";
				components[4].innerText = data.hourly.relative_humidity_2m[i] + " %";
				
				weather.classList.add("show");
				
				// console.log(`기온: ${data.hourly.temperature_2m[i]} °C`);
				// console.log(`체감온도: ${data.hourly.apparent_temperature[i]} °C`);
				// console.log(`습도: ${data.hourly.relative_humidity_2m[i]} %`);
				// console.log(`풍속: ${data.hourly.wind_speed_10m[i]} m/s`);
				// console.log(`강수량: ${data.hourly.precipitation[i]} mm`);
				// console.log(`강수 확률: ${data.hourly.precipitation_probability[i]} %`);
				// console.log(`기상 코드: ${data.hourly.weathercode[i]}`);
			})
			.catch();
	}
};

export default Calendar;
