const API_URL = '/api/posts';

// Fetch and Display Posts on load
document.addEventListener('DOMContentLoaded', fetchPosts);

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();
        const postsList = document.getElementById('posts-list');
        
        if (posts.length === 0) {
            postsList.innerHTML = '<p class="loading-text">No posts yet. Create your first post!</p>';
            return;
        }

        postsList.innerHTML = posts.map(post => `
            <div class="post glass-panel">
                <h3>${post.title}</h3>
                <div class="meta">👤 By ${post.author} | 📅 ${post.date}</div>
                <p>${post.content}</p>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete Post</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function createPost() {
    // ID me exact wahi naam use kiya hai jo index.html me hai
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    if (!title || !author || !content) {
        alert('Please fill all fields!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, author })
        });

        if (response.ok) {
            // Form clear karo
            document.getElementById('title').value = '';
            document.getElementById('author').value = '';
            document.getElementById('content').value = '';
            // Naya post fetch karo
            fetchPosts(); 
        } else {
            alert("Kuch error aaya hai!");
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert("Server se connect nahi ho pa raha!");
    }
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) fetchPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}