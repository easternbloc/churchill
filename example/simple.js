var express   = require('express'),
    winston   = require('winston'),
    app = express();

//simple version
app.use(require('churchill')(winston));

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3000);