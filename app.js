const express = require ('express');
const app = express();
const path=require('path');
const userModel =require('./models/user');
const cookieParser =require('cookie-parser');
const bcrypt =require('bcrypt');
const jwt =require('jsonwebtoken');
const sellerModel =require('./models/seller')
const gigModel=require('./models/gig');


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/home', (req,res) => {
    
    res.render("home",);
  
})
app.get('/', (req,res) => {
    
    res.render("index",);
  
})
app.get('/read', async (req,res) => {
    let users= await userModel.find();
    res.render("read",{users});
  
})
app.get('/readgig', async (req,res) => {
    let gigs= await gigModel.find();
    res.render("readgig",{gigs});
  
})

app.get('/home', async (req,res) => {
    let bigs= await gigModel.find();
    console.log(gigs);
    res.render("home",{bigs});
  
})
app.get('/client', async (req,res) => {
    let sellers= await sellerModel.find();
    res.render("readseller",{sellers});
  
})

app.get('/delete/:id', async (req,res) => {
    let users= await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect("/read");
  
})
app.get('/edit/:id', async (req,res) => {
    let user= await userModel.findOne({_id:req.params.id});
    res.render("edit",{user});
  
})
app.post('/update/:id', async (req,res) => {
    let {name,email,image}=req.body;
    let user= await userModel.findOneAndUpdate({_id:req.params.id},{image,name,email},{new:true});
    res.redirect("/read");
  
})

app.post('/create', async (req, res) => {
    let { name, email, password, age } = req.body;
    
    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).redirect('/profileclient');

    // Hash the password and create the user
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                name,
                email,
                password: hash,
                age
            });

            // Store user ID in a cookie to retrieve it in /profileclient
            res.cookie('userId', createdUser._id);

            // Set JWT token
            let token = jwt.sign({ email }, "secret");
            res.cookie("cookie", token);

            // Redirect to client profile page
            res.redirect('/profileclient');
        });
    });
});




app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");
})

app.get("/login",function(req,res){
    console.log(req.user);
    res.render("login");
})

app.post("/login", async function(req,res){
    let user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send("either password or the email is incorrect");
    
    bcrypt.compare(req.body.password,user.password ,function(err,result){
        console.log(result)
        if(result) {
            let token =jwt.sign({email:user.email},"secret");
res.cookie("cookie",token);
res.redirect("/home");


        }
        else res.send("check password again");
    })
});


app.post('/creategig', async (req, res) => {
    let { title, price, category, description, workexperience } = req.body;
    let sellerId = req.cookies.sellerId; // Assume sellerId is stored in cookies after login

    // Ensure sellerId exists
    if (!sellerId) return res.status(401).send("Seller not authenticated.");

    // Create gig with the seller's ID
    let createdGig = await gigModel.create({
        title,
        price,
        category,
        description,
        workexperience,
        sellerId
    });

    res.redirect("profileseller");
    console.log(createdGig);
});
app.get('/readgig', async (req, res) => {
    const sellerId = req.cookies.sellerId; // Retrieve sellerId from cookies

    // Ensure sellerId exists
    if (!sellerId) return res.status(401).send("Seller not authenticated.");

    // Find gigs by this specific seller
    let gigs = await gigModel.find({ sellerId });
    
    // Render `readgig` view and pass the gigs for this seller
    res.render('readgig', { gigs });
});


app.get('/seller',(req,res) => {
    res.render("seller");
  
}
)
app.post('/createseller', async (req,res) => {
    let{name,email,bio,qualification,skills,residence}=req.body;
    let createdseller= await sellerModel.create({
        name,
        email,
        bio,
        qualification,
        skills,
        residence,
        
    });
    
       // Store seller ID in a cookie to retrieve it in /profileseller
       res.cookie('sellerId', createdseller._id);
    
       // Redirect to profile page
       res.redirect('/profileseller');
  
    });


app.get('/uploadgig',(req,res) => {
    res.render("gig")
  
}

)
app.get('/profileseller', async (req, res) => {
    // Retrieve the seller ID from the cookie
    const sellerId = req.cookies.sellerId;
    
    // Fetch seller details using the ID
    let seller = await sellerModel.findById(sellerId);
    if (!seller) return res.send("Seller profile not found.");

    // Pass the seller's data to the EJS view
    res.render('profileseller', { seller });
});
app.get('/profileclient', async (req, res) => {
    // Retrieve the user ID from the cookie
    const userId = req.cookies.userId;
    
    // Fetch user details using the ID
    let user = await userModel.findById(userId);
    if (!user) return res.send("Client profile not found.");

    // Pass the user data to the EJS view
    res.render('profileclient', { user });
});



app.post("/uploadgig",async function(req,res){
    let user = await  userModel.findOne({email:req.body.email});
 console.log(user);
    if(!user) return res.send("something is wrong");
    bcrypt.compare(req.body.password,user.password,function (err, result)  {
     if(result)   
     {
         let token =jwt.sign({email:user.email},"secret");
 res.cookie("cookie",token);
 res.send("hjgedj")
     }
     
      
    }
    )
 
 })
 



app.get('/client',(req,res) => {
    res.render("client")
  
}
)
app.get('/clientorders',(req,res) => {
    res.send("chal rha client ke orders")
  
}
)
app.get('/client/:id', async (req,res) => {
    let user= await userModel.findOne({_id:req.params.id});
    res.render("edit",{user});
  
})
app.get('/orders',(req,res) => {
    res.send("orders chal gya")
}
)



function isLoggedIn(req,res,next){
    if(req.cookies.token ==="") res.send("you must be logged in");
        else{
    jwt.verify(req.cookies.token,"secret")
    req.user=data;}
    next();
}








 app.listen (3000);
