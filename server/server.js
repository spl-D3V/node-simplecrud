const express = require('express');
const bodyParse = require('body-parser')

let {Mongoose} = require('./db/mongoosedb');
let {Todo} = require('./models/todos');
let {User} = require('./models/users');
let {ObjectID} = require('mongodb');

//beforeEach((done) =>{
//    Todo.remove({}).then(()=> done());
//});

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParse.json());
app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (e) =>{
        res.status(400).send(e);
    });
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) =>{
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    })
});
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Runing in port : ${port}`);
});

module.exports = {app};