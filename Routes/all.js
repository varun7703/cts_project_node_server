var express = require('express');
var router = express.Router();


router.get('/all', function(req,res){
    //connect to db
    var MongoClient =  require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/cts_db";
    MongoClient.connect(url, { useUnifiedTopology: true } , function(err, db) {
        if(err) throw err;
        var dbo = db.db("cts_db");
        
        dbo.collection("subbooks.json").find({}).toArray(function(err, result) {
            if(err) throw err;
            else{
                res.send(result);//.forEach(element => console.log(element.title));
            }
            
        });
    });
});


//Exports
module.exports = router;