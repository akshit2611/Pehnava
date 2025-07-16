require('dotenv').config();
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');
const port=process.env.PORT||3000;
const db=require('./config/mongoose-connection');
const userRoute=require('./routes/userRoute');
const ownerRoute=require('./routes/ownerRoute');
const productRoute=require('./routes/productRoute');

// Connect to MongoDB using env variable
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use("/user", userRoute);
app.use("/owner", ownerRoute);
app.use("/product", productRoute);

app.get('/', (req, res) => {
    res.render('register');
});
app.get ('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('index');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/community', (req, res) => {
    res.render('community');
});
app.get("/user/read",async(req,res)=>{
    let deleteduser=await datamodel.findOneAndDelete({});
    res.send(deleteduser);
})
// Registration route
const User = require('./models/usermodel');
const LoginRecord = require('./models/loginrecord');

// Route to show all users with delete option
app.get('/user/delete', async (req, res) => {
    try {
        const users = await User.find({});
        let html = `<h2 style='font-family:sans-serif;'>Registered Users</h2>`;
        if (users.length === 0) {
            html += `<p>No users found.</p>`;
        } else {
            html += `<ul style='font-family:sans-serif;'>`;
            users.forEach(user => {
                html += `<li style='margin-bottom:10px;'>
                    <strong>Name:</strong> ${user.username} | <strong>Email:</strong> ${user.email} | <strong>PinCode:</strong> ${user.PinCode}
                    <form method='POST' action='/user/delete/${user._id}' style='display:inline;'>
                        <button type='submit' style='background:red;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;'>Delete</button>
                    </form>
                </li>`;
            });
            html += `</ul>`;
        }
        res.send(html);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Failed to fetch users');
    }
});

// Route to delete a specific user by ID
app.post('/user/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/user/delete');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Failed to delete user');
    }
});

// Temporary in-memory store for all login attempts (for demonstration)
let loginUsers = [];
module.exports.loginUsers = loginUsers;

app.post('/login', async (req, res) => {
    const { username, email } = req.body;
    // Check if user exists in registered users
    const user = await User.findOne({ username, email });
    if (user) {
        // Show user details with date/time on /user/login/read
        loginUsers.unshift({ username: user.username, email: user.email, createdAt: user.createdAt });
        module.exports.loginUsers = loginUsers;
        res.redirect('/register');
    } else {
        // Save failed login attempt to LoginRecord
        const record = new LoginRecord({ username, email });
        await record.save();
        res.redirect('/register');
    }
});

app.post('/create', async (req, res) => {
    try {
        const { username, PinCode, email } = req.body;
        // Check for empty fields
        if (!username || !email || !PinCode) {
            res.send('<script>alert("Please fill all fields to register."); window.location.href="/";</script>');
            return;
        }
        // Always save new user, allow duplicates
        const newUser = new User({ username, PinCode, email });
        await newUser.save();
        // After registration, redirect to /user/read
        res.redirect('/register');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Registration failed');
    }
});

app.listen(port, () => {
    console.log(`Server is running`);
});