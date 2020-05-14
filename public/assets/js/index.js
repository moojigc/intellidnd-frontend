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
        localStorage.setItem("id", $(".player-name-display").data("id"));
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
        $modalBackground.show('fast')
        $responseMsg.text("All # fields must have a number in them!");
    }
}
// Handles mapping the input from the whole body. Object type sanitation is handled on server side
async function entireBodyInputHandler(potions, weapons, misc) {
    let $potions = potions ? potions : $potionRow,
        $weapons = weapons ? weapons : $weaponRow,
        $miscs = misc ? misc : $miscRow;
    inventory = {
        gold: $gold.val(),
        silver: $silver.val(),
        copper: $copper.val(),
        platinum: $platinum.val(),
        electrum: $electrum.val(),
        // Input elements
        // potions
        potions: itemMap($potions),
        // weapons
        weapons: itemMap($weapons),
        // misc
        misc: itemMap($miscs),
    };
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

function removeItem() {
    const $nameLabelDiv = $('.name-label-div')
    // Show delete button
    function delBtnShow() {
        $(this).children('.name-label-span').hide();
        $(this).children('.del-btn').fadeIn('fast');
    }
    // Hide delete button
    function delBtnHide() {
        $(this).children('.del-btn').hide();
        $(this).children('.name-label-span').fadeIn('fast')
    }
    // Event listeners
    $nameLabelDiv.mouseenter(delBtnShow)
    $nameLabelDiv.mouseleave(delBtnHide)
    // delete button event
    $('.del-btn').on('click', async event => {
        event.preventDefault();
        // Delete the parent .row element
        $(event.target).closest('.row').remove();
        // Send to server...
        let res = await entireBodyInputHandler($('.potion-row'), $('.weapon-row'), $('.misc-row'));
        console.log(res)
        // location.reload()
    })
}

function addRowHandler() {
    const $addBtn = $('.add-btn');
    function addRow(target) {
        let parentCard = $(target).closest('.card');
        let findCategory = parent => {
            let htmlClass = parent.attr('class').split(' ').filter(word => word !== 'card').join();
            switch (htmlClass) {
                case 'potion-card': 
                    return 'potion-row'
                case 'weapon-card':
                    return 'weapon-row'
                case 'misc-card':
                    return 'misc-row'
                default:
                    return null
            }
        }
        console.log($(target).closest('.card').children('.card-body'))
        $(target).closest('.card').children('.card-body').append(`
<div class="row ${findCategory(parentCard)}">
    <div class="col-sm-8">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
            </div>
            <input type="text" maxlength="180" class="form-control name" placeholder="New..." value="">
        </div>
    </div>
    <div class="col-sm-4">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">#</span>
            </div>
            <input type="number" class="form-control quantity" placeholder="?" value="1">
        </div>
    </div>
</div>`);
    }
    $addBtn.on('click', event => {
        event.preventDefault();
        addRow(event.target);
    });
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
            $modalBackground.fadeIn('fast')
            $responseMsg.text(response.message)
        } catch (error) {
            console.log(error);
            $modalBackground.fadeIn('fast')
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
    // Add rows
    addRowHandler()
    // Handle single-item deletion
    removeItem();
}

main();
