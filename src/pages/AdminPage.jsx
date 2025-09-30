import React, { useMemo, useState, useEffect } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminCourseCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [moduleLinks, setModuleLinks] = useState([{ label: 'Module 1', url: '' }]);
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
        modules: moduleLinks.filter(m => m.url?.trim()).map((m, idx) => ({ id: `m${idx+1}`, title: m.label || `Module ${idx+1}`, url: m.url })),
        createdAt: new Date(),
        isActive: true
      });
      setMessage(`Course "${title}" added successfully!`);
      setTitle('');
      setDescription('');
      setPrice('');
      setContentURL('');
      setModuleLinks([{ label: 'Module 1', url: '' }]);
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
        <div className="border rounded p-3">
          <div className="font-semibold mb-2">Module Links</div>
          {moduleLinks.map((m, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="flex-1 border p-2 rounded" value={m.label} onChange={(e) => setModuleLinks(prev => prev.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))} placeholder={`Label for module ${idx+1}`} />
              <input className="flex-[2] border p-2 rounded" value={m.url} onChange={(e) => setModuleLinks(prev => prev.map((x, i) => i === idx ? { ...x, url: e.target.value } : x))} placeholder="Video URL" />
              <button type="button" className="px-3 bg-gray-200 rounded" onClick={() => setModuleLinks(prev => prev.filter((_, i) => i !== idx))}>Remove</button>
            </div>
          ))}
          <button type="button" className="mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded" onClick={() => setModuleLinks(prev => [...prev, { label: `Module ${prev.length+1}`, url: '' }])}>Add Module</button>
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          {loading ? 'Adding Course...' : 'Add Course to Platform'}
        </button>
      </form>
    </div>
  );
};

const AdminAnalytics = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filterCollege, setFilterCollege] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const snap = await getDocs(collection(db, 'enrollments'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEnrollments(list);
      } catch (e) {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return enrollments.filter(e => (filterCollege ? (e.billingInfo?.college || '').toLowerCase().includes(filterCollege.toLowerCase()) : true));
  }, [enrollments, filterCollege]);

  const totalRevenue = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalEnrollments = filtered.length;
  const collegeWise = filtered.reduce((acc, e) => {
    const c = (e.billingInfo?.college || 'Unknown').trim() || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="border rounded p-4 my-6">
      <h3 className="text-xl font-semibold mb-3">Analytics</h3>
      {loading && <p>Loading analytics...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex gap-3 items-end mb-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by College</label>
          <input className="w-full border p-2 rounded" value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)} placeholder="Type college name..." />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-green-50 border rounded">
          <div className="text-sm text-gray-600">Total Enrollments</div>
          <div className="text-2xl font-bold">{totalEnrollments}</div>
        </div>
        <div className="p-4 bg-blue-50 border rounded">
          <div className="text-sm text-gray-600">Total Revenue (₹)</div>
          <div className="text-2xl font-bold">{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-yellow-50 border rounded">
          <div className="text-sm text-gray-600">Unique Colleges</div>
          <div className="text-2xl font-bold">{Object.keys(collegeWise).length}</div>
        </div>
      </div>
      <div className="mt-3">
        <h4 className="font-semibold mb-2">College-wise Enrollments</h4>
        <ul className="list-disc ml-5">
          {Object.entries(collegeWise).map(([name, count]) => (
            <li key={name}>{name}: {count}</li>
          ))}
        </ul>
      </div>
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
      <AdminAnalytics />
    </div>
  );
};

export default AdminPage;

