import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminCourseCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!title || !description || !price || !contentURL) {
      setMessage('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        price: parseFloat(price),
        contentAccessURL: contentURL,
        createdAt: new Date(),
        isActive: true
      });
      setMessage(`Course "${title}" added successfully!`);
      setTitle('');
      setDescription('');
      setPrice('');
      setContentURL('');
    } catch (err) {
      setMessage('Error adding course: ' + (err?.message || String(err))); 
    }
    setLoading(false);
  };

  return (
    <div className="border rounded p-4 my-6 max-w-lg">
      <h3 className="text-xl font-semibold mb-3">Add New Course</h3>
      {message && (
        <p className={message.includes('successfully') ? 'text-green-600' : 'text-red-600'}>{message}</p>
      )}
      <form onSubmit={handleAddCourse} className="space-y-3 mt-3">
        <input className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Title" required />
        <textarea className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input className="w-full border p-2 rounded" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (INR)" required />
        <input className="w-full border p-2 rounded" value={contentURL} onChange={(e) => setContentURL(e.target.value)} placeholder="Course Content URL (Protected)" required />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          {loading ? 'Adding Course...' : 'Add Course to Platform'}
        </button>
      </form>
    </div>
  );
};

const AdminPage = () => {
  const { userProfile } = useAuth();
  return (
    <div className="page-container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Admin Panel 🛠️</h1>
      <p className="mt-2">Welcome, {userProfile?.email}! You have administrative access.</p>
      <AdminCourseCreator />
    </div>
  );
};

export default AdminPage;

