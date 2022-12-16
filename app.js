const express = require('express')
const app = express()
const port = 4200
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const http = require('http')
const keepSocketAliveFct = http.Agent.prototype.keepSocketAlive;
http.Agent.prototype.keepSocketAlive = function keepSocketAlive(socket) {
	console.log('keepSocketAlive', this.totalSocketCount, this.maxTotalSockets, this.maxSockets, this.maxFreeSockets);
	let ret = keepSocketAliveFct.call(this, socket);
	return ret;
};
const agent = new http.Agent({keepAlive: true});
agent.on('free', (socket, options) => {
	console.log('free', agent.totalSocketCount, agent.maxTotalSockets, agent.maxSockets, agent.maxFreeSockets);
});
const options = {agent, protocol: 'http:'};
const baseUrl = 'http://pwa-ish-demo.test.intershop.com/INTERSHOP/rest/WFS/inSPIRED-inTRONICS_Business-Site/rest';

app.get('/', (expressReq, expressRes) => {
	for (let index = 0; index < 1000000; index++) {
		const element = index + index;
	}
	processClientRequest(http.get(`${baseUrl}/configurations`, options, processResponse));
	for (let index = 0; index < 1000000; index++) {
		const element = index + index;
	}
	processClientRequest(http.get(`${baseUrl};loc=en_US;cur=USD/cms/includes/include.homepage.content.pagelet2-Include`, options, processResponse));
	for (let index = 0; index < 1000000; index++) {
		const element = index + index;
	}
	processClientRequest(http.get(`${baseUrl};loc=en_US;cur=USD/categories?imageView=NO-IMAGE&view=tree&limit=2&omitHasOnlineProducts=true`, options, processResponse));
	for (let index = 0; index < 1000000; index++) {
		const element = index + index;
	}
	expressRes.end();
})

app.get('/metrics', (_, res) => {
	client.register.metrics().then(content => {
		res.set('Content-Type', client.contentType);
		res.send(content);
	})
	.catch(error => {
		res.status(500).send(error.toString());
	});
})

app.listen(port, () => {
  collectDefaultMetrics();
  console.log(`Example app listening on port ${port}`)
})

function processResponse(res) {
	let rawData = '';
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('error', (err) => { console.error(err)});
	res.on('end', () => {
	  try {
		const parsedData = JSON.parse(rawData);
	  } catch (e) {
		console.log(e.message);
	  }
	});
}

function processClientRequest(clientRequest) {
	clientRequest.on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});

	clientRequest.on('socket', (socket) => {

	});

}
