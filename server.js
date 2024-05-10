const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

process.env.API_KEY = 'sk-proj-3kSj7gFlHwWeiGJIjzyPT3BlbkFJnikEwGq0XEMLALOLAuNG';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const forumsFilePath = path.join(__dirname, 'data', 'forums.json');
const forumIdFilePath = path.join(__dirname, 'data', 'forumId.json');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connectToDatabase();

// Define MongoDB collections for users
const db = client.db('forumDB');
const usersCollection = db.collection('users');

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}


// Initialize forumId from file or set to 1 if file doesn't exist
let forumId = 1;
if (fs.existsSync(forumIdFilePath)) {
    forumId = parseInt(fs.readFileSync(forumIdFilePath, 'utf8'));
} else {
    fs.writeFileSync(forumIdFilePath, forumId.toString());
}

// Route to the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});


app.get('/', (req, res) => {
    res.render('index', { apiKey: process.env.API_KEY });
});


// Get all forums
app.get('/forums', (req, res) => {
    fs.readFile(forumsFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading forum data.');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Post a new forum
app.post('/forums', (req, res) => {
    const { title, description } = req.body;
    fs.readFile(forumsFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading forum data.');
            return;
        }
        const forums = JSON.parse(data);
        const newForum = { id: forumId++, title, description, messages: [] };
        forums.push(newForum);
        fs.writeFile(forumsFilePath, JSON.stringify(forums, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error saving forum data.');
                return;
            }
            // Update forumId file with the new forumId
            fs.writeFile(forumIdFilePath, forumId.toString(), (err) => {
                if (err) {
                    console.error('Error updating forumId file:', err);
                }
            });
            res.send('Forum created successfully.');
        });
    });
});

// Add a message to a forum
app.post('/forums/:id/messages', (req, res) => {
    const { message } = req.body;
    const { id } = req.params;
    fs.readFile(forumsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading forum data.');
            return;
        }
        let forums = JSON.parse(data);
        const forum = forums.find(f => f.id == id);
        if (forum) {
            if (!forum.messages) {
                forum.messages = [];
            }
            forum.messages.push(message);
            fs.writeFile(forumsFilePath, JSON.stringify(forums, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error updating forum data.');
                    return;
                }
                res.send('Message added successfully.');
            });
        } else {
            res.status(404).send('Forum not found.');
        }
    });
});

// Get messages of a forum
app.get('/forums/:id/messages', (req, res) => {
    const { id } = req.params;
    fs.readFile(forumsFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading forum data.');
            return;
        }
        const forums = JSON.parse(data);
        const forum = forums.find(f => f.id == id);
        if (forum) {
            const messages = forum.messages || [];
            res.json(messages);
        } else {
            res.status(404).send('Forum not found.');
        }
    });
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hash password and save user to database
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashedPassword });

        res.send('Registration successful');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Registration failed');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password');
        }

        res.send('Login successful');
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).send('Login failed');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
