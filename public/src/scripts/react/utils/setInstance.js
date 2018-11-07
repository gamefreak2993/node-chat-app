export const setInstance = (component) => {
    const urlString = window.location.href,
    url = new URL(urlString);

    const name = url.searchParams.get("name"),
        room = url.searchParams.get("room");

    component.setState({instance: {name, room}});
};