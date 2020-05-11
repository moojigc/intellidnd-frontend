class Item {
    constructor(params) {
        let { name, quantity } = params; 
        this.name = name;
        this.quantity = quantity;
    }
}

const $preloaded = $('.preloaded'),
    // Data DOM elements
    $potionRow = $('.potion-row'),
    $weaponRow = $('.weapon-row'),
    $miscRow = $('.misc-row');

    // Takes jquery object and returns mapped data
function itemMap(itemRow) {
    itemRow.get().map(item => {
        return new Item({
            name: row.getAttribute('data-name') ? row.getAttribute('data-name') : row.getAttribute('value'),
            quantity: row.getAttribute('data-quantity') ? parseInt(row.getAttribute('data-quantity')) : row.getAttribute('value') 
        })
    })
}

    // Input elements
    // potions
const $potionInputNames = $potionRow.find('input .name'),
    $potionInputQuantity = $potionRow.find('input .quantity'),
    $potionInputNameNew = $potionRow.find('.new-name'),
    // weapons
    $weaponInputName = $weaponRow.find('input .name'),
    $weaponInputQuantity = $weaponRow.find('input .quantity'),
    $weaponInputNameNew = $weaponRow.find('.new-name'),
    // misc
    $miscInputName = $miscRow.find('input .name'),
    $miscInputQuantity = $miscRow.find('input .quantity'),
    $miscInputNameNew = $miscRow.find('.new-name'),
    // money
    $gold = $('.gold'),
    $silver = $('.silver'),
    $copper = $('.copper'),
    $platinum = $('.platinum'),
    $electrum = $('.electrum'),
    // Buttons
    $submitBtn = $('.submit'),
    $resetBtn = $('.reset'),
    // Player ID
    getPlayerID = () => {
    if (!localStorage.getItem('id')) {
        localStorage.setItem('id', $playerID);
        return $('.player-name-display').data('id');
    }
    else return localStorage.getItem('id');
}

function setData(input, row) {
    row.setAttribute('data-quantity')
}

function readOnlyOff() {
    $(this).attr('readonly', false);
    $(this).focus();
}
function readOnlyOn() {
    $(this).attr('readonly', true);
}

async function putRequest(data) {
    return await $.ajax({
        url: `/api/user/${getPlayerID()}`,
        method: 'PUT',
        data: data
    })
}

// Handles mapping the input from the whole body
function entireBodyInputHandler() {
    function mapData(DOMrow) {
        // Get names and quantities from preloaded rows
        return DOMrow.get().map(row => {
            let name = row.getAttribute('data-name');
            let quantity = parseInt(row.getAttribute('data-quantity'));
            if (name !== "" || !isNaN(quantity)) return {
                name: name,
                quantity: quantity
            }
        }).filter(row => !!row); // Filter out any empty rows
    }
    function mapNewData(DOMrow) {
        return DOMrow.get().map(row => {
            let name = row.find()
        })
    }
    let allMisc = mapData($miscRow);
    let allPotions = mapData($potionRow);
    let allWeapons = mapData($weaponRow);
    console.log(allMisc) 
    return {
        potions: mapData($potionRow).push(),
        weapons: mapData($weaponRow).push(),
        misc: mapData($miscRow).push()
    }
}


function main() {
    entireBodyInputHandler();
    $('.input').val('');
    $preloaded.attr('readonly', true);
    $preloaded.on('click', readOnlyOff);
    $preloaded.blur(readOnlyOn);
    const playerData = {
        inventory: {
            gold: parseInt($gold.val()),
            silver: parseInt($silver.val()),
            copper: parseInt($.copper.val()),
            platinum: parseInt(platinum.val()),
            electrum: parseInt($electrum.val()),
            potions: [],
            weapons: [],
            misc: []
        },
        changelog: {
            on: moment(),
            // command: `Webpage: ${}`
        }
    }
}

main();
