const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 7070;
const url = require('url');

function serveFile(aPath, res){
    fs.readFile(aPath, function(err, data){
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

function serveIndex(aPath,res){
    fs.readdir(aPath, (err, files)=>{
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



function handleRequest(req, res){
    var uri = url.parse(req.url).pathname;
    var aPath = 'public'+uri;
    fs.exists(aPath+"index.html", (existChecker) =>{
        if(!existChecker){
            serveIndex(aPath, res);
        }
            serveFile(aPath+"index.html", res);

    });


} // handleRequest

var server = http.createServer(handleRequest);

server.listen(PORT, ()=>{
    console.log("Server is on "+PORT);
});