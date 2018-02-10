"use strict";
const PORT = 8080;
const http = require('http');
const fs = require('fs');
const url = require('url');
const PATH = require('path');
/**
 * @function serverFile
 * Serves the specified file with the provided response object
 * @param {string} path - specifies the file path to read
 * @param {http.serverResponse} res - the http response object
 */
function serverFile(path, res){
    //async method
    fs.readFile(PATH.join('public',path), function(err, data){
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
  
  fs.readFile(PATH.join('public',aPath,"index.html"), (err, data) =>{
      if(err){
        fs.readdir(PATH.join('public',aPath), function(err, files){
                if(err){
                    console.error(err);
                    res.statusCode = 500;
                    res.end("Server Error: ");
                    return;
                }
                var html = "<p> Index of " + aPath+ "</p>";
                html += "<ul>";
                html += files.map(function(item){
                    return "<li><a href='"+PATH.join(aPath,item)+"'>" + item + "</a></li>";
                }).join("");
                html += "</ul>";
                res.end(html);
            });
            return;
      } // if(err)
      res.end(data);
 }) //readFile
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
            res.statusCode =404;
            res.end("fs.stat error");
            return;
        }
        if(stats.isDirectory()){
            //serveDirectory('public', res);
            //serveDirectory('public'+req.url+'/', res);
            serveDirectory(temp, res);
            //serveDirectory(aPath, res);
        }
        if(stats.isFile()){
            serverFile(temp, res);
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