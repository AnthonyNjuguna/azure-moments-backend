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
                            console.log(u);
                            console.log(users);
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
                    console.log(users);
                    getUserFromFriendId(users);
                });
        }

        function getUserFromFriendId(matchingFriendUserIds) {
            var usersTable = context.tables('User');
            console.log("get user from friend id");
            console.log(matchingFriendUserIds);
            usersTable.where(function (arr) {
                    return this.id in arr;
                }, matchingFriendUserIds)
                .read()
                .then(function (users) {
                    console.log(users);
                    res.send(users);
                });
        }
    }
}