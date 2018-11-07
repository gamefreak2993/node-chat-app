import { Users } from "./../server/utils/users";

describe("Users", () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: "1",
            name: "Mihai",
            room: "Gaming"
        }, {
            id: "2",
            name: "Alex",
            room: "Node Course"
        }, {
            id: "3",
            name: "Adi",
            room: "Gaming"
        }];
    });

    it("should add a new user", () => {
        users = new Users();

        const user = {
            id: "123",
            name: "Mihai",
            room: "Gaming"
        };

        const resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it("should remove a user", () => {
        const userId = "1";
        const user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users).toHaveLength(2);
    });

    it("should not remove a user if id does not exist", () => {
        const userId = "99";
        const user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users).toHaveLength(3);
    });

    it("should find a user", () => {
        const userId = "2";
        const user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it("should not find a user if id does not exist", () => {
        const userId = "99";
        const user = users.getUser(userId);

        expect(user).toBeFalsy();
    });

    it("should return names for Gaming room", () => {
        const usersList = users.getAllUsers("Gaming");

        expect(usersList).toEqual(["Mihai", "Adi"]);
    });

    it("should return names for Node Course room", () => {
        const usersList = users.getAllUsers("Node Course");

        expect(usersList).toEqual(["Alex"]);
    });
});