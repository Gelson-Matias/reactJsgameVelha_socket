
const express = require("express")
const app = express()
const http = require("http");
const cors =require ("cors")
const { Server } = require("socket.io");
app.use(cors())
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    },
});

io.on('connection', (socket) => {
    console.log("a user connected "+socket.id);
    socket.on('join_roon',(data)=>{
      socket.join(data);
      console.log(data)
    })
    socket.on('send_jogada',(data)=>{
      socket.to(data.salaJogo).emit('receberJodada',data)
      console.log(data)
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

server.listen(3001, () => {
  console.log("connect servece")
})