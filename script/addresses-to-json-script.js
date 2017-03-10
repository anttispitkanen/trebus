const fs = require('fs');

function makeJSONkey(originalAddress) {
    let letters = originalAddress.trim().split(''); //letters as array
    //let's map the scandinavian letters out of it
    let fixedLetters = letters.map(letter => {
        if (letter === 'ä') { return 'a' }
        if (letter === 'Ä') { return 'A' }
        if (letter === 'ö') { return 'o' }
        if (letter === 'Ö') { return 'O' }
        if (letter === 'å') { return 'a' }
        if (letter === 'Å') { return 'A' }
        return letter;
    })

    return fixedLetters.join('');
}


function makeJSONvaluePair(address) {
    let key = makeJSONkey(address);

    return '\"' + key + '\": \"' + address + '\"';
}

function composeJSONobject(arrayOfAddresses) {
    let JSONString = '{\n';
    let lastIndex = arrayOfAddresses.length - 1;

    arrayOfAddresses.map((address, index) => {
        if (index === lastIndex) {
            //no comma after the last element
            JSONString += makeJSONvaluePair(address) + '\n';
        } else {
            JSONString += makeJSONvaluePair(address) + ',\n';
        }
    })

    JSONString += '}'
    return JSONString;
}


let inputAddresses = [];


fs.readFile('output.txt', (err, data) => {
    if (err) return console.error(err);
    inputAddresses = data.toString().trim().split('\n');
    console.log(inputAddresses);

    let JSONobject = composeJSONobject(inputAddresses);

    fs.writeFile('scandinavianAddresses.json', JSONobject, (err) => {
        if (err) return console.error(err);
        console.log('saved to scandinavianAddresses.json!');
    })
})
