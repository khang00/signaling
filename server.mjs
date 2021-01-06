import {Server} from 'socket.io'

const CORS_OPTIONS = {
    'Access-Control-Allow-Origin': '*'
}
const CONNECTED_USERS = new Map()

const server = new Server(8000, {
    path: '/',
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    cors: CORS_OPTIONS
})

server.on('connection', socket => {
    socket.emit('connected')

    socket.on('login', data => {
        CONNECTED_USERS.set(data.username, socket.id)
    })

    socket.on('message', data => {
        if (CONNECTED_USERS.has(data.recipient)) {
            const recipient = CONNECTED_USERS.get(data.recipient)
            console.log(data.content)
            server.to(recipient).emit('message', data)
        }
    })

    socket.on('disconnecting', reason => {
        console.log(reason)
    })
})

server.on('error', () => console.log('Socket error'))
