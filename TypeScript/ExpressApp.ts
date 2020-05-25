import express = require("express");
var fs = require("fs");
var session = require('express-session');
var Readable = require('stream').Readable
import {Page, RenderedPage, SecuredPage, MultiPage, TextPage, stringHash} from "./Page";
import {Vote, VotingUser, VoteChoice, Direction} from "./Vote";
import {User, UsersManager} from "./Users";
import {renderEngine} from "./RenderEngine";
import logger = require("./Logger");
import { Result } from "./Result";
var Utils = require("./Utils");



var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'MFDSDERFDSZqdcfdezsd',saveUninitialized:false,resave:false }));

app.use("*/css",express.static(Utils.dirname + "/resources/css", {redirect: false}));
app.use("*/js",express.static(Utils.dirname + "/resources/js", {redirect: false}));
app.use("*/images",express.static(Utils.dirname + "/resources/images", {redirect: false}));
app.use("*/svg",express.static(Utils.dirname + "/resources/svg", {redirect: false}));

app.engine("html", renderEngine);
app.set("views", "./resources/html")
//app.set("view engine", "paps")

var UM = new UsersManager("users.json");
UM.loadUsers();

/* var pageList = [
	new Page("/", "Home-Page"),
	new Page("/index", "Index"), 
	new Page("/signup", "Login/admin-signup.html",null,
		function(req, res, next)
		{
			let user = UM.getUser(req.body.email);
			if(user != undefined)
			{
				if(user.passwordHash === req.body._password)
				{
					req.session.connected = true;
					req.session.email = req.body.email;
					logger.info("User Connected : " + req.body.email)
				}
			}
			res.status(204).send();
		}),
	new Page("/createaccount", "", function(req, res, next){res.redirect("/login");}, function(req, res, next)
		{
			if(!UM.userExist(req.body.email))
			{
				let user = new User(req.body.username,req.body._password, req.body.email);
				UM.createUser(user);
				logger.info("User created : " + req.body.email);
				
			}
			else
			{
				logger.debug("Email already used : " + req.body.email);
			}
			res.status(204).send();
		}),
	new RenderedPage("/main", "Main", function(req,res)
		{
			if(req.session.connected)
			{
				let user = UM.getUser(req.session.email); 
				return {username:user.username, email:user.email};
			}
		}),
	new Page("/logout","",function(req, res, next)
		{
			delete req.session.connected;
			delete req.session.email;
			res.redirect("/login");
		}),
	new Page("/uploadTest","",null,function(req,res,next)
		{
			logger.debug(Object.keys(req.body.list));
			res.status(204).send();
		})
	] */

var pageList = 
[
	new RenderedPage("/", "Home-Page", optionCallback),
	new RenderedPage("/info", "misc/information", optionCallback),
	new RenderedPage("/contact","misc/contact", optionCallback),
	new RenderedPage("/licence","misc/licence", optionCallback),
	new RenderedPage("/thanks","misc/thanks", optionCallback),
	new RenderedPage("/signup", "login-signup/admin-signup", optionCallback, null,  function(req, res, next)
		{
			let ans = {correctEmail:true, correctPassword:true, correctPasswordConfirm:true, correctLicence:true, redirect:null};
			let userCanBeCreated = true;
			if(req.body.email.length <=1 || UM.userExist(req.body.email))
			{
				ans.correctEmail = false;
				userCanBeCreated = false;
			}
			if(req.body._password.length < 3 || req.body._password.length > 15)
			{
				ans.correctPassword = false;
				userCanBeCreated = false;
			}
			if(req.body._password != req.body._passwordConfirm)
			{
				ans.correctPasswordConfirm = false;
				userCanBeCreated = false;
			}
			if(!req.body.licence)
			{
				ans.correctLicence = false;
				userCanBeCreated = false;
			}
			if(userCanBeCreated)
			{
				let user = new User(req.body.username,req.body._password, req.body.email, createRandomString(10));
				UM.createUser(user);
				UM.saveUsers();
				logger.info("User created : " + req.body.email);
				req.session.connected = true;
				req.session.email = req.body.email;
				req.session.username = user.username;
				ans.redirect = "/admin/panel";
				res.json(ans);
			}
			else
			{
				logger.debug("Wrong request : " + req.body.email);
				res.json(ans);
			}
		}),
	new RenderedPage("/login", "login-signup/admin-login", optionCallback, null, function(req, res, next)
		{
			let user = UM.getUser(req.body.email);
			let ans = {correctLogin:true, redirect:null}
			
			if(user == undefined)
				ans.correctLogin = false
			else
			{
				if(user.passwordHash === req.body._password)
				{
					req.session.connected = true;
					req.session.email = req.body.email;
					req.session.username = user.username;
					ans.redirect = "/admin/panel";
					
					logger.debug("User Connected : " + req.body.email);
				}
				else
					ans.correctLogin = false;
			}
			res.json(ans);
		}),
	new SecuredPage("/connected", "login-signup/connected", function(req,res)
		{
			if(req.session.connected)
			{
				let user = UM.getUser(req.session.email);
				return {options:{username:user.username, email:user.email}};
			}
		}),
	new Page("/logout","",function(req, res, next)
		{
			delete req.session.connected;
			delete req.session.email;
			delete req.session.username;
			res.redirect("/login");
		}),
	new RenderedPage("/test", "test", optionCallback),
		new MultiPage("/admin", 
		[
			new RenderedPage("/panel", "admin/admin-welcome", optionCallback),
			new RenderedPage("/vote/:index/modify", "admin/admin-vote-modification", optionCallback),
			new RenderedPage("/vote/:index/info", "admin/admin-vote-info", optionCallback),
			new RenderedPage("/vote/:index", "admin/admin-control-panel", optionCallback),
			new RenderedPage("/vote/:indexVote/results/:indexResult", "admin/admin-results", optionCallback),
			new Page("/edit/:index", "admin/admin-vote-edit", function(req, res, next)
				{
					this.writePageData(req,res);
				}),
			new Page("/uploadVotingUsers/:index", "", undefined, function(req, res, next)
				{
					let ans = {number:0}
					
					if(req.session.connected)
					{						
						let user = UM.getUser(req.session.email);
						req.body.votingUsers.forEach(function(e)
						{
							if(!isNaN(parseInt(e[2])))
							{
								user.getVoteByIndex(req.params.index as unknown as number).addVotingUser(new VotingUser(createRandomString(10), e[0], e[1], parseInt(e[2])));
								ans.number += 1;
							}
						});
							
						UM.saveUsers();
						res.json(ans);
					}
					
					next();
				}),
			new Page("/uploadChoices/:index", "", undefined, function(req, res, next)
				{
					let ans = {number:0}
					
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						req.body.choices.forEach(function(e)
						{
							if(!isNaN(parseInt(e[1])))
							{
								user.getVoteByIndex(req.params.index as unknown as number).addVoteChoice(new VoteChoice(e[0], parseInt(e[1])));
								ans.number += 1;
							}
						});
						
						UM.saveUsers();						
						res.json(ans);
					}

				}),
			new Page("/getFirstUsers/:index", "", function(req, res, next)
				{					
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						let obj = {votingUsers: []};
						
						let vote = user.getVoteByIndex(req.params.index as unknown as number)
						
						vote.getFirstUsers(100).forEach(function(element)
						{
							obj.votingUsers.push([element.firstName, element.lastName, element.mark, user.code + "-" + vote.getCode() + "-" + element.code]);
						});
						
						res.json(obj);
					}
				}),
			new Page("/getBasicInfos/:index", "", function(req, res, next)
				{
					var ans = {correct:false, started:null, maximumPoints:null, direction:null};

					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.index as unknown as number);

							if(vote != undefined)
							{
								ans.correct = true;
								ans.started = vote.getStarted();
								ans.maximumPoints = vote.getMaximumPoints();
								ans.direction = vote.getDirection();
							}
						}
					}

					res.json(ans);
				}),
			new Page("/getChoices/:index", "", function(req, res, next)
				{
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						let obj = {choices: []};
						
						user.getVoteByIndex(req.params.index as unknown as number).getVoteChoices().forEach(function(element)
						{
							obj.choices.push([element.getName(), element.getMaxMembers()]);
						});
						
						res.json(obj);
					}
				}),
			new Page("/createVote", "", undefined, function(req, res, next)
				{
					// new RenderedPage("/createVote", "admin/admin-vote-creation", optionCallback, null, function(req, res, next)
					let ans = {correctName:true, redirect: null}
					
					if(req.session.connected == true)
					{
						let user = UM.getUser(req.session.email);
						if(user != undefined)
						{
							if(user.getVoteByName(req.body.name) != null)
								ans.correctName = false;
							
							// let points = parseInt(req.body.points);
							
							// if(!(points != NaN && points > 0))
							// 	ans.correctPoints = false;
							
							// if(ans.correctName && ans.correctPoints)
							if(ans.correctName)
							{
								// let vote = new Vote(req.body.name, createRandomString(4), req.body.croissant ? Direction.INCRESING:Direction.DECREASING);
								let vote = new Vote(req.body.name, createRandomString(4));
								ans.redirect = "/admin/vote/" +  + user.addVote(vote) +"/modify";
								UM.saveUsers();
							}
						}
						else
							ans.redirect = "/login";
					}				
					else
						ans.redirect = "/login";
						
					res.json(ans);
				}),
			new Page("/editVote/:index", "", undefined, function(req, res, next)
				{
					var ans = {correctPoints:true, correctDirection:true, correctLogin:false};

					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.index as unknown as number);
						
							if(vote != undefined)
							{
								ans.correctLogin = true;

								let points = parseInt(req.body.maximumPoints);
							
								if(!(points != NaN && points > 0))
									ans.correctPoints = false;

								if(req.body.direction != 0 && req.body.direction != 1)
									ans.correctDirection = false;

								if(ans.correctDirection && ans.correctPoints)
								{
									vote.setDirection(req.body.direction);
									vote.setMaximumPoints(points);

									UM.saveUsers();
								}
							}
						}
					}

					res.json(ans);
				}),
			new Page("/getCurrentVotes", "", function(req, res, next)
				{
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						if(user != undefined)
						{
							let json = [];
							for(let i=0;i<user.votes.length;i++)
							{
								let obj = {};
								
								let numMembers = user.votes[i].votingUsers.size;
								obj["name"] = user.votes[i].getName();
								obj["numberOfMembers"] = numMembers;
								obj["percentage"] = numMembers == 0 ? 0 : ((user.votes[i].getActiveVotingUsers() / user.votes[i].votingUsers.size) * 100.0).toFixed(2);
								json.push(obj);
							}
							
							res.json(json);
						}
					}
					next();
				}),
			new Page("/supprUser/:index", "", undefined, function(req, res, next)
				{
					var obj = {correct:false}
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						if(user != undefined)
						{
							if(req.body.userCode != "all")
							{
								var userCode:string = req.body.userCode.substring(16, 26);

								var result:boolean = user.getVoteByIndex(req.params.index as unknown as number).deleteUser(userCode);
								UM.saveUsers();
								obj.correct = result;
							}
							else
							{
								user.getVoteByIndex(req.params.index as unknown as number).deleteUsers();
								UM.saveUsers();
								obj.correct = true;
							}
						}
					}
					res.json(obj);
				}),
			new Page("/supprChoice/:index", "", undefined, function(req, res, next)
				{
					var ans = {correct:false};
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						if(user != undefined)
						{
							if(req.body.choiceIndex != "all")
							{
								user.getVoteByIndex(req.params.index as unknown as number).deleteChoice(req.body.choiceIndex);
								UM.saveUsers();
								ans.correct = true;
							}
							else
							{
								user.getVoteByIndex(req.params.index as unknown as number).deleteChoices();
								UM.saveUsers();
								ans.correct = true;
							}
						}
					}
					res.json(ans);
				}),
			new Page("/supprVote", "", undefined, function(req, res, next)
				{
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							user.deleteVote(req.body.index);
							UM.saveUsers();
							res.json({correct:true});
						}
					}
					next();
				}),
			new Page("/downloadUsers/:index", "", function(req, res, next)
				{
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							let csv = "NOM;Prénom;Note;Identifiant\n";
							let vote = user.getVoteByIndex(req.params.index as unknown as number)
							vote.getVotingUsers().forEach(function(subuser)
							{								
								csv += subuser.firstName + ";" + subuser.lastName + ";" + subuser.mark + ";\"" +  user.code + "-" + vote.getCode() + "-" + subuser.code + "\"\n";
							});
							
							var stream = new Readable();
							stream.push(csv);
							stream.push(null);
							res.attachment('Identifiants.csv');
							stream.pipe(res);
						}
					}
				}),
			new Page("/startResults/:index","",undefined, function(req, res, next)
				{
					var ans = {correct:false, result:null}
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.index as unknown as number);
							var result = vote.getResult(vote.addResult());
							result.affiliation();
							UM.saveUsers();
							ans.correct = true;
							ans.result = result.getResultsObj()
						}
					}
					res.json(ans);
				}),
			new Page("/vote/:indexVote/getResults/:indexResult", "", function(req, res, next)
				{
					var ans = {correct:false, results:{}}
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.indexVote as unknown as number);

							if(vote != undefined)
							{
								ans.results = vote.getResult(req.params.indexResult as unknown as number).getResultsObj();
								ans.correct = true;
							}
						}
					}
					res.json(ans);
				}),
			new Page("/vote/:index/getAllResults", "", function(req, res, next)
				{
					var ans = {correct:false, results:[], started:false, indexSelected:null}
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.index as unknown as number);

							if(vote != undefined)
							{
								ans.results = vote.getResults();
								ans.started = vote.getStarted();
								ans.indexSelected = vote.getResultSelected()
								ans.correct = true;
							}
						}
					}
					res.json(ans);
				}),
			new Page("/vote/:indexVote/supprResult/:indexResult", "", undefined, function(req, res, next)
				{
					var ans = {correct:false}
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.indexVote as unknown as number);

							if(vote != undefined)
							{
								vote.deleteResult(req.params.indexResult as unknown as number);
								UM.saveUsers();
								ans.correct = true;
							}
						}
					}
					res.json(ans);
				}),
			new Page("/startVote/:index", "", undefined, function(req,res,next)
			{
				var ans = {correct:false}
				if(req.session.connected)
				{
					let user = UM.getUser(req.session.email);
					
					if(user != undefined)
					{
						var vote = user.getVoteByIndex(req.params.index as unknown as number);

						if(vote != undefined)
						{
							vote.startVote();
							UM.saveUsers();

							ans.correct = true;
						}
					}
				}

				res.json(ans);
				}),
			new Page("/vote/:voteIndex/setSelectedResult/:resultIndex", "", undefined, function(req, res, next)
				{
					var ans = {correct:false, indexSelected: null}
					if(req.session.connected)
					{
						let user = UM.getUser(req.session.email);
						
						if(user != undefined)
						{
							var vote = user.getVoteByIndex(req.params.voteIndex as unknown as number);
	
							if(vote != undefined)
							{
								var resultIndex = parseInt(req.params.resultIndex);
								if(resultIndex != NaN && resultIndex >= 0)
								{
									ans.correct = true;
									ans.indexSelected = vote.setResultSelected(resultIndex, req.body.selected);
									UM.saveUsers();
								}
							}
						}
					}
					res.json(ans);
				})
		]),
	new MultiPage("/user", 
		[
			new RenderedPage("/:id/panel", "user/user-vote-stars", optionCallback, null, function(req, res)
				{
					var adminCode = req.params.id.substring(0, 10);
					var voteCode = req.params.id.substring(11, 15);
					var userCode = req.params.id.substring(16, 26);
					
					var ans = {errors:true};
					
					var admin = UM.getUserByCode(adminCode);
					
					if(admin == undefined)
						return res.json(ans);
						
					var vote = admin.getVoteByCode(voteCode);
					
					if(vote == undefined)
						return res.json(ans);
					
					var user = vote.getVotingUser(userCode);

					if(user == undefined)
						return res.json(ans);
					
					var points = 0;
					req.body.choices.forEach(function(e)
					{
						if(e[1] < 0)
							return res.json(ans);
						points += e[1];
					});
					if(points > vote.getMaximumPoints())
						return res.json(ans);

					ans.errors = false;

					user.deletePoints();
					req.body.choices.forEach(function(e)
					{
						user.setPoints(e[0], e[1]);
					});
					
					vote.addActiveVotingUser();

					UM.saveUsers();

					res.json(ans);
					
				}),
			new RenderedPage("/", "login-signup/user", optionCallback, null, function(req, res, next)
				{
					var ans = {correct:false, redirect:null};
					
					var adminCode = req.body.id.substring(0, 10);
					var voteCode = req.body.id.substring(11, 15);
					var userCode = req.body.id.substring(16, 26);
					
					
					var admin = UM.getUserByCode(adminCode);
					
					if(admin == undefined)
						return res.json(ans);
						
					var vote = admin.getVoteByCode(voteCode);
					
					// if(vote == undefined)
					if(vote == undefined || !vote.getStarted())
						return res.json(ans);
									
					if(!vote.votingUserExist(userCode))
						return res.json(ans);
					
					ans.correct = true;
					ans.redirect = "/user/" + req.body.id + "/panel";
					res.json(ans);
				}),
			new RenderedPage("/:id/results", "user/user-result", optionCallback),
			new Page("/getUserInfos", "", undefined, function(req, res, next)
				{
					var ans = {choices:[], correct:false, redirect:"/user", points:0, maxPoints:0};
					
					var adminCode = req.body.id.substring(0, 10);
					var voteCode = req.body.id.substring(11, 15);
					var userCode = req.body.id.substring(16, 26);
					
					
					var admin = UM.getUserByCode(adminCode);
					
					if(admin == undefined)
						return res.json(ans);
						
					var vote = admin.getVoteByCode(voteCode);
					
					// if(vote == undefined)
					if(vote == undefined || !vote.getStarted())
						return res.json(ans);

					var user = vote.getVotingUser(userCode);
					
					if(user == undefined)
						return res.json(ans);
					
					ans.correct = true;
					ans.maxPoints = vote.getMaximumPoints();
					ans.redirect = null;
					
					vote.getVoteChoices().forEach(function(e, index)
					{
						var obj = [e.getName(), user.getPoints(e.getName())];
						ans.choices.push(obj);
					});
					ans.points = vote.getMaximumPoints();

					res.json(ans);
				}),
			new Page("/:id/getResults", "", function(req, res, next)
				{
					var adminCode = req.params.id.substring(0, 10);
					var voteCode = req.params.id.substring(11, 15);
					var userCode = req.params.id.substring(16, 26);
					
					var ans = {correct:false, selected:false, resultName:null};
					
					var admin = UM.getUserByCode(adminCode);
					
					if(admin == undefined)
						return res.json(ans);
						
					var vote = admin.getVoteByCode(voteCode);
					
					if(vote == undefined)
						return res.json(ans);
					
					var user = vote.getVotingUser(userCode);

					if(user == undefined)
						return res.json(ans);
					

					ans.correct = true;
					if(vote.getResultSelected() != null)
					{
						ans.selected = true;
						ans.resultName = vote.getResult(vote.getResultSelected()).getResultForUser(userCode);
					}

					res.json(ans);
					
				})
		])
]


function optionCallback(req: express.Request, res: express.Response) : any
{
	if(req.session.connected)
		return {options:{email:req.session.email, username:req.session.username, role:"Administrateur"}, skeleton:Utils.dirname + "/resources/html/skeletonConnected.html"};
	else
		return {skeleton:Utils.dirname + "/resources/html/skeletonNotConnected.html"};
}


function registerPages() : void
{
	for(var i=0;i<pageList.length;i++)
	{
		app.use(pageList[i].url, pageList[i].registerRouter(express))
	}
}

registerPages();

app.use(function(req, res, next)
{
	if(!res.headersSent)
		res.render(Utils.dirname + "/resources/html/misc/404.html", optionCallback(req,res));
});

function createRandomString(length: number) : string
{
	let result = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(let i=0;i<length;i++) 
	{
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
   return result;
}

//http://localhost:8080/

// app.get("*", function(req:express.Request, res:express.Response) : void
// {
// 	res.send("Quoi ??");
// });

export {app}
