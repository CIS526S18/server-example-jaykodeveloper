"use strict";

// const PORT =7000;

//Import the HTTP library
const http = require('http');

//Import the fs library
const fs = require('fs');

const cache = {};
cache['openhouse.html'] = fs.readFileSync('public/openhouse.html');
cache['openhouse.css'] = fs.readFileSync('public/openhouse.css');
cache['openhouse.js'] = fs.readFileSync('public/openhouse.js');

/* 
modulazied 
//async method
            fs.readFile('public/openhouse.html', function(err, data){
                if(err) {
                     console.error(err);
                     res.statusCode = 500;
                     res.end("Server error");
                     return;
                }
                //at this point, there is no error
                res.end(data);
            });
*/

/**
 * @function serverFile
 * Serves the specified file with the provided response object
 * @param {string} path - specifies the file path to read
 * @param {http.serverResponse} res - the http response object
 */
function serverFile(path, res){
    //async method
    fs.readFile(path, function(err, data){
        if(err) {
             console.error(err);
             res.statusCode = 500;
             res.end("Server error: Could not read file");
             return;
        }
        //at this point, there is no error
        res.end(data);
    });
}

function serveIndex(path, res){
    fs.readdir(path, function(err, files){
        if(err){
            console.error(err);
            res.statusCode = 500;
            res.end("Server Error: ");
        }
        var html = "<p> Index of " + path + "</p>";
        html += "<ul>";
        html += files.map(function(item){
            return "<li><a href='"+ item +"'>" + item + "</a></li>";
        }).join("");
        html += "</ul>";
        res.end(html);
    });    
}

/**
 * @function handleRequest 
 * Request handler for our http server
 * @param {http.ClientRequest} req - the http requeset object
 * @param {http.ServerResponse} res - the http response object
 */
function handleRequest(req, res){
    /*console.log(req.url);
    var path = "public" + req.url;*/

    switch(req.url){
        case '/':
            serveIndex('public', res);
            break;
        case '/openhouse.html':
           
            serverFile('public/openhouse.html', res);
            
            break;
        case '/openhouse.css':
            
            serverFile('public/openhouse.css', res);
            
            break;
        case '/openhouse.js':
           
            serverFile('public/openhouse.js', res);
            break;
        default:
            res.statusCode = 404;
            res.end("File not found");
    }
} // function handleRequest

//create the web server
var server = http.createServer(handleRequest);


// start listening on port 80
server.listen(PORT, function(){
    console.log("Listening on port "+PORT);
});