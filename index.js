const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const app = express()
const port = 3000
const User = require('./models/Users')
const jwt = require('jsonwebtoken');
const authMiddleware = require('./models/middleware/authMiddleware');
require('dotenv').config();
// const Product = require('./models/Product')
const cors = require('cors')



app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
next();
})
mongoose.connect(process.env.Mongo_URI_Public)
console.log('Connected to MongoDB!')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.Email_Public,
    pass: process.env.Pass_Public
  }
});
// take token form id



// app.post('/signup', async (req, res) => {
//   try {
//     const { name, email, age, address } = req.body;

   
//     const user = new User({ name, email, age, address });
//     const newUser = await user.save();

   
//     return res.status(201).json({
//       message: 'User registered successfully', newUser
//     });
//   } catch (error) {
//     console.error(error);          
//     return res.status(500).json({   
//       error: 'Server error'
//     });
//   }
// });
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: 'Server error'
//     });
//   }
// });


// app.get('/users/:id', async (req, res) => {
//   try{
//     const user = await User.findById(req.params.id)
//     if(!user){
//       return res.status(400).json({message: 'User not found'})
//     }
//       res.json(user)
//     }catch(error){
//       console.error(error)
//       return res.status(500).json({error: 'Server error'})
      
//   }
//   })
// app.put('/users/:id', async (req, res) => {
//   try{
//     const update = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
//     if(!update){
//       return res.status(400).json({message: 'User not found'})
//     }
//       res.json(update)
//     }catch(error){
//       return res.status(500).json({error: 'Server error'})
//       console.error(error)
//   }
//   })
// app.delete('/users/:id', async (req, res) => {
//   try{
//     const deleted = await User.findByIdAndDelete(req.params.id)
//     if(!deleted){
//       return res.status(400).json({message: 'User not found'})
//     }
//       res.json(deleted);
//     }catch(error){
//       return res.status(500).json({error: 'Server error'})
//       console.error(error)
//   }
//   })
// app.post('/createproduct', async (req, res) => {
//   try {
//     const { name, price, category, inStock } = req.body;

//     const product = new Product({ name, price, category, inStock });

//     const newProduct = await product.save();

//     return res.status(201).json({ message: "new product added" },newProduct);
//   } catch (error) {
//     res.status(500).json({ message: "An erroe occers", error });
//   }
// });
// app.get('/product', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "An erroe occers", error });
//   }
// });
// app.get('/product/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) return res.status(404).json({message:"product already exists" });

//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: "An erroe occers", error });
//   }
// });

// app.put('/product/:id', async (req, res) => {
//   try {
//     const update = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true
//     });

//     if (!update) return res.status(404).json({ message: 'Product not found' });

//     res.json(update);
//   } catch (error) {
//    res.status(500).json({ message: "An erroe occers", error });
//   }
// });
// app.delete('/product/:id', async (req, res) => {
//   try {
//     const deleted = await Product.findByIdAndDelete(req.params.id);

//     if (!deleted) return res.status(400).json({message: 'Product not found'  });

//     res.json(deleted);
//   } catch (error) {
//     res.status(500).json({ message: "An erroe occers", error });
//   }
// });
// app.get('/products/in-stock', async (req, res) => {
//   try {
//     const inStockProducts = await Product.find({ inStock: true });
//     res.json(inStockProducts);
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred", error });
//   }
// });
app.post('/registers', async (req, res) => {
  try {
    const { name, email, age, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    await transporter.sendMail({
      from: process.env.Email_Public,
      to: email,
      subject: 'OTP for Sign-Up in Parul App',
      text: `Hello ${name} Sir, You otp is  ${otp}.Don't share it with anyone else.`
    });
   const user = new User({ name, email, age, address,password:hashedPassword, otp });

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
app.post('/login', async (req, res) => {  
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); 
    
    if (!user) return res.status(400).json({ message: 'User not found' });
    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(400).json({ message: 'Invalid password' });

    const token = await jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );


    return res.status(200).json({
      message: 'Login successful',token
         
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});
app.get('/users/:id', async (req, res) => { 
  try{
    const result = await User.findById(req.params.id)
    if(!result){
      return res.status(400).json({message: 'User not found'})
    }
      res.json(result)
    }catch(error){
      console.error(error)
      return res.status(500).json({message: 'Server error'})
      
  }
});

app.put('/users/:id', async (req, res) => {
  try{
    const update = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!update){
      return res.status(400).json({message: 'User not found'})
    }
      res.json(update)
    }catch(error){
      return res.status(500).json({message: 'Server error'})
  }
});

app.delete('/users/:id', async (req, res) => {
  try{
    const deleted = await User.findByIdAndDelete(req.params.id)
    if(!deleted){
      return res.status(400).json({message: 'User not found'})
    }
      res.json(deleted);
    }catch(error){
      return res.status(500).json({error: 'Server error'})      
  }
});
app.get('/usersdata/search', async (req, res) => {

  try {
  const {q} =req.query;
  const user = await User.find({ $or:[{name: { $regex:q,$options:'i'}},
     { email: { $regex: q,$options:'i' } },
   ]});
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.get('/usersdata/filter', authMiddleware, async (req, res) => {
  try {
    const min = parseInt(req.query.min) || 0;
    const max = parseInt(req.query.max) || 100;
    const user = await User.find({ age: { $gte: min, $lte: max } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});
app.get('/usersdatapageinate/pageinate', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    const user = await User.find({}).skip(skip).limit(limit)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.get('/usersdata/count', async (req, res) => {
  try {
    const user = await User.countDocuments({})
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

app.get('/usersdata/latestuser', async (req, res) => {
  try {
    const n = parseInt(req.query.n) || 1;
    const user = await User.find().sort({ _id: -1 }).limit(n)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
