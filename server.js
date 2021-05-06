var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan'); 
var methodOverride = require('method-override');
var cors = require('cors');
const bcrypt = require('bcrypt');
var mongo = require('mongodb')
var app = express();
app.use(logger('dev'));
var jwt = require('jsonwebtoken');
var home = require('./Routes/home.js');
var webdevelopment = require('./Routes/webdevelopment.js');
var java = require('./Routes/java.js');
var python = require('./Routes/python.js');
var angular = require('./Routes/angular.js');
var datascience = require('./Routes/datascience.js');
var javascript = require('./Routes/javascript.js');
var newrelease = require('./Routes/newrelease.js');
var mostpopular = require('./Routes/mostpopular.js');
var all = require('./Routes/all.js');
app.use(methodOverride('X-HTTP-Method-Override'))




app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.use('/', home);
app.use('/', webdevelopment);
app.use('/', java);
app.use('/', javascript);
app.use('/', python);
app.use('/', angular);
app.use('/', datascience);
app.use('/', newrelease);
app.use('/', mostpopular);
app.use('/', all);


app.use(bodyParser.json());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true ,useUnifiedTopology: true }));
app.use(cors());
app.listen(8080, () => {
    console.log('App is running on 8080')
});
const MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
const url = "mongodb://localhost:27017/cts_db";
const secret = 'RandomLettersAndNumbers'
const saltRounds = 10;


app.post("/signup", (req, response) => {
  const name = req.body.username
    const email = req.body.email
    const password = req.body.password
    
  var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cts_db";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("cts_db");
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  var myobj = { name: name,email:email,password:hash, address_array: [{'address':"Highway 37"}] };
  dbo.collection("users").findOne({ email: email }, function (err, result) {
    if (err) throw err;
    else {
        if (result == null) {


            dbo.collection("users").insertOne(myobj, function (err, res) {
                if (err) throw err
                else {
                    response.json({
                        success: true,
                        status: 200,
                        
                    })

                    console.log("1 document inserted");
                }
            });
        }
        else{
          response.json({
            success: false,
            status: 500,
            message: "you are already registered"
        })
        }
        
    }
});
});

})
app.post("/signin",(req,response)=>{
  const name = req.body.username
  const password = req.body.password
  var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cts_db";
MongoClient.connect(url, function(err, db) {
  const token = jwt.sign({ iss: 'localhost:3000', role: 'user',  name: name}, secret, { expiresIn: 60 * 60 });
var dbo = db.db("cts_db");
dbo.collection("users1").findOne({ name: name }, function (err, result) {
  if (err) throw err;
  else {
      if (result == null) {   
        
                  response.json({
                      success: true,
                      status: 500,
                      message:'not registered',
                  
                      
                  })         
      }
      else{
        console.log("login res",result)
        if(
          // bcrypt.compareSync(password, result.password)
        result.password == password
        ){
          response.json({
          success: true,
          status: 200,
          token:token,
          id:result._id
          
          
      }) }
      else{
        response.json({
          success: false,
          status: 400,
          message:'password incorrect'    
      })
      }
        console.log(result)
      }
      
  }
});
});
})


var cart = []
var wish = []

var reviews = []
//orders
app.post('/myorder1' ,(req,res) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/cts_db";
  var order =[];
  var id= req.body.id;
  console.log("id aa rahi h lya ",id)
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
         if(err)
         console.log(err)
         else{
             var dbo =db.db("cts_db");
             var ObjectID = mongo.ObjectID;
                   var obj_id = new ObjectID(id);
             dbo.collection("users1").findOne( {_id:obj_id},{projection:{_id:0,order_history:1}},function(err,result){ if(err)
              console.log(err)
              else{
               
                console.log(result)
                result.order_history.forEach(ele=> {
                    
                  var ObjectID = mongo.ObjectID;
                  var obj_id = new ObjectID(ele);
                order.push(obj_id)
            })
         
            console.log("result to be to ",order)
            res.send(order)
           
              }
              
              })
                           
         }
    })
})
app.post('/myorder2', (req,res)=> {

  var id = req.body.id;

  MongoClient.connect(url, {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{
        var ObjectID = mongo.ObjectID;
        var obj_id = new ObjectID(id);
      var dbo = db.db("cts_db");
          dbo.collection("subbooks.json").findOne( { _id : obj_id},function(err,result){
              if(err)
              console.log(err)
              else { 
                console.log("final result",result)
                res.send(result)
              }
                  
            } )   
          
        }
      })
  })

//wishList
app.post('/mywish1' ,(req,res) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/cts_db";
  var order =[];
  var id= req.body.id;
  console.log("id aa rahi h lya ",id)
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
         if(err)
         console.log(err)
         else{
             var dbo =db.db("cts_db");
             var ObjectID = mongo.ObjectID;
                   var obj_id = new ObjectID(id);
             dbo.collection("users1").findOne( {_id:obj_id},{projection:{_id:0,wishlist_array:1}},function(err,result){ if(err)
              console.log(err)
              else{
               
                console.log(result)
                result.wishlist_array.forEach(ele=> {
                    
                  var ObjectID = mongo.ObjectID;
                  var obj_id = new ObjectID(ele);
                order.push(obj_id)
            })
         
            console.log("result to be to ",order)
            res.send(order)
           
              }
              
              })
                           
         }
    })
})
//mycart
app.post('/mywish2', (req,res)=> {

  var id = req.body.id;

  MongoClient.connect(url, {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{
        var ObjectID = mongo.ObjectID;
        var obj_id = new ObjectID(id);
      var dbo = db.db("cts_db");
          dbo.collection("subbooks.json").findOne( { _id : obj_id},function(err,result){
              if(err)
              console.log(err)
              else { 
                console.log("final result",result)
                res.send(result)
              }
                  
            } )   
          
        }
      })
  })
app.post('/mycart1' ,(req,res) => {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/cts_db";
  var order =[];
  var id= req.body.id;
  console.log("id aa rahi h lya ",id)
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
         if(err)
         console.log(err)
         else{
             var dbo =db.db("cts_db");
             var ObjectID = mongo.ObjectID;
                   var obj_id = new ObjectID(id);
             dbo.collection("users1").findOne( {_id:obj_id},{projection:{_id:0,mycart_array:1}},function(err,result){ if(err)
              console.log(err)
              else{
               
                console.log(result)
                result.mycart_array.forEach(ele=> {
                    
                  var ObjectID = mongo.ObjectID;
                  var obj_id = new ObjectID(ele);
                order.push(obj_id)
            })
         
            console.log("result to be to ",order)
            res.send(order)
           
              }
              
              })
                           
         }
    })
})
app.post('/mycart2', (req,res)=> {

  var id = req.body.id;

  MongoClient.connect(url, {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{
        var ObjectID = mongo.ObjectID;
        var obj_id = new ObjectID(id);
      var dbo = db.db("cts_db");
          dbo.collection("subbooks.json").findOne( { _id : obj_id},function(err,result){
              if(err)
              console.log(err)
              else { 
                console.log("final result",result)
                res.send(result)
              }
                  
            } )   
          
        }
      })
  })

//delete ------


//myorder 
app.delete('/myorder/:id', (req,res)=> {
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
        if(err)
        console.log(err)
        else{
            var id = req.params.id;
            var bid = req.body.id;

          

            var ObjectID = mongo.ObjectID;
            var user_id = new ObjectID(id);

            
            
            var dbo =db.db("project");
            dbo.collection("users").updateOne({_id : user_id} ,{ $pull : { order_history : bid }})
        }
})
})

app.post('/mywishdel', (req,res)=> {

  var id = req.body.id;
  var bid = req.body.bid;
  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{
      

          console.log(id)
          console.log(bid)

          var ObjectID = mongo.ObjectID;
          var user_id = new ObjectID(id);

          
          
          var dbo =db.db("cts_db");
          dbo.collection("users1").updateOne({_id : user_id} ,{ $pull : { wishlist_array : bid }})
      }
})
})

app.post('/mycartdel', (req,res)=> {
 
  var id = req.body.id;
  var bid = req.body.bid;
  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{
      

          console.log(id)
          console.log(bid)

          var ObjectID = mongo.ObjectID;
          var user_id = new ObjectID(id);

          
          
          var dbo =db.db("cts_db");
          dbo.collection("users1").updateOne({_id : user_id} ,{ $pull : { mycart_array : bid }})
      }
})
})


//update //update  

app.post('/mycartadd', (req,res)=> {
    
  var id = req.body.id;
  var bid = req.body.bid;
  var boo;
  var ObjectID = mongo.ObjectID;
  var user_id = new ObjectID(id);
  console.log(id)
  console.log(bid)
  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err) 
      else{
        var dbo =db.db("cts_db");
        dbo.collection("users1").find({_id : user_id  ,   mycart_array :{ $in : [bid]}} ).count(function (er, resu){
          console.log(resu)
          boo = resu;
          if(resu==0){
            dbo.collection("users1").updateOne({_id : user_id} ,{ $push : { mycart_array : bid }})
            res.json({
              status:200,
              success:true
            })
          }
          else{
            res.json({
              status:400,
              success:false
            })
          }
      })
      
     
      }
})
})

app.post('/mywishadd', (req,res)=> {

    
  var id = req.body.id;
  var bid = req.body.bid;
  var boo;
  var ObjectID = mongo.ObjectID;
  var user_id = new ObjectID(id);
  console.log(id)
  console.log(bid)
  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err) 
      else{
        var dbo =db.db("cts_db");
        dbo.collection("users1").find({_id : user_id  ,   wishlist_array :{ $in : [bid]}} ).count(function (er, resu){
          console.log(resu)
          boo = resu;
          if(resu==0){
            dbo.collection("users1").updateOne({_id : user_id} ,{ $push : { wishlist_array : bid }})
            res.json({
              status:200,
              success:true
            })
          }
          else{
            res.json({
              status:400,
              success:false
            })
          }
      })
      
     
      }
})
})
app.post('/myorderadd', (req,res)=> {

    
  var id = req.body.id;
  var bid = req.body.bid;
  var boo;
  var ObjectID = mongo.ObjectID;
  var user_id = new ObjectID(id);
  console.log(id)
  console.log(bid)
  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err) 
      else{
        var dbo =db.db("cts_db");
        dbo.collection("users1").find({_id : user_id  ,   order_history :{ $in : [bid]}} ).count(function (er, resu){
          console.log(resu)
          boo = resu;
          if(resu==0){
            dbo.collection("users1").updateOne({_id : user_id} ,{ $push : { order_history : bid }})
            res.json({
              status:200,
              success:true
            })
          }
          else{
            res.json({
              status:400,
              success:false
            })
          }
      })
      
     
      }
})
})
app.post('/myorder', (req,res)=> {
    
  var id = req.body.id;
  var bid = req.body.id;

  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{
          console.log(id)
          console.log(bid)

          var ObjectID = mongo.ObjectID;
          var user_id = new ObjectID(id);

          
          
          var dbo =db.db("project");
          dbo.collection("users").updateOne({_id : user_id} ,{ $push : { order_history : bid }})
          dbo.collection("users").updateOne({_id : user_id} ,{ $pull : { mycart_array : bid }})
          dbo.collection("users").updateOne({_id : user_id} ,{ $pull : { wishlist_array : bid }})
          
      }
})
})

//review api 

app.get('/review/:id', (req,res)=> {
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
        if(err)
        console.log(err)
        else{
            var id = req.params.id;

            var ObjectID = mongo.ObjectID;
            var user_id = new ObjectID(id);

            var dbo =db.db("project");
            dbo.collection("subbooks").find({_id : user_id} , { projection: {_id : 0,  review : 1 }}).toArray( (err, result) => {

                if(err)
                throw error
                else{
                    result.forEach( el=> {
                        reviews.push(el)
                    })
                }
                reviews.forEach(el=> {
                    console.log(el)
                })
            })
        }
    })
})

app.delete('/review/:id', (req,res)=> {
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
        if(err)
        console.log(err)
        else{
            var id = req.params.id;
            var revString = req.body.review;

          

            var ObjectID = mongo.ObjectID;
            var user_id = new ObjectID(id);

            
            
            var dbo =db.db("project");
            dbo.collection("subbooks").updateOne({_id : user_id} ,{ $pull : { review : revString }})
        }
})
})


app.put('/review/:id', (req,res)=> {
    MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
        if(err)
        console.log(err)
        else{
            var id = req.params.id;
            var revString = req.body.review;

          

            var ObjectID = mongo.ObjectID;
            var user_id = new ObjectID(id);

            
            
            var dbo =db.db("project");
            dbo.collection("subbooks").updateOne({_id : user_id} ,{ $push : { review : revString }})
        }
})
})
app.post("/getprod", (req, response) => {
  const id = req.body.id
  var ObjectID = mongo.ObjectID;
  var user_id = new ObjectID(id);
  var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cts_db";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cts_db");
    dbo.collection("subbooks.json").findOne({_id:user_id}, function(err, result) {
      if (err) throw err;
      else{
      console.log(result);
      response.send(result);
    }
    });
  });
  


})
app.post('/myaccount', (req,res)=> {
  var id = req.body.uid;
  MongoClient.connect(url , {  useUnifiedTopology: true } , (err, db) => {
      if(err)
      console.log(err)
      else{

          
      var ObjectID = mongo.ObjectID;
      var user_id = new ObjectID(id);

      var dbo = db.db("cts_db");
          dbo.collection("users1").findOne( { _id : user_id} ,function(err, result) {
              if(err)
              console.log(err)
              else 
                  console.log(result)
                  res.send(result)
              
          })
      }
  })
})