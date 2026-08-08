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

//SQL Database
const sqlite3 = require("sqlite3").verbose();

const dataB = new sqlite3.Database("./users.dataB");

dataB.run(`
CREATE TABLE IF NOT EXISTS users (
    username TEXT UNIQUE,
    password TEXT,
    birthDate INTEGER,
    age INTEGER,
    email TEXT
)
    ALTER TABLE users ADD COLUMN is_online INTEGER DEFAULT 0;
    ALTER TABLE users ADD COLUMN last_seen TEXT;
`);
// SQL Database

//SQL Database Hold New User Info
const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    const user = {
        name: document.getElementById("InputUserName").value,
        password: document.getElementById("InputPassword").value,
        birthday: document.getElementById("EnterBirthday").value,
        age: document.getElementById("EnterAge").value,
        email: document.getElementById("UserEmail").value
    };

    try {
        const response = await fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error("Failed to save user");
        }

        const result = await response.json();

        window.location.href = `window.location.href='file:///C:/Users/keily/OneDrive/Desktop/COSC%20498-%20Capstone%20Project/FunkoPop-%20Capstone%20Project%20Userprofile.html`;
    } catch (error) {
        console.error(error);
        alert("Unable to create user.");
    }
});

const express = require("express");

const app = express();
app.use(express.json());

app.post("/users", (req, res) => {
    const { username, password, birthDate, age, email } = req.body;

    const sql = `
        INSERT INTO users (username, password, birthDate, age, email)
        VALUES (?, ?, ?, ?, ?)
    `;
    dataB.run(sql, [username, password, birthDate, age, email], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "User added"
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//SQL Database Hold New User Info

//SQL Database Pull User Info
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginData = {
        username: document.getElementById("Username").value,
        password: document.getElementById("Password").value
    };

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    const result = await response.json();

    if (result.success) {
        // Redirect after successful login
        window.location.href = `window.location.href='file:///C:/Users/keily/OneDrive/Desktop/COSC%20498-%20Capstone%20Project/FunkoPop-%20Capstone%20Project%20Userprofile.html`;
    } else {
        alert("Invalid username or password.");
    }
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    dataB.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
            if (err) {
                return res.status(500).json({ success: false });
            }

            if (!user || user.password !== password) {
                return res.json({ success: false });
            }

            res.json({
                success: true,
            });
        }
    );
});
//SQL Database Pull User Info

//User Online Status
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const db = new sqlite3.Database('./users.dataB');

app.use(express.static('public'));

io.on('connection', (socket) => {

    socket.on('user-authenticated', (userId) => {
        socket.userId = userId;
        const sql = `UPDATE users SET is_online = 1, last_seen = datetime('now') WHERE id = ?`;
        dataB.run(sql, [userId], (err) => {
            if (err) return console.error(err.message);

            broadcastUserStatuses();
        });
    });

    socket.on('disconnect', () => {
        if (!socket.userId) return;

        const sql = `UPDATE users SET is_online = 0, last_seen = datetime('now') WHERE id = ?`;
        dataB.run(sql, [socket.userId], (err) => {
            if (err) return console.error(err.message);
            
            broadcastUserStatuses();
        });
    });
});

function broadcastUserStatuses() {
    const sql = `SELECT id, username, is_online, last_seen FROM users`;
    dataB.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);
        io.emit('status-update', rows);
    });
}

server.listen(8080, () => console.log('Server running on port 3000'));