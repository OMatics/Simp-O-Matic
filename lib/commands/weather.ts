const fetch = require('node-fetch');

const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

export default home_scope => {
	const { message, args, SECRETS, CONFIG } = home_scope;

	if (args[0] === 'set'){
		CONFIG.weather_locations[message.author.id] = args.tail().join(' ');
		message.answer(`Your weather location has \
			been set to ${args.slice(1).join(' ')}`.squeeze());
	} else {
		const location = args[0]
			? args.join(' ')
			: CONFIG.weather_locations[message.author.id] || 'Cuckfield';
		const key = SECRETS.openweather.key;

		const error = e => message.answer(`Error getting weather\n\`\`\`${e}\`\`\``);
		fetch(`${WEATHER_URL}?q=${location}&appid=${key}&units=metric`)
			.catch(error)
			.then(res => res.json())
			.then(d => {
				const date = new Date();
				const hour = (24 + date.getUTCHours() + d.timezone) % 24;
				const country = !d.sys ? 'somewhere' : d.sys.country;
				if (d.main) {
				message.answer(`${hour}:${date.getMinutes()} ${d.name}, \
					${country}: ${d.main.temp}°C \
					(feels like ${d.main.feels_like}°C) \
					${d.weather[0].description}, \
					${d.main.temp_max}°C max, \
					${d.main.temp_min}°C min`.squeeze());
				} else {
					message.answer(`Cannot get weather information`
						+ ` from ${location}`);
				}
			})
			.catch(error);
	}
};
