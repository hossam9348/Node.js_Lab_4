const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 7000;
const User = require('./models/user');
const auth = require('./middlewares/auth');
const jwt = require('jsonwebtoken');
const  bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

app.listen(PORT, (err) => {
    if (!err) return console.log(`ok on post ${PORT}`);
    console.log(err);
})

mongoose.connect('mongodb://127.0.0.1:27017/auth', (err) => {
    if (!err) return console.log("DB connected succussfully");
    console.log(err);
});

app.get('/', auth,(req, res)=>{
   console.log( req.user)  ;
res.send('welcome');
})

    // ...
    const TOKEN_KEY = "jljdl5o338"; 
    app.post("/register", async (req, res) => {

        // Our register logic starts here
        try {
            // Get user input
            const { first_name, last_name, email, password } = req.body;

            // Validate user input
            if (!(email && password && first_name && last_name)) {
                res.status(400).send("All input is required");
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            // return new user
            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
        // Our register logic ends here
    });

    // ...


    // ...

    app.post("/login", async (req, res) => {

        // Our login logic starts here
        try {
            // Get user input
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;

                // user
               return res.status(200).json(user);
            }
            res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }
        // Our register logic ends here
    });

    // // ...

