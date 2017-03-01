module.exports = {
    get: function (req, res, next) {
        var context = req.azureMobile;
        var friendshipsTable = context.tables('Friendship');

        if (req.query.getFriends == "true") {
            friendshipsTable.where({
                    userId: req.query.userId,
                    accepted: true
                })
                .select("friendId")
                .read()
                .then(function (u) {
                    friendshipsTable.where({
                            friendId: req.query.userId,
                            accepted: true
                        })
                        .select("userId")
                        .read()
                        .then(function (users) {
                            getUserFromFriendId(u.concat(users));
                        });
                });
        } else {
            friendshipsTable.where({
                    friendId: req.query.userId,
                    accepted: false
                })
                .select("userId")
                .read()
                .then(function (users) {
                    getUserFromFriendId(users);
                });
        }

        function getUserFromFriendId(matchingFriendUserIds) {
            var usersTable = context.tables('User');
            console.log("get user from friend id");
            usersTable.where(function (arr) {
                    return this.id in arr;
                }, matchingFriendUserIds)
                .read()
                .then(function (users) {
                    res.send(users);
                });
        }
    }
}