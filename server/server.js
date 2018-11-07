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
            return callback("Name is required!", ["name"]);
        };
        
        if (!isRealString(instance.room)) {
            return callback("Room is required!", ["room"]);
        };

        if (!isRealString(instance.name) && !isRealString(instance.room)) {
            return callback("Name and Room are required!", ["name", "room"]);
        };

        users.users.forEach((user) => {
            if (user.name === instance.name) {
                return callback("Name is already in use!", ["name"]);
            };
        });

        callback();
    });

    socket.on("joined", (instance, callback) => {
        instance.room = instance.room.toLowerCase();

        if (!isRealString(instance.name) || !isRealString(instance.room)) {
            return callback("Name and room are required!");
        };

        users.users.forEach((user) => {
            if (user.name === instance.name) {
                return callback("Name is already in use!");
            };
        });

        socket.join(instance.room);

        users.removeUser(socket.id);
        users.addUser(socket.id, instance.name, instance.room);

        io.to(instance.room).emit("updateUserList", users.getAllUsers(instance.room));

        socket.emit("welcomeMessage", generateMessage("Admin", `Welcome to <${instance.room}>.`));
        socket.broadcast.to(instance.room).emit("newUserMessage", generateMessage("Admin", `<${instance.name}> has joined.`));
        callback();
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