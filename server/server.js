const path = require("path"),
    http = require("http"),
    express = require("express"),
    socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public"),
    app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    socket.on("createMessage", (newMessage) => {
        io.emit("newMessage", {
            ...newMessage,
            createdAt: new Date().getTime()
        });
    });
});

server.listen(port, () => {
    console.log(`Server is up on port :${port}!`);
});