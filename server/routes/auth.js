const bcrypt = require('bcrypt');
const connectToMongo = require('../db');
const jwt = require('jsonwebtoken');
const secretJWT = '623262f1c9c9490399bd13d4868aa832'

const signUp = async (req, res) => {
    try {

        //connect to the database
        const client = await connectToMongo();
        // Extract the password from the request body
        const { name, email, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user object with the hashed password
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword
        };

        // Insert the new user into the database
        const db = await client.db("xmeter");

        const user = await db.collection("users").find({ email });
        console.log(user);
        if (user) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            res.end("User already exists!");
            return;
        }
        const result = await db.collection("users").insertOne(newUser);

        if (!result.acknowledged) {
            throw new Error('Failed to insert user');
        }

        //generate token
        const token = jwt.sign({ email: email, name: name }, secretJWT, { expiresIn: '36d' })

        // Send response
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            success: true,
            user: {
                name: name,
                email: email
            },
            token: token
        }));
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

//login logic
const login = async (req, res) => {
    try {
        //connect to the database
        const client = await connectToMongo();
        // Extract the email and password from the request body
        const { email, password } = req.body;

        // Find the user with the email
        const db = await client.db("xmeter");
        const user = await db.collection("users").findOne({ email: email });

        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'User not found' }));
            return;
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Invalid password' }));
            return;
        }

        const token = jwt.sign({ email: user.email, name: user.name }, secretJWT, { expiresIn: '36d' })

        // Send response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            success: true,
            user: {
                name: user.name,
                email: user.email,
            },
            token: token
        }));
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

const logout = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'User logged out' }));
}


const getUser = async (req, res) => {
    // Extract the user from the request object
    const userEmail = req.user.email;

    //get the user from the database
    const client = await connectToMongo();
    const db = await client.db("xmeter");
    const users = await db.collection("users");

    const user = await users.findOne({ email: userEmail });

    if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'User not found' }));
        return;
    }

    // Send response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        success: true, user: {
            name: user.name,
            email: user.email
        }
    }));
}

module.exports = { signUp, login, logout, getUser };
