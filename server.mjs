import { Server } from 'socket.io'

const CORS_OPTIONS = {
	'Access-Control-Allow-Origin': '*'
}

const server = new Server(3000, {
	path: '/',
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false,
	cors: CORS_OPTIONS
})

const LOGINED_USERS = new Map()

server.on('connection', socket => {
	socket.emit('connection', '')
	socket.on('login', username => {
		LOGINED_USERS.set(username, socket.id)
		console.log(`${username} logined`)
	})

	socket.on('signal', data => {
		server.to(LOGINED_USERS.get(data.to)).emit('signal', data)
	})

	socket.on('initiate', data => {
		server.to(LOGINED_USERS.get(data.to)).emit('initiate', data)
	})

	socket.on('disconnecting', reason => {
		console.log(reason)
		for (let [username, socketId] of LOGINED_USERS) {
			if (socketId === socket.id) {
				LOGINED_USERS.delete(username)
				return
			}
		}
	})
})
