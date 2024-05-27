require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

//Connect Database
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    const mes = {
        "status":200,
        "message":"Everything is working fine"
    }
    res.send(mes);
})

app.route("/api/auth/signup")
.post(async(req,res)=>{
    try{
        console.log("request body",req.body)
        const { user, email, password, phone } = req.body;

        const query = 'INSERT INTO user_table(name, contact, email, password) VALUES ($1, $2, $3, $4)';
    
        pool.query(query, [user, phone, email, password], (err, result) => {
          if (err) {
            console.error('Error executing query', err);
            res.status(500).send({status:500});
          } else {
            console.log("Data entered in database successfully");
            console.log('Query result:', result.rows);
            res.status(200).send({status:200});
          }
        });

    } catch (err) {
        console.log("Error :",err.message);
        res.status(500).send({status:500});
    }
});


app.route("/api/auth/login")
.post(async (req, res) => {
    try {
        console.log("request body", req.body)
        const { email, password } = req.body;

        // Check if the email exists in the database
        const query = `SELECT * FROM user_table WHERE email = $1`;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            // Email not found
            return res.status(404).json({ status: 404, message: "Email not found" });
        }

        const user = result.rows[0];
        if (user.password !== password) {
            // Incorrect password
            return res.status(401).json({ status: 401, message: "Incorrect password" });
        }

        // Email and password are correct
        console.log("Login successful");
        res.status(200).json({ status: 200, message: "Login successful", user: { email: user.email, name: user.name } });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});



app.listen(port,()=>{
    console.log("Server started on port no :",port);
});
