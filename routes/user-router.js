const Player = require("../models/Player"),
	User = require("../models/User"),
	passport = require("passport"),
	isEqual = require("lodash/isEqual"),
	moment = require("moment"),
	isAuth = require("../config/middleware/isAuth"),
	userStatus = (req) => {
		return {
			loggedOut: req.user ? false : true,
			loggedIn: req.user ? true : false
		};
	},
	serverError = (res) => res.redirect("/server-error");

module.exports = (app) => {
	app.post("/api/register", async (req, res) => {
		let { email, username, password, password2, token, characterName } = req.body;
		console.log(req.body);
		let playerData = await new Player({}).checkToken(token, characterName);
		console.log(playerData);

		if (!playerData) {
			req.flash("errorMsg", "Token or player name does not match. Please double check.");
			// If any field is empty
		} else if (username === "" || password === "" || password2 === "") {
			req.flash("errorMsg", "Please fill in all required fields.");
			res.json({ redirectURL: "/register" });
			// Passwords match
		} else if (password === password2) {
			let user = new User({
				username: username,
				password: password,
				email: email,
				characterName: playerData.name,
				characterId: playerData._id
			});
			// Check for usernames
			let response = await user.checkUsernameTaken();
			// If username taken
			if (response) {
				req.flash("errorMsg", "Username already taken!");
				res.json({ redirectURL: "/register" });
				// Username not taken
			} else {
				let addUser = await user.registerUser();
				await playerData.dbUpdate({ webUserId: user._id });
				console.log(addUser);
				if (addUser.insertedCount === 1) {
					req.flash("successMsg", `Welcome, player ${user.username}!`);
					res.json({ redirectURL: "/login" });
				} else {
					req.flash("errorMsg", "Could not register you. Please try again alter.");
					res.json({ redirectURL: "/users/register" });
				}
			}
		} else {
			req.flash("errorMsg", "Passwords do not match.");
			res.json({ redirectURL: "/register" });
		}
	});

	// Login handle
	app.post(
		"/api/login",
		passport.authenticate("local", {
			successRedirect: "/inventory",
			failureRedirect: "/login",
			failureFlash: true
		}),
		(req, res) => {
			if (req.body.rememberMe) {
				req.session.cookie.originalMaxAge = 6000 * 60 * 24 * 7 * 26;
			} else {
				req.session.cookie.originalMaxAge = 6000 * 60 * 24;
			}
		}
	);

	// Most important page! Lets user see and update their data
	app.get("/inventory", async (req, res) => {
		if (!req.user) {
			req.flash("errorMsg", "Must log in to see inventory.");
			res.redirect("/login");
		} else {
			try {
				let player = await new Player({}).find({ webUserId: req.user });
				console.log(player);
				res.render("inventory", {
					player: player,
					userStatus: userStatus(req)
				});
			} catch (error) {
				console.trace(error);
				serverError(res);
			}
		}
	});

	// Update route. Also used for deleting of single items bc it uses the same logic
	app.put("/inventory", isAuth, async (req, res) => {
		if (!req.user) {
			req.flash("Please login again.");
			res.json({ redirectURL: "/login" });
		}
		try {
			// Create Player instance and sync it with database
			let player = await new Player({}).sync(null, { webUserId: req.user });
			// Add new logs from front-end to the player instance
			player.changelog.push(req.body.changelog);
			// Destructure the inventory Object from request body
			let { gold, silver, copper, platinum, electrum, potions, weapons, misc } = req.body.inventory;
			// Fix the numbers...
			// HTTP prot only sends strings, so you must convert strings to numbers
			function correctTypes(category) {
				console.log(category);
				if (!category || category === "") {
					return [
						{
							name: "none",
							quantity: 0
						}
					];
				} else {
					return category.map((item) => {
						return {
							name: item.name,
							quantity: parseInt(item.quantity)
						};
					});
				}
			}
			// Just running parseInt and correctTypes to fix the stupid numbers first...
			const inventory = {
				gold: parseInt(gold),
				silver: parseInt(silver),
				copper: parseInt(copper),
				platinum: parseInt(platinum),
				electrum: parseInt(electrum),
				potions: correctTypes(potions),
				weapons: correctTypes(weapons),
				misc: correctTypes(misc)
			};

			// Case that changes were detected
			if (!isEqual(inventory, player.inventory)) {
				let response = await player.dbUpdate({
					inventory: inventory,
					changelog: player.changelog,
					lastUpdated: moment().format()
				});
				// Database responds positively
				if (response.modifiedCount === 1) res.status(200).json({ message: "Success!", status: 200 }).end();
				// Database fails to update for some reason
				else res.status(404).json({ message: "Could not update player. Please go back to Discord and try there first.", status: 404 });
			}
			// Case that no changes were detected
			else {
				res.status(202).json({ message: "No changes detected!", status: 202 }).end();
			}
		} catch (error) {
			console.error(error);
			res.json({ redirectURL: "/server-error", message: "Internal server error. Please try again later.", status: 500 }).end();
		}
	});
	app.get("/logout", (req, res) => {
		req.logout();
		req.flash("successMsg", "You are logged out.");
		res.redirect("/login");
	});
	app.post("/api/add-character", async (req, res) => {
		try {
			if (!req.user) {
				req.flash("errorMsg", "Please login to add new character.");
				res.redirect("/login");
			} else {
				if (!req.body.token || !req.body.characterName) {
					req.flash("errorMsg", "Both fields are required.");
					res.redirect("/add-character");
					return;
				}
				let playerData = await new Player({}).checkToken(req.body.token.trim(), req.body.characterName.trim());
				if (playerData) {
					let user = new User({ id: req.user });
					let results = await user.dbRead();
					user.characters = results.characters;
					let addedCharacter = {
						characterName: playerData.name,
						characterId: playerData._id
					};
					let checkCharacterAlreadyExists = user.characters.filter((c) => isEqual(c, addedCharacter));
					console.log(checkCharacterAlreadyExists);
					if (checkCharacterAlreadyExists.length > 0) {
						req.flash("errorMsg", `${req.body.characterName} has already been added to your character list.`);
						res.redirect("/add-character");
						return;
					}
					user.characters.push(addedCharacter);
					let playerResponse = await playerData.dbUpdate({ webUserId: req.user });
					let userResponse = await user.dbUpdate({ characters: user.characters });
					if (userResponse.modifiedCount === 1 && playerResponse.modifiedCount === 1) {
						req.flash("successMsg", `Added ${playerData.name} to your list of characters.`);
						res.redirect("/add-character");
					} else {
						req.flash("errorMsg", `Unexpected error: Could not add ${playerData.name} to your list of characters.`);
						res.redirect("/add-character");
					}
				} else {
					req.flash("errorMsg", "Sorry, either that character doesn't exist, or the token was incorrect.");
					res.redirect("/add-character");
				}
			}
		} catch (error) {
			console.log(error);
			serverError(res);
		}
	});
	app.get("/all-characters", async (req, res) => {
		// let user = await new User({ id: req.user }).dbRead();
		// console.log(user);
		let allCharacters = await new Player({}).findByWebUserId(req.user)
		console.log(allCharacters);
		res.render("all-characters", {
			userStatus: userStatus(req)
		});
	});
};
