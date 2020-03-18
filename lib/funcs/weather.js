import { Discord, On, Client } from '@typeit/discord';
import { Message, Attachment, TextChannel } from 'discord.js';
import request from 'request';
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
module.exports = function(message, args, SECRETS, CONFIG){
	if (args[0] === 'set'){
		CONFIG.weather_locations[message.author.id] = args.slice(1).join(' ');
		message.answer(`Your weather location has \
			been set to ${args.slice(1).join(' ')}`);
	} else {
		const location = args[0]?args.join(' '):CONFIG.weather_locations[message.author.id] || 'Cuckfield';
		request(`${WEATHER_URL}?q=${location}&appid=${SECRETS.openweather.key}&units=metric`, (_a, _b, c) => {
			let d = JSON.parse(c);
			const date = new Date();
			var hour = (24 + date.getUTCHours() + d.timezone) % 24;
			message.answer(`${hour}:${date.getMinutes()} ${d.name}, \
				${d.sys.country}: ${d.main.temp}°C \
				(feels like ${d.main.feels_like}°C) \
				${d.weather[0].description}, \
				${d.main.temp_max}°C max, \
				${d.main.temp_min}°C min`);
		})
}