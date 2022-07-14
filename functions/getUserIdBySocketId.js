exports.getUserIdBySocketId = (map, socketId) => {
    return Object.entries(map).find(set => set[1] === socketId)[0]
}