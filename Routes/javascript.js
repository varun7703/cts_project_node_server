var express = require('express');
var router = express.Router();


router.get('/javascript', function(req,res){
    //connect to db
    var MongoClient =  require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/cts_db';
    MongoClient.connect(url, { useUnifiedTopology: true } , function(err, db) {
        if(err) throw err;
        var dbo = db.db("cts_db");
        var query = { categories: "JavaScript" };
        dbo.collection("subbooks.json").find(query).toArray(function(err, result) {
            if(err) throw err;
            else{
                res.send(result);
            }
            
        });
    });
});



//Exports
module.exports = router;