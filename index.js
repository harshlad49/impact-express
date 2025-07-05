const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
// const User = require('./models/Users')
const Product = require('./models/Product')
const cors = require('cors')

app.use(express.json())
app.use(cors())
mongoose.connect('mongodb+srv://harshlad492002:harshlad492002@cluster0.pdfw2qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
console.log('Connected to MongoDB!')
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
app.post('/createproduct', async (req, res) => {
  try {
    const { name, price, category, inStock } = req.body;

    const product = new Product({ name, price, category, inStock });

    const newProduct = await product.save();

    return res.status(201).json({ message: "new product added" },newProduct);
  } catch (error) {
    res.status(500).json({ message: "An erroe occers", error });
  }
});
app.get('/product', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "An erroe occers", error });
  }
});
app.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({message:"product already exists" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "An erroe occers", error });
  }
});

app.put('/product/:id', async (req, res) => {
  try {
    const update = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!update) return res.status(404).json({ message: 'Product not found' });

    res.json(update);
  } catch (error) {
   res.status(500).json({ message: "An erroe occers", error });
  }
});
app.delete('/product/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(400).json({message: 'Product not found'  });

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ message: "An erroe occers", error });
  }
});
app.get('/products/in-stock', async (req, res) => {
  try {
    const inStockProducts = await Product.find({ inStock: true });
    res.json(inStockProducts);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
