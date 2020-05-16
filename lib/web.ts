import http from 'http';
import { readFileSync as read_file } from 'fs';
import process from 'process';

const PORT = Number(process.env.PORT) || 8080;

export default handle_post => {
	const request_listener: http.RequestListener = (req, res) => {
		let got_post = false;
		req.on('data', chunk => {
			console.log('Web-hook:');
			const body = JSON.parse(chunk);
			console.log(body);
			handle_post(body);
			got_post = true;
		});

		if (got_post) return;

		switch (req.url) {
			case '/':
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});

				res.write(read_file('./web/index.html').toString());
				res.end();
				break;
			default:
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				res.write(`<!DOCTYPE html>
			<html>
			<body>
				<h1>404 - Not found.</h1>
			</body>
			</html>
		`);
				res.end();
		}
	};
	const server = http.createServer(request_listener);
	server.listen(PORT, '0.0.0.0', () => {
		console.log(`Web server started on http://0.0.0.0:8080/`)
	});
};
