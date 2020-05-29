"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("./Utils");
const Result_1 = require("./Result");
class Vote extends Utils.Saveable {
    constructor(name, code) {
        super();
        this.votingUsers = new Map();
        this.choices = [];
        this.results = [];
        this.name = "";
        this.code = "";
        this.maximumPoints = 0;
        this.activeVotingUsers = 0;
        this.activeResult = null;
        this.direction = Direction.INCRESING;
        this.started = false;
        this.name = name;
        this.maximumPoints = 1;
        this.code = code;
        this.direction = Direction.INCRESING;
    }
    addVotingUser(vu) {
        this.votingUsers.set(vu.code, vu);
    }
    addActiveVotingUser() {
        this.activeVotingUsers++;
    }
    setMaximumPoints(value) {
        this.maximumPoints = value;
    }
    setDirection(value) {
        this.direction = value;
    }
    setResultSelected(index, selected) {
        if (index < this.results.length) {
            if (selected) {
                this.activeResult = index;
            }
            else {
                if (index == this.activeResult)
                    this.activeResult = null;
            }
        }
        return this.activeResult;
    }
    getResultSelected() {
        return this.activeResult;
    }
    getDirection() {
        return this.direction;
    }
    getMaximumPoints() {
        return this.maximumPoints;
    }
    addVoteChoice(vc) {
        this.choices.push(vc);
    }
    getVotingUsers() {
        return Array.from(this.votingUsers.values());
    }
    getVotingUser(code) {
        return this.votingUsers.get(code);
    }
    getActiveVotingUsers() {
        return this.activeVotingUsers;
    }
    addResult() {
        this.results.push(new Result_1.Result(this));
        return this.results.length - 1;
    }
    getResult(index) {
        return this.results[index];
    }
    deleteResult(index) {
        if (index > this.activeResult)
            this.activeResult--;
        if (index == this.activeResult)
            this.activeResult = null;
        this.results.splice(index, 1);
    }
    getResults() {
        var array = [];
        this.results.forEach(function (result) {
            array.push(result.getResultsObj());
        });
        return array;
    }
    getVoteChoice(index) {
        return this.choices[index];
    }
    getVoteChoices() {
        return this.choices;
    }
    getCode() {
        return this.code;
    }
    getName() {
        return this.name;
    }
    deleteUser(code) {
        return this.votingUsers.delete(code);
    }
    deleteUsers() {
        this.votingUsers = new Map();
    }
    deleteChoice(index) {
        this.choices.splice(index, 1);
    }
    deleteChoices() {
        this.choices = [];
    }
    getStarted() {
        return this.started;
    }
    startVote() {
        this.started = true;
    }
    votingUserExist(code) {
        return this.votingUsers.has(code);
    }
    getFirstUsers(number) {
        return Array.from(this.votingUsers.values()).slice(0, number);
    }
    load(obj) {
        this.name = obj.name;
        this.maximumPoints = obj.maximumPoints;
        this.code = obj.code;
        this.direction = obj.direction;
        this.started = obj.started;
        this.activeResult = obj.activeResult;
        this.activeVotingUsers = 0;
        let _this = this;
        obj.votingUsers.forEach(function (e) {
            let usr = new VotingUser().load(e);
            if (usr.hasMadeChoice())
                _this.activeVotingUsers++;
            _this.votingUsers.set(usr.code, usr);
        });
        obj.choices.forEach(function (e) {
            _this.choices.push(new VoteChoice().load(e));
        });
        obj.results.forEach(function (e) {
            _this.results.push(new Result_1.Result(_this).load(e));
        });
        return super.load(obj);
    }
    save() {
        let ans = super.save();
        ans.name = this.name;
        ans.maximumPoints = this.maximumPoints;
        ans.code = this.code;
        ans.direction = this.direction;
        ans.started = this.started;
        ans.activeResult = this.activeResult;
        ans.votingUsers = [];
        this.votingUsers.forEach(function (usr) {
            ans.votingUsers.push(usr.save());
        });
        ans.choices = [];
        this.choices.forEach(function (choice) {
            ans.choices.push(choice.save());
        });
        ans.results = [];
        this.results.forEach(function (result) {
            ans.results.push(result.save());
        });
        return ans;
    }
}
exports.Vote = Vote;
var Direction;
(function (Direction) {
    Direction[Direction["INCRESING"] = 0] = "INCRESING";
    Direction[Direction["DECREASING"] = 1] = "DECREASING";
})(Direction || (Direction = {}));
exports.Direction = Direction;
class VotingUser extends Utils.Saveable {
    constructor(code, firstName, lastName, mark) {
        super();
        this.code = "";
        this.firstName = "";
        this.lastName = "";
        this.mark = 0;
        this.pointsChosen = new Map();
        this.code = code;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mark = mark;
    }
    getPoints(name) {
        var _a;
        return (_a = this.pointsChosen.get(name)) !== null && _a !== void 0 ? _a : 0;
    }
    hasMadeChoice() {
        return this.pointsChosen.size > 0;
    }
    setPoints(name, points) {
        this.pointsChosen.set(name, points);
    }
    deletePoints() {
        this.pointsChosen = new Map();
    }
    load(obj) {
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.code = obj.code;
        this.mark = obj.mark;
        this.pointsChosen = new Map();
        var _this = this;
        if (obj.points != null) {
            obj.points.forEach(function (e) {
                _this.pointsChosen.set(e[0], e[1]);
            });
        }
        return super.load(obj);
    }
    save() {
        let ans = super.save();
        ans.firstName = this.firstName;
        ans.lastName = this.lastName;
        ans.code = this.code;
        ans.mark = this.mark;
        ans.points = [];
        this.pointsChosen.forEach(function (value, key) {
            var obj = [key, value];
            ans.points.push(obj);
        });
        return ans;
    }
}
exports.VotingUser = VotingUser;
class VoteChoice extends Utils.Saveable {
    constructor(name, maxMembers) {
        super();
        this.name = "";
        this.maxMembers = 0;
        this.maxMembers = maxMembers;
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getMaxMembers() {
        return this.maxMembers;
    }
    load(obj) {
        this.name = obj.name;
        this.maxMembers = obj.maxMembers;
        return super.load(obj);
    }
    save() {
        let ans = super.save();
        ans.name = this.name;
        ans.maxMembers = this.maxMembers;
        return ans;
    }
}
exports.VoteChoice = VoteChoice;
