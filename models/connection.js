const color=require('colors')
const mongoose = require("mongoose");
mongoose.set(`strictQuery`,false)
const db = mongoose.connect(
  "mongodb://0.0.0.0:27017/euro-sports",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(()=> console.log("Database connected".green))
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



const cartSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "user"
  } ,
  
  cartItems:[{
   productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
   quantity:{type:Number,default:1}
    }],
 })


 const addressSchema=new  mongoose.Schema({

    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  address:[
    {
      fname:{type:String},
      lname:{type:String},
      apartment:{type:String},
      street:{type:String},
      city:{type:String},
      district:{type:String},
      state:{type:String},
      pincode:{type:Number},
      mobile:{type:Number},
      email:{type:String}
    }
  ]


})

const orderSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  orders: [{

    
        fname:String,
        lname:String,
        productDetails:Array,
        paymentMethod: String,
        paymentStatus: String,
        totalAmount: Number,
        totalQuantity: Number,
        shippingAddress: Object,
        OrdrStatus:String,
        status: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: new Date()
        },
        orderStatus:{
          type:String,default:"Ordered"
      },
  }]
})



module.exports = {
  user:mongoose.model('user',userSchema),
  category:mongoose.model('category',categorySchema),
  product:mongoose.model('product',productSchema),
  cart:mongoose.model('cart',cartSchema),
  address:mongoose.model('address',addressSchema),
  order:mongoose.model('order',orderSchema)

}