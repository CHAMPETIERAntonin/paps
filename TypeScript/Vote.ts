import Utils = require("./Utils")
import { Result, ResultObj } from "./Result";

class Vote extends Utils.Saveable 
{
	votingUsers = new Map<string, VotingUser>();

	private choices: VoteChoice[] = [];
	private results:Result[] = [];
	private name: string = "";
	private code: string = "";
	private maximumPoints: number = 0;
	private activeVotingUsers: number = 0;
	private activeResult:number = null;
	private direction:Direction = Direction.INCRESING;
	private started:boolean = false;

	constructor(name?: string, code?: string) 
	{
		super();
		this.name = name;
		this.maximumPoints = 1;
		this.code = code;
		this.direction = Direction.INCRESING;
	}

	public addVotingUser(vu: VotingUser): void 
	{
		this.votingUsers.set(vu.code, vu);
	}


	public addActiveVotingUser(): void
	{
		this.activeVotingUsers++;
	}


	public setMaximumPoints(value: number ): void
	{
		this.maximumPoints = value;
	}

	public setDirection(value: Direction ): void
	{
		this.direction = value;
	}

	public setResultSelected(index:number, selected:boolean): number
	{
		if(index < this.results.length)
		{
			if(selected)
			{
				this.activeResult = index;
			}
			else
			{
				if(index == this.activeResult)
					this.activeResult = null;
			}
		}
		return this.activeResult
	}

	public getResultSelected()
	{
		return this.activeResult;
	}

	public getDirection():Direction
	{
		return this.direction;
	}

	public getMaximumPoints(): number 
	{
		return this.maximumPoints;
	}


	public addVoteChoice(vc: VoteChoice): void 
	{
		this.choices.push(vc);
	}


	public getVotingUsers(): VotingUser[] 
	{
		return Array.from(this.votingUsers.values());
	}


	public getVotingUser(code: string): VotingUser 
	{
		return this.votingUsers.get(code);
	}


	public getActiveVotingUsers(): number  
	{
		return this.activeVotingUsers;
	}

	public addResult():number
	{
		this.results.push(new Result(this))
		return this.results.length - 1
	}

	public getResult(index:number):Result
	{
		return this.results[index]
	}

	public deleteResult(index:number):void
	{
		if(index > this.activeResult)
			this.activeResult--;
		if(index == this.activeResult)
			this.activeResult = null;

		this.results.splice(index, 1);
	}

	public getResults():ResultObj[]
	{
		var array:ResultObj[] = []
		this.results.forEach(function(result)
		{
			array.push(result.getResultsObj())
		});
		return array
	}

	public getVoteChoice(index: number): VoteChoice 
	{
		return this.choices[index];
	}


	public getVoteChoices(): VoteChoice[] 
	{
		return this.choices;
	}


	public getCode(): string  
	{
		return this.code;
	}


	public getName(): string 
	{
		return this.name;
	}
	

	public deleteUser(code: string): boolean 
	{
		return this.votingUsers.delete(code);
	}

	public deleteUsers(): void 
	{
		this.votingUsers = new Map();
	}


	public deleteChoice(index: number): void 
	{
		this.choices.splice(index, 1);
	}

	public deleteChoices(): void 
	{
		this.choices = [];
	}

	public getStarted(): boolean  
	{
		return this.started;
	}


	public startVote():void
	{
		this.started = true;
	}


	public votingUserExist(code: string): boolean 
	{
		return this.votingUsers.has(code);
	}


	public getFirstUsers(number: number): VotingUser[] 
	{
		return Array.from(this.votingUsers.values()).slice(0, number);
	}

	public load(obj: any): this 
	{
		this.name = obj.name;
		this.maximumPoints = obj.maximumPoints;
		this.code = obj.code;
		this.direction = obj.direction;
		this.started = obj.started;
		this.activeResult = obj.activeResult;
		this.activeVotingUsers = 0

		let _this = this;

		obj.votingUsers.forEach(function (e) 
		{
			let usr = new VotingUser().load(e);
			if(usr.hasMadeChoice())
				_this.activeVotingUsers++
			_this.votingUsers.set(usr.code, usr);
		});

		obj.choices.forEach(function (e) 
		{
			_this.choices.push(new VoteChoice().load(e));
		});

		obj.results.forEach(function (e) 
		{
			_this.results.push(new Result(_this).load(e));
		});

		return super.load(obj);
	}

	public save(): any 
	{
		let ans = super.save();

		ans.name = this.name;
		ans.maximumPoints = this.maximumPoints;
		ans.code = this.code;
		ans.direction = this.direction;
		ans.started = this.started;
		ans.activeResult = this.activeResult;
		
		ans.votingUsers = [];
		this.votingUsers.forEach(function (usr) 
		{
			ans.votingUsers.push(usr.save());
		});
		ans.choices = [];
		this.choices.forEach(function (choice) 
		{
			ans.choices.push(choice.save());
		});
		ans.results = []
		this.results.forEach(function(result)
		{
			ans.results.push(result.save());
		})
		return ans;
	}

}

enum Direction
{
	INCRESING,
	DECREASING
}

class VotingUser extends Utils.Saveable 
{
	code: string = "";
	firstName: string = "";
	lastName: string = "";
	mark: number = 0;

	pointsChosen = new Map<string, number>();

	constructor(code?: string, firstName?: string, lastName?: string, mark?: number) 
	{
		super();
		this.code = code;
		this.firstName = firstName;
		this.lastName = lastName;
		this.mark = mark;
	}


	getPoints(name: string): number
	{
		return this.pointsChosen.get(name) ?? 0;
	}

	hasMadeChoice(): boolean
	{
		return this.pointsChosen.size > 0;
	}

	setPoints(name: string, points: number): void 
	{
		this.pointsChosen.set(name, points);
	}


	deletePoints(): void 
	{
		this.pointsChosen = new Map();
	}

	load(obj: any): this 
	{
		this.firstName = obj.firstName;
		this.lastName = obj.lastName;
		this.code = obj.code;
		this.mark = obj.mark;

		this.pointsChosen = new Map();

		var _this = this;
		if (obj.points != null) 
		{
			obj.points.forEach(function (e) 
			{
				_this.pointsChosen.set(e[0], e[1]);
			});
		}

		return super.load(obj);
	}

	save(): any 
	{
		let ans = super.save();

		ans.firstName = this.firstName;
		ans.lastName = this.lastName;
		ans.code = this.code;
		ans.mark = this.mark;

		ans.points = [];
		this.pointsChosen.forEach(function (value, key) 
		{
			var obj = [key, value];
			ans.points.push(obj);
		});

		return ans;
	}
}

class VoteChoice extends Utils.Saveable
{
	private name: string = "";
	private maxMembers: number = 0;


	constructor(name?: string, maxMembers?: number) 
	{
		super();
		this.maxMembers = maxMembers;
		this.name = name;
	}


	public getName(): string  {
		return this.name;
	}
	public getMaxMembers(): number  {
		return this.maxMembers;
	}

	load(obj: any): this 
	{
		this.name = obj.name;
		this.maxMembers = obj.maxMembers;
		return super.load(obj);
	}

	save(): any 
	{
		let ans = super.save();

		ans.name = this.name;
		ans.maxMembers = this.maxMembers;

		return ans;
	}
}

export { Vote, VotingUser, VoteChoice, Direction};