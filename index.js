const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./util/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const todomodel = require('./model/todo');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// setup cors to allow requests from localhost:3000 only? 
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use('/static', express.static(path.join(__dirname, 'frontend', 'build', 'static')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// add new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { item } = req.body;

        const newtodo = new todomodel({
            item
        });

        await newtodo.save();

        return res.json({
            sucess: true,
            todo: newtodo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }    
});

// get all todo list
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await todomodel.find();
        return res.json({
            sucess: true,
            todos: todos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    } 
});

// remove todo item
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await todomodel.findByIdAndDelete(id);
        return res.json({
            sucess: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    } 
});

// change todo status
app.post('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await todomodel.findByIdAndUpdate(id, {
            status
        }, {
            runValidators: true
        });

        const todo = await todomodel.findById(id);

        return res.json({
            sucess: true,
            todo: todo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

app.get('*', (req, res) => {
    const options = {
        root: path.join(__dirname, 'frontend', 'build'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
    const fileName = 'index.html';
    res.sendFile(fileName, options)
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});