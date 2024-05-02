const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const forumsFilePath = path.join(__dirname, 'data', 'forums.json');
const forumIdFilePath = path.join(__dirname, 'data', 'forumId.json');

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
