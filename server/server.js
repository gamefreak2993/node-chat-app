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
    socket.emit("welcomeMessage", {
        text: "Welcome to the chat room!",
        from: "Admin",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit("newUserMessage", {
        text: "A new user has joined!",
        from: "Admin",
        createdAt: new Date().getTime()
    });

    socket.on("createMessage", (message) => {
        io.emit("newMessage", {
            ...message,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit("newMessage", {
        //     ...message,
        //     createdAt: new Date().getTime()
        // });
    });
});

server.listen(port, () => {
    console.log(`Server is up on port :${port}!`);
});