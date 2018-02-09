"use strict";
const PORT = 8080;
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
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

function serveDirectory(aPath, res){
    fs.readdir(aPath, function(err, files){
        if(err){
            console.error(err);
            res.statusCode = 500;
            res.end("Server Error: ");
        }
        var html = "<p> Index of " + aPath+ "</p>";
        html += "<ul>";
        html += files.map(function(item){
            return "<li><a href='"+item+"'>" + item + "</a></li>";
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
    var temp = url.parse(req.url, true).pathname;
    var aPath = 'public'+temp;
    fs.stat(aPath, (err, stats) =>{
        if(err){
            console.error(err);
            res.statusCode = 500;
            res.end("fs.stat error");
            return;
        }
        if(stats.isDirectory()){
            //serveDirectory('public', res);
            //serveDirectory('public'+req.url+'/', res);
            serveDirectory('public'+temp+'/', res);
            //serveDirectory(aPath, res);
        }
        if(stats.isFile()){
            serverFile(aPath, res);
            //serverFile('public/'+req.url, res);
        }
    })
} // function handleRequest

//create the web server
var server = http.createServer(handleRequest);
// start listening on port 80
server.listen(PORT, function(){
    console.log("Listening on port "+PORT);
});