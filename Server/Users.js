"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
const Vote_1 = require("./Vote");
const Utils = require("./Utils");
class User extends Utils.Saveable {
    constructor(username, passwordHash, email, code) {
        super();
        this.username = "";
        this.passwordHash = "";
        this.email = "";
        this.code = "";
        this.votes = [];
        this.votesByCode = new Map();
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.code = code;
    }
    addVote(vote) {
        this.votes.push(vote);
        this.votesByCode.set(vote.getCode(), vote);
        return this.votes.length - 1;
    }
    getVoteByName(name) {
        for (var i = 0; i < this.votes.length; i++) {
            if (this.votes[i].getName() == name)
                return this.votes[i];
        }
        return null;
    }
    getVoteByCode(code) {
        return this.votesByCode.get(code);
    }
    getVoteByIndex(index) {
        return this.votes[index];
    }
    deleteVote(index) {
        this.votesByCode.delete(this.votes[index].getCode());
        this.votes.splice(index, 1);
    }
    save() {
        let ans = super.save();
        ans.username = this.username;
        ans.passwordHash = this.passwordHash;
        ans.email = this.email;
        ans.code = this.code;
        ans.votes = [];
        this.votes.forEach(function (e) {
            ans.votes.push(e.save());
        });
        return ans;
    }
    load(obj) {
        this.username = obj.username;
        this.passwordHash = obj.passwordHash;
        this.email = obj.email;
        this.code = obj.code;
        let _this = this;
        obj.votes.forEach(function (e) {
            var vote = new Vote_1.Vote().load(e);
            _this.votes.push(vote);
            _this.votesByCode.set(vote.getCode(), vote);
        });
        return super.load(obj);
    }
}
exports.User = User;
class UsersManager {
    constructor(path) {
        this.path = "";
        this.usersByEmail = new Map();
        this.usersByCode = new Map();
        this.path = path;
    }
    saveUsers() {
        let obj = [];
        this.usersByEmail.forEach(function (e) {
            obj.push(e.save());
        });
        let jsonObject = JSON.stringify(obj, null, 4);
        fs.writeFile(this.path, jsonObject, function (err) {
            if (err)
                console.log("Error while saving user list");
        });
    }
    loadUsers() {
        this.usersByEmail = new Map();
        this.usersByCode = new Map();
        let _this = this;
        fs.readFile(this.path, function (err, data) {
            if (err)
                console.log("Error while saving user list");
            else {
                var array = JSON.parse(data);
                for (var i = 0; i < array.length; i++) {
                    var user = new User().load(array[i]);
                    _this.usersByEmail.set(array[i].email, user);
                    _this.usersByCode.set(array[i].code, user);
                }
            }
        });
    }
    getUser(email) {
        return this.usersByEmail.get(email);
    }
    getUserByCode(code) {
        return this.usersByCode.get(code);
    }
    createUser(user) {
        this.usersByEmail.set(user.email, user);
        this.usersByCode.set(user.code, user);
    }
    userExist(email) {
        return this.usersByEmail.has(email);
    }
}
exports.UsersManager = UsersManager;
