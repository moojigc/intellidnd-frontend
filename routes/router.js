const express = require("express"),
    moment = require('moment'),
    router = express.Router(),
    Player = require('../models/Player'),
    isEqual = require('lodash/isEqual'),
    serverError = res => res.status(500).json({ message: 'Internal server error.', error: 500 }).end();

// Renders the bot Guide
router.get("/", async (req, res) => {
    try {
        res.render('default', {});
    } catch (error) {
        console.trace(error)
        serverError(res)
    }
});

// Returns player data in JSON format
router.get("/api/user/:id", async (req, res) => {
    try {
        let player = new Player({ id: req.params.id });
        await player.sync()
        res.status(200).json(player).end();
    } catch (error) {
        console.trace(error)
        serverError(res)
    }
})

// Most important page! Lets user see and update their data
router.get("/login/:id", async (req, res) => {
    try {
        let player = new Player({ id: req.params.id })
        await player.sync();
        res.render('index', {
            player: player,
        });
    } catch (error) {
        console.trace(error)
        serverError(res)
    }
});

// Update route. Also used for deleting of single items bc it uses the same logic
router.put("/api/user/:id", async (req, res) => {
    try {
        // Create Player instance and sync it with database
        let player = new Player({ id: req.params.id })
        await player.sync();
        // Add new logs from front-end to the player instance
        player.changelog.push(req.body.changelog);
        // Destructure the inventory Object from request body
        let { gold, silver, copper, platinum, electrum, potions, weapons, misc } = req.body.inventory;
        // Fix the numbers...
        function correctTypes(category) {
            // HTTP prot only sends strings, so you must convert strings to numbers
            return category.map(item => {
                return {
                    name: item.name,
                    quantity: parseInt(item.quantity)
                }
            })

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
        }
        
        // Case that changes were detected
        if (!isEqual(inventory, player.inventory)) {
            let response = await player.dbUpdate({
                inventory: inventory,
                changelog: player.changelog,
                lastUpdated: moment().format()
            })
            // Database responds positively
            if (response.modifiedCount === 1) 
                res.status(200).json({ message: 'Success!', status: 200 }).end()
            // Database fails to update for some reason
            else
                res.status(404).json({ message: 'Could not update player. Please go back to Discord and try there first.', status: 404 })
        }
        // Case that no changes were detected
        else {
            res.status(202).json({ message: 'No changes detected!', status: 202 }).end()
        }

    } catch (error) {
        console.error(error)
        serverError(res)
    }
});

// Decided for now, not to allow total player deletion through the webpage. Discord is more secure.
// In the near future, I'll add user auth
// CREATE route is impossible b/c users usually don't have direct access to their Discord user and server ID,
// so they must run /create command in Discord server directly first.

// Export routes for server.js to use.
module.exports = router;
