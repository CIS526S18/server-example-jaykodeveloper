'use strict';
// declare variables
var fs = require('fs');
var http = require('http');
var url = require('url');
var PORT = 8080;

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

function goToPath(path, res){
    fs.readFile(path, 'utf-8', function(err, data){
        if(err){
            console.error(err);
            res.statusCode = 500;
            res.end("Server error: Could not read file");
            return;
        }
        res.end(data);
    });
} //function goToPath

function handleRequest(req, res){
    var resource = url.parse(req.url).pathname;

    switch(resource){
        //index
        case '/': 
            serveIndex('public',res);

            break;
        case '/public/openhouse.html':
            goToPath(resource,res);
            break;
        case '/openhouse.css':
            goToPath(resource,res);
            break;
        case '/openhouse.js':
            goToPath(resource,res);
            break;
        default:
            res.statusCode = 404;
            res.end("File not found");
           
            
    } // switch
} // function handleRequest

var server = http.createServer(handleRequest).listen(PORT, function(){
    console.log("Server is on "+ PORT);
})