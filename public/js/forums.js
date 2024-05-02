document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createForumButton').addEventListener('click', createForum);
    fetchForums();
});

function createForum() {
    const titleInput = document.getElementById('forumTitle');
    const descriptionInput = document.getElementById('forumDescription');
    const title = titleInput.value;
    const description = descriptionInput.value;

    fetch('/forums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        titleInput.value = ''; // Clear the title input field
        descriptionInput.value = ''; // Clear the description input field
        fetchForums(); // Refresh the list of forums
    })
    .catch(error => console.error('Error creating forum:', error));
}

function fetchForums() {
    fetch('/forums')
    .then(response => response.json())
    .then(forums => {
        const forumsList = document.getElementById('forumsList');
        forumsList.innerHTML = '';
        forums.forEach(forum => {
            const forumDiv = document.createElement('div');
            forumDiv.className = 'forum';
            forumDiv.innerHTML = `
                <h3>${forum.title}</h3>
                <p>${forum.description}</p>
                <textarea class="comment-input" id="comment-input-${forum.id}" placeholder="Write a comment..."></textarea>
                <button onclick="postComment(${forum.id})">Submit Comment</button>
                <button class="toggle-comments-btn" onclick="toggleComments(${forum.id})">Collapse Comments</button>
                <div class="comments-container" id="comments-container-${forum.id}"></div>
            `;
            forumsList.appendChild(forumDiv);

            // Fetch comments for the forum
            fetchComments(forum.id, `comments-container-${forum.id}`);
        });
    })
    .catch(error => console.error('Error fetching forums:', error));
}

function toggleComments(forumId) {
    const commentsContainer = document.getElementById(`comments-container-${forumId}`);
    const toggleButton = document.querySelector(`#comments-container-${forumId} + .toggle-comments-btn`);

    if (commentsContainer.style.display === 'none') {
        commentsContainer.style.display = 'block';
        toggleButton.textContent = 'Collapse Comments';
    } else {
        commentsContainer.style.display = 'none';
        toggleButton.textContent = 'Expand Comments';
    }
}

function postComment(forumId) {
    const commentInput = document.getElementById(`comment-input-${forumId}`);
    const commentsContainer = document.getElementById(`comments-container-${forumId}`);

    if (!commentInput.value.trim()) {
        alert('Please write something before submitting.');
        return;
    }

    fetch(`/forums/${forumId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: commentInput.value })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        commentInput.value = ''; // Clear input after posting
        fetchComments(forumId, commentsContainer); // Refresh comments
    })
    .catch(error => console.error('Error posting comment:', error));
}

function fetchComments(forumId, containerId) {
    fetch(`/forums/${forumId}/messages`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load messages: ' + response.statusText);
        }
        return response.json();
    })
    .then(messages => {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear existing comments
        messages.forEach(message => {
            if (message) { // Check if message is not null or empty
                const messageDiv = document.createElement('div');
                messageDiv.className = 'comment';
                messageDiv.textContent = message;
                container.appendChild(messageDiv);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching comments:', error);
    });
}
