import { Vote, VotingUser, VoteChoice, Direction } from "./Vote"
import { Saveable } from "./Utils";

// On suppose plusieurs choses pour que l'algorithme fonctionne :
//
// - Il y a suffisament de places pour que tout le monde ait un résultat.
// - Un candidat ne peut pas donner le même nombre de points à deux filières d'un
//   même créneau (voir vocabulaire.png).



export class Result extends Saveable
{

	private date:string;
	public vote: Vote;
	private choicesPlaces: Map<string, VoteChoiceResult> = new Map();
	private noResult: {firstName:string,lastName:string,code:string}[] = []


	constructor(vote: Vote)
	{
		super();
		this.vote = vote;
		
		var d = new Date();
		this.date = Result.format(d.getDate()) + "/" + Result.format(d.getMonth()) + "/" + d.getFullYear() + " " + Result.format(d.getHours()) + ":" + Result.format(d.getMinutes()) + ":" + Result.format(d.getSeconds())
	}


	public getResultForUser(userCode:string):string
	{
		if(this.contains(this.noResult, userCode))
			return null;

		var array = Array.from(this.choicesPlaces.values());

		for (let i = 0; i < array.length; i++) 
		{
			const element = array[i];
			if(this.contains(element.getMembers(), userCode))
				return element.getChoiceName()	
		}
	}

	private contains(array, userCode)
	{
		for (var i = 0; i < array.length; i++)
		 {
			if (array[i].code === userCode) {
				return true;
			}
		}
		return false
	}

	private static format(string:number):string
	{
		var result = "";

		if((string+"").length == 1)
			result = "0" + string;
		else
			result = string + ""

		return result;
	}

	// Fonction qui permet de connaître la filère où il a le moins de places restantes.
	private placesLibresMin():string
	{
		let choice = null;
		let placesLibresMin:number = Number.MAX_VALUE;

		this.choicesPlaces.forEach(function(value, key)
		{
			if (value.getFreePlaces() > 0 && value.getFreePlaces() < placesLibresMin)
			{
				placesLibresMin = value.getFreePlaces();
				choice = key;
			}
		});
		return choice;
	}

	public getResultsObj()
	{
		var ans:ResultObj = {date:this.date, choices:[], noResults:[]};

		this.choicesPlaces.forEach(function(e)
		{
			var obj:{firstName:string,lastName:string}[] = [];
			e.getMembers().forEach(function(e)
			{
				obj.push({firstName:e.firstName,lastName:e.lastName})
			});
			ans.choices.push({name:e.getChoiceName(),users:obj});
		});

		this.noResult.forEach(function(e)
		{
			ans.noResults.push({firstName:e.firstName,lastName:e.lastName})
		})

		return ans;
	}


	// Affilie les candidats aux filières en commençant par ceux qui ont mis pointsMax à 
	// une filière, classés par gpa, et en descendant jusqu'aux 0.

	public affiliation()
	{
		
		interface UserConsidere
		{
			user:string;
			choicesConsideres:number[];
		}

		let listeCandidatConsidere:UserConsidere[] = [];

		var instance:this = this;
		var voteChoices = this.vote.getVoteChoices();
		var listeCandidats = new Map(this.vote.votingUsers);
		var filledChoicesNumber = 0


		for (let pointConsidere = this.vote.getMaximumPoints(); pointConsidere >= 0; pointConsidere--)
		{

			listeCandidatConsidere = [];

			// Récupère l'indice des candidats qui ont le nombre de points considéré dans une 
			// filière dans la liste de candidats et l'indice de la filière en question, et les 
			// met dans un tableau.

			listeCandidats.forEach(function(user)
			{
				if(!user.hasMadeChoice())
				{
					var vu:VotingUser = instance.vote.getVotingUser(user.code);
					if(vu != null)
						instance.noResult.push({firstName:vu.firstName, lastName:vu.lastName, code:user.code});
					listeCandidats.delete(user.code);
				}
				if(pointConsidere == 0)
					listeCandidatConsidere.push({user:user.code,choicesConsideres:[]});
				else
				{
					var fillieres: number[] = [];

					for (let j = 0; j < voteChoices.length; j++)
					{
						if (user.getPoints(voteChoices[j].getName()) == pointConsidere)
							fillieres.push(j);
					}
					listeCandidatConsidere.push({user:user.code, choicesConsideres:fillieres});
				}
			});

			// Trie le tableau selon le gpa des candidats, celui qui a le meilleur gpa passe d'abord.

			listeCandidatConsidere.sort((a, b) => 
			{
				if(this.vote.getDirection() == Direction.INCRESING)
					return this.vote.getVotingUser(a.user).mark < this.vote.getVotingUser(b.user).mark ? 1 : -1;
				return this.vote.getVotingUser(a.user).mark > this.vote.getVotingUser(b.user).mark ? 1 : -1;
			});

			// On traite différement le cas où le nombre de points est différent de 0 et celui où il est égal à 0:

			// Pour le nombre de points différent de 0, on parcout les candidats ayant mis le nombre de points considéré,
			// et on l'affecte à la filière si elle est pas pleine. Si elle est pleine, on change ele nombre de point à -1
			// (imposisible d'avoir la filière).

			if (pointConsidere != 0)
			{
				var instance = this;

				listeCandidatConsidere.forEach(function(e)
				{
					for(var i=0;i<e.choicesConsideres.length;i++)
					{
						var voteC = instance.vote.getVoteChoice(e.choicesConsideres[i]);
						var cp = instance.choicesPlaces.get(voteC.getName());

						if(cp == null)
							instance.choicesPlaces.set(voteC.getName(), cp = new VoteChoiceResult(instance, e.choicesConsideres[i]))

						if(!cp.isFull())
						{
							listeCandidats.delete(e.user);

							if(!cp.addMember(e.user))
								filledChoicesNumber++;
							break;
						}
					}
				});
			}

			// Arrivé au moment où l'on considère les 0, on place les gens de manière à remplir en priorité la filière 
			// la moins occupée, de sorte qu'à la fin les résultats soient le plus équilibrés possibles. 
			else
			{
				var placesLibresMinVote = this.choicesPlaces.get(this.placesLibresMin());
				
				listeCandidatConsidere.forEach(function(candidat)
				{
					if(placesLibresMinVote  == null)
					{
						var vu:VotingUser = instance.vote.getVotingUser(candidat.user);
						if(vu != null)
							instance.noResult.push({firstName:vu.firstName, lastName:vu.lastName, code:candidat.user});
					}
					else if(!placesLibresMinVote.addMember(candidat.user))
						placesLibresMinVote = instance.choicesPlaces.get(instance.placesLibresMin());
				});
			}

		}
	}

	
	public load(obj: any): this 
	{
		var instance = this;

		this.choicesPlaces = new Map<string,VoteChoiceResult>();

		if(obj.choicesPlaces != null)
        {
			obj.choicesPlaces.forEach(function(e)
			{
				var vcr = new VoteChoiceResult(instance).load(e);
				instance.choicesPlaces.set(vcr.getChoiceName(), vcr);
			});
		}
		this.noResult = obj.noResult;
		this.date = obj.date;
		return super.load(obj);
	}

	public save(): any 
	{
		let ans = super.save();

		ans.choicesPlaces = [];
		this.choicesPlaces.forEach(function(vcr)
		{
			ans.choicesPlaces.push(vcr.save());
		});
		ans.noResult = this.noResult;
		ans.date = this.date;

		return ans;
	}
}

export interface ResultObj
{
	date:string;
	choices:{name:string,users:{firstName:string,lastName:string}[]}[];
	noResults:{firstName:string,lastName:string}[];
}


class VoteChoiceResult extends Saveable
{
	private index:number;
	private members:{firstName:string,lastName:string, code:string}[] = [];
	private result:Result;
	private maxMembers:number;

	constructor(result:Result, index?:number)
	{
		super();
		this.result = result;
		if(index != null)
		{
			this.index = index;
			this.maxMembers = this.result.vote.getVoteChoice(index).getMaxMembers();
		}
	}


	public getMembers()
	{
		return this.members;
	}

	public getChoiceName(): string 
	{
		return this.result.vote.getVoteChoice(this.index).getName();
	}


	public addMember(code:string):boolean
	{
		if(this.members.length > this.maxMembers)
			return false;
		
		var vu:VotingUser = this.result.vote.getVotingUser(code);
		if(vu != null)
			this.members.push({firstName:vu.firstName, lastName:vu.lastName, code:code});

		if(this.members.length < this.maxMembers)
			return true;
		
		return false;
	}

	public isFull():boolean
	{
		return this.members.length >= this.maxMembers;
	}

	public getFreePlaces():number
	{
		return Math.max(this.maxMembers - this.members.length, 0);
	}

	load(obj: any): this 
	{
		this.members = obj.members;
		this.index = obj.index;
		this.maxMembers = this.result.vote.getVoteChoice(this.index).getMaxMembers();
		return super.load(obj);
	}

	save(): any 
	{
		var ans = super.save();

		ans.index = this.index;
		ans.members = this.members;

		return ans;
	}
}