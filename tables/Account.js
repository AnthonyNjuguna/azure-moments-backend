
var table = module.exports = require('azure-mobile-apps').table();


table.insert(function (context) {
    return context.execute();
});

// table.read(function (context) {
//     return context.execute();
// });

// table.read.use(customMiddleware, table.operation);
