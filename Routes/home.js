var express = require('express');
var router = express.Router();

router.post('/', (req,res) => {
    res.write(`write 
    /newrelease
    /mostpopular
    /webdevelopment
    /java
    /python
    /datascience
    /angular
    /javascript  
after localhost:3000`);
    res.end();
});

//Exports
module.exports = router;