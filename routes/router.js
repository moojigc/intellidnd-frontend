const Player = require("../models/Player"),
	isEqual = require("lodash/isEqual"),
	serverError = (res) => res.json({ redirectURL: "/server-error" }),
	userStatus = (req) => {
		return {
			loggedOut: req.user ? false : true,
			loggedIn: req.user ? true : false
		};
	};

module.exports = (app) => {
	// Renders the bot Guide
	app.get("/", async (req, res) => {
		try {
			res.render("guide", { userStatus: userStatus(req) });
		} catch (error) {
			console.trace(error);
			serverError(res);
		}
	});

	// Returns player data in JSON format
	app.get("/api/user/:id", async (req, res) => {
		try {
			let player = new Player({ id: req.params.id });
			await player.sync();
			res.status(200).json(player).end();
		} catch (error) {
			console.trace(error);
			serverError(res);
		}
	});

	app.get("/register", (req, res) => {
		res.render("register");
	});

	app.get("/login", (req, res) => {
		if (req.user) {
			res.redirect("/inventory");
		} else {
			res.render("login", { userStatus: userStatus(req) });
		}
	});
	app.get("/server-error", (req, res) => {
		res.render("server-error", { userStatus: userStatus(req) });
	});
	app.get("/add-character", (req, res) => {
		res.render("add-character", { userStatus: userStatus(req) });
	});
};
