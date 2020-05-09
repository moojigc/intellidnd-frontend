const express = require("express"),
    router = express.Router(),
    Player = require('../models/Player'),
    Guild = require('../models/Guild');

router.get("/", async (req, res) => {
    res.render('default', {});
});

router.get("/login/:id", async (req, res) => {
    try {
        let player = new Player({ id: req.params.id })
        await player.sync();
        console.log(player.inventory.potions);
        res.render('index', {
            player: player
        });
    } catch (error) {
        console.error(error)
        res.json({ message: 'Player not found!', error: 404 });
        return res.sendStatus(404).end();
    }
});

router.post("/api/user/:id", async (req, res) => {
    try {
        let player = new Player({ id: req.params.id })
        await player.sync();

        let response = await player.dbUpdate({
            inventory: req.body.inventory,
            changelog: req.body.changelog
        })
        res.status(200).json(response).end()

    } catch (error) {
        console.error(error)
        return res.sendStatus(500).end();
    }
});

router.put("/api/burger/:id", async (req, res) => {
    let myBurger = new Burger({ id: req.params.id })
    let result;
    try {
        result = myBurger.dbUpdate({ devoured: req.body.devoured })

        if (result.changedRows === 0) {
            return res.status(404).end();
        } else {
            return res.status(200).end();
        }
    } catch (error) {
        console.error(error)
        return res.sendStatus(500).end();
    }
});

router.delete("/api/burger/:id", async (req, res) => {
    let myBurger = new Burger({ id: req.params.id })
    try {
        let result = await myBurger.dbDelete()
        if (result.changedRows == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
        } else {
            return res.status(200).end();
        }
    } catch (error) {
        console.error(error)
        return res.sendStatus(500).end();
    }

})

// Export routes for server.js to use.
module.exports = router;
