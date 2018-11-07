const isRealString = (string) => {
    return typeof string === "string" && string.trim().length > 0 && string.trim().length <= 20;
};

module.exports = {
    isRealString
}