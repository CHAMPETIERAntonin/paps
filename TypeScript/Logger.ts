export var log = function(msg)
{
	console.log(msg);
}

export var info = function(msg)
{
	console.log("[INFO] " + msg + "\x1b[0m");
}

export var important = function(msg)
{
	console.log("\x1b[33m[I] " + msg + "\x1b[0m");
}
export var vimportant = function(msg)
{
	console.log("\x1b[35m[VI] " + msg + "\x1b[0m");
}

export var debug = function(msg)
{
	console.log("\x1b[36m[DEBUG] " + msg + "\x1b[0m")
}