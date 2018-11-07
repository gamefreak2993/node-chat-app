const path = require("path"),
    http = require("http"),
    express = require("express"),
    socketIO = require("socket.io");

const { generateMessage } = require("./utils/messages"),
    { isRealString } = require("./utils/validation"),
    { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "../public"),
    app = express(),
    server = http.createServer(app),
    io = socketIO(server),
    port = process.env.PORT || 3000,
    users = new Users();

app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

io.on("connection", (socket) => {
    socket.on("login", (instance, callback) => {
        if (!isRealString(instance.name)) {
            callback("Name is required!", ["name"]);
        } else if (!isRealString(instance.room)) {
            callback("Room is required!", ["room"]);
        } else if (!isRealString(instance.name) && !isRealString(instance.room)) {
            callback("Room is required!", ["name", "room"]);
        } else {
            callback();
        };
    });

    socket.on("joined", (instance, callback) => {
        if (!isRealString(instance.name) || !isRealString(instance.room)) {
            callback("Name and room are required!");
        } else {
            socket.join(instance.room);

            users.removeUser(socket.id);
            users.addUser(socket.id, instance.name, instance.room);

            io.to(instance.room).emit("updateUserList", users.getAllUsers(instance.room));

            socket.emit("welcomeMessage", generateMessage("Admin", `Welcome to <${instance.room}>.`));
            socket.broadcast.to(instance.room).emit("newUserMessage", generateMessage("Admin", `<${instance.name}> has joined.`));
            callback();
        };
    });

    socket.on("createMessage", (message, callback) => {
        const user = users.getUser(socket.id);

        if (!isRealString(message.text) && !user) {
            callback("Text is required!");
        } else {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
            callback();
        };
    });

    socket.on("disconnect", () => {
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("updateUserList", users.getAllUsers(user.room));

            io.to(user.room).emit("newMessage", generateMessage("Admin", `<${user.name}> has left!`));
        };
    });
});

server.listen(port, () => {
    console.log(`Server is up on port :${port}!`);
});