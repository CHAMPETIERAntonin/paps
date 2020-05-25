var path = require('path');
import Utils = require("./Utils");
import { Router } from "express";

class Page
{
	url: string = "";
	file: string = "";

	constructor(url: string, file: string, getCallback: Utils.RequestFunction = null, postCallback: Utils.RequestFunction = null)
	{
		this.url = url;
		this.file = file;

		if (getCallback != null)
			this.get = getCallback;
		if (postCallback != null)
			this.post = postCallback;
	}

	readonly get: Utils.RequestFunction = (req, res, next) =>
	{
		this.writePageData(req, res);
	}

	readonly post: Utils.RequestFunction = (req, res, next) => { next(); }

	registerRouter(express: { Router: () => Router })
	{
		var router = express.Router();
		if (this.get != undefined)
			router.get("/", this.get.bind(this));
		if (this.post != undefined)
			router.post("/", this.post.bind(this));
		return router;
	}

	protected writePageData: Utils.RequestFunction = (req, res) =>
	{
		res.status(200).sendFile(path.join(Utils.dirname + "/resources/html/" + this.file + ".html"));
	}
}

class RenderedPage extends Page
{
	optionsCallback:Utils.RenderFunction = null;

	constructor(url: string, file: string, optionsCallback: Utils.RenderFunction, getCallback: Utils.RequestFunction = null, postCallback: Utils.RequestFunction = null)
	{
		super(url, file, getCallback, postCallback);
		this.optionsCallback = optionsCallback;
	}

	protected writePageData: Utils.RequestFunction = (req, res) =>
	{
		var options = this.optionsCallback(req, res);
		res.status(200).render(this.file + ".html", options);
	}
}

class SecuredPage extends RenderedPage
{
	readonly get: Utils.RequestFunction = (req, res, next) =>
	{
		if (req.session.connected)
			this.writePageData(req, res)
		else
			res.redirect("/login")
	}
}

class TextPage extends Page
{
	text = "";

	constructor(url: string, text: string)
	{
		super(url, null, null, null);

		this.text = text;
	}

	protected writePageData: Utils.RequestFunction = (req, res) =>
	{
		res.send(this.text);
	}
}


class MultiPage extends Page
{
	readonly get = null;
	readonly post = null;
	writePageData = null;

	private subpages: Page[] = [];
	url: string = "";

	constructor(url: string, subpages: Page[])
	{
		super(null, null);
		this.subpages = subpages;
		this.url = url;
	}


	registerRouter(express: { Router: () => Router })
	{
		var router = express.Router();
		for (let i = 0; i < this.subpages.length; i++)
		{
			if (this.subpages[i].get != undefined)
				router.get(this.subpages[i].url, this.subpages[i].get.bind(this.subpages[i]))

			if (this.subpages[i].post != undefined)
				router.post(this.subpages[i].url, this.subpages[i].post.bind(this.subpages[i]))
		}

		return router;
	}
}


function stringHash(str: string) 
{
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	
	for (i = 0; i < str.length; i++) 
	{
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}


export { Page, RenderedPage, SecuredPage, MultiPage, TextPage, stringHash }