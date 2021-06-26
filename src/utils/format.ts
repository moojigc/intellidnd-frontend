function phone(p: string) {
    let og = p.split('').filter(v => /\d/.test(v)).join('');
    let formatted = '';

    for (let i=0; i < og.length; i++) {
        switch (i) {
            case 0:
                formatted += '(' + og[0];
                break;
            case 2:
                formatted +=  og[2] + ') ';
                break;
            case 6:
                formatted += '-' + og[6];
                break;
            default:
                formatted += og[i];
                break;
        }
    }

    return formatted;
}

export default { phone };