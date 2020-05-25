import {app} from "./ExpressApp";
import logger = require("./Logger");


app.listen(8080, function()
{
	logger.vimportant("Listening on port 8080");
})