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
    console.log("New user connected!");

    socket.on("disconnect", () => {
        console.log("User disconnected!");
    });
});

server.listen(port, () => {
    console.log(`Server is up on port :${port}!`);
});