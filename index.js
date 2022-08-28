const http = require('http');
const fs = require('fs');
var request = require('requests');

//get home date into homeFile
const homeFile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    
    return temperature;
}
const server = http.createServer((req,res) => {
    if(req.url == "/"){
        request("https://api.openweathermap.org/data/2.5/weather?q=Sangli&APPID=9779fc5da7021b32059758244eeb1197")
        .on("data",function(chunk){
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata]
            // console.log(arrdata);
            const realTimeData = arrdata.map((val) =>replaceVal(homeFile,val)).join("");
            res.write(realTimeData)
            // console.log(realTimeData);
        })
        .on("end",(err) => {
            if(err){
                return console.log("Connection closed due to error",err);
            }
            res.end();
        });
    }else{
        res.end("Page Not Found");  
    }
});

server.listen(8000,"127.0.0.1");