import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userIdFromToken = decoded.id;
        setUserId(userIdFromToken);

        const response = await axios.get(`https://affworld-assignment-backend-seven.vercel.app/api/posts?userId=${userIdFromToken}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (caption && image) {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', image);
      formData.append('userId', userId);
      try {
        const response = await axios.post('https://affworld-assignment-backend-seven.vercel.app/api/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPosts([response.data, ...posts]);
        setCaption('');
        setImage(null);
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
    
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed Manager</h1>
          <nav className="space-x-4">
            <a
              href="/task"
              className="hover:underline text-sm sm:text-base"
            >
              Tasks
            </a>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="bg-red-500 px-3 py-1 rounded-lg text-sm sm:text-base"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      
      <main className="container mx-auto p-4">
        
        <form onSubmit={handlePostSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border p-2 mb-2 w-full rounded-md"
          />
          <input
            type="file"
            onChange={handleImageUpload}
            className="mb-2"
          />
          {image && (
            <div className="mb-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg w-full">
            Post
          </button>
        </form>

        <div className="posts-list grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="post bg-white p-4 border rounded-lg shadow-md">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-64 object-cover rounded-md"
              />
              <p className="caption mt-2 text-gray-700">{post.caption}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
