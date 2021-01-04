import {io} from 'socket.io-client'

const alice = io('ws://localhost:3000')
alice.on('connected', () => {
    alice.emit('login', {username: 'Alice'})
    alice.emit('message', {from: 'Alice', recipient: 'Bob', content: 'send nudes'})
})


setTimeout(() => {
    alice.close()
}, 3000)


const bob = io('ws://localhost:8000')
bob.on('connected', () => {
    bob.emit('login', {username: 'Bob'})
})

bob.on('message', data => {
    console.log(data)
})

setTimeout(() => {
    bob.close()
}, 3000)
