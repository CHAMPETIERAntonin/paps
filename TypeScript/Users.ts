var fs = require("fs")
import { Vote, VotingUser, VoteChoice } from "./Vote"
import Utils = require("./Utils")

class User extends Utils.Saveable
{
	username: string = "";
	passwordHash: string = "";
	email: string = "";
	code: string = "";

	votes: Vote[] = [];

	votesByCode:Map<string,Vote> = new Map();

	constructor(username?: string, passwordHash?: string, email?: string, code?: string)
	{
		super();
		this.username = username;
		this.passwordHash = passwordHash;
		this.email = email;
		this.code = code;
	}

	addVote(vote: Vote): number
	{
		this.votes.push(vote);
		this.votesByCode.set(vote.getCode(), vote);
		return this.votes.length - 1;
	}


	getVoteByName(name: string): Vote
	{
		for(var i=0;i<this.votes.length;i++)
		{
			if (this.votes[i].getName() == name)
				return this.votes[i];
		}
		return null;
	}



	getVoteByCode(code: string): Vote
	{
		return this.votesByCode.get(code);
	}


	getVoteByIndex(index: number): Vote
	{
		return this.votes[index];
	}

	deleteVote(index: number): void
	{
		this.votesByCode.delete(this.votes[index].getCode());
		this.votes.splice(index, 1);
	}

	save(): any
	{
		let ans = super.save();

		ans.username = this.username;
		ans.passwordHash = this.passwordHash;
		ans.email = this.email;
		ans.code = this.code;

		ans.votes = [];
		this.votes.forEach(function (e)
		{
			ans.votes.push(e.save());
		});

		return ans;
	}

	load(obj: any): this
	{
		this.username = obj.username;
		this.passwordHash = obj.passwordHash;
		this.email = obj.email;
		this.code = obj.code;
		let _this = this;
		obj.votes.forEach(function (e)
		{
			var vote = new Vote().load(e);
			_this.votes.push(vote);
			_this.votesByCode.set(vote.getCode(), vote);

		});
		return super.load(obj);
	}
}


class UsersManager
{
	path: string = "";
	usersByEmail = new Map<string, User>();
	usersByCode = new Map<string, User>();

	constructor(path: string)
	{
		this.path = path;
	}

	saveUsers(): void
	{
		let obj = []
		this.usersByEmail.forEach(function (e)
		{
			obj.push(e.save());
		});
		let jsonObject = JSON.stringify(obj, null, 4)
		fs.writeFile(this.path, jsonObject, function (err)
		{
			if (err)
				console.log("Error while saving user list")
		});
	}

	loadUsers(): void
	{
		this.usersByEmail = new Map();
		this.usersByCode = new Map();

		let _this = this;
		fs.readFile(this.path, function (err, data)
		{
			if (err)
				console.log("Error while saving user list")
			else
			{
				var array = JSON.parse(data)
				for (var i = 0; i < array.length; i++)
				{
					var user = new User().load(array[i]);
					_this.usersByEmail.set(array[i].email, user);
					_this.usersByCode.set(array[i].code, user);
				}
			}
		});

	}



	getUser(email: string): User
	{
		return this.usersByEmail.get(email);
	}


	getUserByCode(code: string): User
	{
		return this.usersByCode.get(code);
	}


	createUser(user: User): void
	{
		this.usersByEmail.set(user.email, user);
		this.usersByCode.set(user.code, user);
	}

	userExist(email: string): boolean
	{
		return this.usersByEmail.has(email);
	}
}

export { User, UsersManager }