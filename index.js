const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const User = require('./models/Users')
const cors = require('cors')

app.use(express.json())
app.use(cors())
mongoose.connect('mongodb+srv://harshlad492002:harshlad492002@cluster0.pdfw2qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
console.log('Connected to MongoDB!')
app.post('/signup', async (req, res) => {
  try {
    const { name, email, age, address } = req.body;

   
    const user = new User({ name, email, age, address });
    const newUser = await user.save();

   
    return res.status(201).json({
      message: 'User registered successfully', newUser
    });
  } catch (error) {
    console.error(error);          
    return res.status(500).json({   
      error: 'Server error'
    });
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Server error'
    });
  }
});


app.get('/users/:id', async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    if(!user){
      return res.status(400).json({message: 'User not found'})
    }
      res.json(user)
    }catch(error){
      console.error(error)
      return res.status(500).json({error: 'Server error'})
      
  }
  })
app.put('/users/:id', async (req, res) => {
  try{
    const update = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!update){
      return res.status(400).json({message: 'User not found'})
    }
      res.json(update)
    }catch(error){
      return res.status(500).json({error: 'Server error'})
      console.error(error)
  }
  })
app.delete('/users/:id', async (req, res) => {
  try{
    const deleted = await User.findByIdAndDelete(req.params.id)
    if(!deleted){
      return res.status(400).json({message: 'User not found'})
    }
      res.json(deleted);
    }catch(error){
      return res.status(500).json({error: 'Server error'})
      console.error(error)
  }
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
