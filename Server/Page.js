"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
const Utils = require("./Utils");
class Page {
    constructor(url, file, getCallback = null, postCallback = null) {
        this.url = "";
        this.file = "";
        this.get = (req, res, next) => {
            this.writePageData(req, res);
        };
        this.post = (req, res, next) => { next(); };
        this.writePageData = (req, res) => {
            res.status(200).sendFile(path.join(Utils.dirname + "/resources/html/" + this.file + ".html"));
        };
        this.url = url;
        this.file = file;
        if (getCallback != null)
            this.get = getCallback;
        if (postCallback != null)
            this.post = postCallback;
    }
    registerRouter(express) {
        var router = express.Router();
        if (this.get != undefined)
            router.get("/", this.get.bind(this));
        if (this.post != undefined)
            router.post("/", this.post.bind(this));
        return router;
    }
}
exports.Page = Page;
class RenderedPage extends Page {
    constructor(url, file, optionsCallback, getCallback = null, postCallback = null) {
        super(url, file, getCallback, postCallback);
        this.optionsCallback = null;
        this.writePageData = (req, res) => {
            var options = this.optionsCallback(req, res);
            res.status(200).render(this.file + ".html", options);
        };
        this.optionsCallback = optionsCallback;
    }
}
exports.RenderedPage = RenderedPage;
class SecuredPage extends RenderedPage {
    constructor() {
        super(...arguments);
        this.get = (req, res, next) => {
            if (req.session.connected)
                this.writePageData(req, res);
            else
                res.redirect("/login");
        };
    }
}
exports.SecuredPage = SecuredPage;
class TextPage extends Page {
    constructor(url, text) {
        super(url, null, null, null);
        this.text = "";
        this.writePageData = (req, res) => {
            res.send(this.text);
        };
        this.text = text;
    }
}
exports.TextPage = TextPage;
class MultiPage extends Page {
    constructor(url, subpages) {
        super(null, null);
        this.get = null;
        this.post = null;
        this.writePageData = null;
        this.subpages = [];
        this.url = "";
        this.subpages = subpages;
        this.url = url;
    }
    registerRouter(express) {
        var router = express.Router();
        for (let i = 0; i < this.subpages.length; i++) {
            if (this.subpages[i].get != undefined)
                router.get(this.subpages[i].url, this.subpages[i].get.bind(this.subpages[i]));
            if (this.subpages[i].post != undefined)
                router.post(this.subpages[i].url, this.subpages[i].post.bind(this.subpages[i]));
        }
        return router;
    }
}
exports.MultiPage = MultiPage;
function stringHash(str) {
    var hash = 0, i, chr;
    if (str.length === 0)
        return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
exports.stringHash = stringHash;
