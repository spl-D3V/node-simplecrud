const express = require('express');
const bodyParse = require('body-parser')

let {Mongoose} = require('./db/mongoosedb');
let {Todo} = require('./models/todos');
let {User} = require('./models/users');

const app = express();
app.use(bodyParse.json());
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (e) =>{
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('running');
});