const fs = require('fs'); // Reading files
const http = require('http'); // Starting a server
const url = require('url'); // Routing

const json = fs.readFileSync(`${__dirname}/data/data.json`, `utf-8`); // __dirname = home folder
const laptopData = JSON.parse(json); 

// Each time someone opens a page on our server
const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // Products Overview
    if(pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' }); // resonse code
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, `utf-8`, (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, `utf-8`, (err, data) => {

                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);

                res.end(overviewOutput);
            });
        });
    }
    
    // Laptop Details
    else if(pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' }); // resonse code

        fs.readFile(`${__dirname}/templates/template-laptop.html`, `utf-8`, (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }

    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) { // Tests the path if it contains these imgs...
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' }); // resonse code
            res.end(data);
        });
    }

    // URL not found
    else {
        res.writeHead(404, { 'Content-type': 'text/html' }); // resonse code
        res.end('ERROR 404: URL was not found on the server...'); 
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Is this thing on yet?');
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
};
