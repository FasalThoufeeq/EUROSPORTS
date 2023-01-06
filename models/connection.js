const mongoose = require("mongoose");
mongoose.set(`strictQuery`,false)
const db = mongoose.connect(
  "mongodb://0.0.0.0:27017/euro-sports",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(()=> console.log("Database connected"))
  .catch(()=> console.log(err));






const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
    

      },
      email: {
        type: String,
        required: true,
        
      },
      password: {
        type: String,
        required: true,
      
      },
      number:{
        type:Number,
        // minlength:10,
      },
      blocked:{
        type:Boolean,default:false
      },
      CreatedAt:{
      type:Date,
      deafault:Date.now,
      }
   
});





const categorySchema=new mongoose.Schema({

  categoryname:{
    type:String,
  }
})



const productSchema=new mongoose.Schema({

  productname:{
    type:String
  },

  description:{
    type:String
  },

  quantity:{
    type:Number
  },

  price:{
    type:Number
  },

  category:{
    type:String
  },

  image:{
    type:String
  }

})

module.exports = {
  user:mongoose.model('user',userSchema),
  category:mongoose.model('category',categorySchema),
  product:mongoose.model('product',productSchema)

}