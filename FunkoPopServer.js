//Node.js Server 
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join("C:\\Users\\keily\\OneDrive\\Desktop\\COSC 498- Capstone Project", "public")));

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});
//Node.js Server

//SQL Database- Create New User
const sqlite3 = require("sqlite3").verbose();

const dataB = new sqlite3.Database("./database.dataB");

dataB.run(`
CREATE TABLE IF NOT EXISTS users (
    username TEXT UNIQUE,
    password TEXT,
    birthDate INTEGER,
    age INTEGER,
    email TEXT
)
`);

app.post("/register", (req, res) => {

    const {
        username,
        password,
        birthDate,
        age,
        email
    } = req.body;

    const sql = `
        INSERT INTO users
        (username, password, birthDate, age, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    dataB.run(
        sql,
        [username, password, birthDate, age, email],
        function(err) {

            
        if (err) {
            return res.send("Error");
        }

        window.location.href ="C:\\Users\\keily\\OneDrive\\Desktop\\COSC 498- Capstone Project\\FunkoPop- Capstone Project Userprofile.html" ;

            });
});

const bcrypt = require("bcrypt");
const hashedPassword = await bcrypt.hash(password, 10);
// SQL Database- Create New User
//SQL Database Login User
const express = require("express");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        dataB.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword],
            function(err) {
                if (err) {
                    return res.status(400).send(err.message);
                }

                res.send("User registered successfully!");
            }
        );

    } catch (err) {
        res.status(500).send("Server error");
    }
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    dataB.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, user) => {

            if (err)
                return res.status(500).send(err.message);

            if (!user)
                return res.status(401).send("Invalid username or password");

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                res.send("Login successful!");
            } else {
                res.status(401).send("Invalid username or password");
            }
        }
    );
});