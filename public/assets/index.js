const preloaded = $('.preloaded');

function readOnlyOff() {
    $(this).attr('readonly', false)
    $(this).focus()
}
function readOnlyOn() {
    $(this).attr('readonly', true)
}

function main() {
    preloaded.attr('readonly', true)
    preloaded.on('click', readOnlyOff)
    preloaded.blur(readOnlyOn)
}

main();