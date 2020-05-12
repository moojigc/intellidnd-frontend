class Item {
    constructor(params) {
        let { name, quantity } = params;
        this.name = name;
        this.quantity = quantity;
    }
}

const $preloaded = $(".preloaded"),
    $changelogItem = $(".changelog-item"),
    $responseMsg = $(".response-msg"),
    // Data DOM elements
    $potionRow = $(".potion-row"),
    $weaponRow = $(".weapon-row"),
    $miscRow = $(".misc-row");
    // modal
const $modalBackground = $('.modal-background'),
    $modalBody = $('.modal-body');

// Takes jQuery object and returns mapped data
function itemMap(itemRow) {
    return itemRow
        .get()
        .filter((row) => !!row.querySelector("input.name").value)
        .map((row) => {
            return new Item({
                name: row.querySelector("input.name").value.toString(),
                quantity: parseInt(row.querySelector("input.quantity").value),
            });
        });
}
// money
const $gold = $(".gold"),
    $silver = $(".silver"),
    $copper = $(".copper"),
    $platinum = $(".platinum"),
    $electrum = $(".electrum");
    // Buttons
const $submitBtn = $(".submit"),
    $resetBtn = $(".reset");
    // Player ID
const getPlayerID = () => {
        if (!localStorage.getItem("id")) {
            localStorage.setItem("id", $playerID);
            return $(".player-name-display").data("id");
        } else return localStorage.getItem("id");
    };

function readOnlyOff() {
    $(this).attr("readonly", false);
    $(this).focus();
}

function readOnlyOn() {
    $(this).attr("readonly", true);
}

async function putRequest(data) {
    let url = `/api/user/${getPlayerID()}`;
    console.log(url);
    return await $.ajax({
        url: url,
        method: "PUT",
        data: data,
    });
}

async function getRequest() {
    let url = `/api/user/${getPlayerID()}`;
    return await $.ajax({
        url: url,
        method: "GET",
    });
}

function translateChangelog() {
    // Iterate over each changelog list element and reformat it with readable timestamp
    $changelogItem.get().forEach((item) => {
        let rawTime = item.dataset.time;
        let text = item.innerText;
        let date = moment(rawTime).format("MMMM Do, YYYY");
        let time = moment(rawTime).format("hh:mm a");
        let formatted = `On ${date}, at <strong>${time}</strong>: <code>${text}</code>`;
        item.innerHTML = formatted;
    });
}

// Check the user input for non numbers. Cannot use jQuery objects
function numberValidation(arrayObject, ...elements) {
    let elemArray = arrayObject ? arrayObject : elements;
    // Map all objects to booleans
    let bools = elemArray.map((e) => {
        if (e.value === "") {
            e.classList.add("invalid");
            return false;
        } else {
            e.classList.remove("invalid");
            return true;
        }
    });
    // Case that any come back false
    if (bools.filter((b) => !b).length > 0) {
        $responseMsg.text("All # fields must have a number in them!");
    }
}
// Handles mapping the input from the whole body. Object type sanitation is handled on server side
async function entireBodyInputHandler() {
    inventory = {
        gold: $gold.val(),
        silver: $silver.val(),
        copper: $copper.val(),
        platinum: $platinum.val(),
        electrum: $electrum.val(),
        // Input elements
        // potions
        potions: itemMap($potionRow),
        // weapons
        weapons: itemMap($weaponRow),
        // misc
        misc: itemMap($miscRow),
    };
    console.log(inventory.lastUpdated);
    const data = {
        inventory: inventory,
        changelog: {
            on: moment().format(),
            command: "Updated on website.",
        },
        lastUpdated: moment().format(),
    };
    let response = await putRequest(data);
    return response;
}

// All action here
function main() {
    // Empty error message div
    $responseMsg.text("");
    // Format changelog
    translateChangelog();
    // Toggle read only for inputs
    $preloaded.attr("readonly", true);
    $preloaded.on("click", readOnlyOff);
    $preloaded.blur(readOnlyOn);
    // Event listener for validation on inputs
    $("input.quantity").on("click", () => {
        numberValidation(null, $gold.get()[0], $silver.get()[0], $copper.get()[0], $electrum.get()[0], $platinum.get()[0]);
        numberValidation($("input.quantity").get());
    });
    // Click event on the submit button
    $submitBtn.on("click", async (event) => {
        event.preventDefault();
        try {
            let response = await entireBodyInputHandler();
            $modalBackground.show('fast');
            console.log(response);
            $responseMsg.text(response.message)
        } catch (error) {
            console.log(error);
            $responseMsg.text("Sorry, an error occurred. Please try again later.");
        }
    });
    // Cancel 'enter' key press
    $(document).on("keypress", (event) => {
        if (event.which === 13) {
            event.preventDefault();
            handleConversion();
        }
    });
}

main();
