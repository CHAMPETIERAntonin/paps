"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressApp_1 = require("./ExpressApp");
const logger = require("./Logger");
ExpressApp_1.app.listen(8080, function () {
    logger.vimportant("Listening on port 8080");
});
