const path = require("path"),
    http = require("http"),
    express = require("express"),
    socketIO = require("socket.io");

const { generateMessage } = require("./utils/messages");

const publicPath = path.join(__dirname, "../public"),
    app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

io.on("connection", (socket) => {
    socket.emit("welcomeMessage", generateMessage("Admin", "Welcome to the chat room!"));

    socket.broadcast.emit("newUserMessage", generateMessage("Admin", "New user joined!"));

    socket.on("createMessage", (message, callback) => {
        io.emit("newMessage", generateMessage(message.from, message.text));
        callback();
    });
});

server.listen(port, () => {
    console.log(`Server is up on port :${port}!`);
});