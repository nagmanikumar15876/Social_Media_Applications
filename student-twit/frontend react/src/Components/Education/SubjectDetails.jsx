import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResources, submitResource, deleteResource } from '../../Store/Education/Action';
import { uploadToCloudinary } from '../../Utils/UploadToCloudinary';

const SubjectDetails = ({ subject, onBack }) => {
    const dispatch = useDispatch();
    const { education, auth } = useSelector(store => store);
    const isAdmin = auth?.user?.role === 'ROLE_ADMIN';

    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'NOTES',
        url: '',
        fileUrl: ''
    });

    useEffect(() => {
        dispatch(getResources(subject.id));
    }, [subject.id, dispatch]);

//    const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         setUploading(true);
//         // Pass "auto" as the second argument to handle PDFs
//         const uploadedUrl = await uploadToCloudinary(file, "auto"); 
        
//         if (uploadedUrl) {
//             setFormData(prev => ({ ...prev, fileUrl: uploadedUrl }));
//         }
//         setUploading(false);
//     }
// };

const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setUploading(true);
        
        // CHANGE THIS LINE: Pass "raw" instead of "auto" or nothing
        const uploadedUrl = await uploadToCloudinary(file, "raw"); 
        
        if (uploadedUrl) {
            setFormData(prev => ({ ...prev, fileUrl: uploadedUrl }));
        }
        setUploading(false);
    }
};

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(submitResource(subject.id, formData));
        setShowModal(false);
        setFormData({ title: '', type: 'NOTES', url: '', fileUrl: '' });
    };

    const handleDelete = (resourceId) => {
        if (window.confirm("Admin: Delete this resource permanently?")) {
            dispatch(deleteResource(resourceId, subject.id));
        }
    };

    const notes = education?.resources?.filter(r => r.type === 'NOTES') || [];
    const lectures = education?.resources?.filter(r => r.type === 'LECTURE') || [];
    const pyqs = education?.resources?.filter(r => r.type === 'PYQ') || [];
    const books = education?.resources?.filter(r => r.type === 'BOOK') || [];

    return (
        <div className="p-6 w-full max-w-4xl mx-auto">
            <button onClick={onBack} className="text-blue-600 font-semibold mb-4 hover:underline">
                &larr; Back to Subjects
            </button>

            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
                    <span className="text-sm font-semibold text-gray-500">{subject.code}</span>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Submit Resource
                </button>
            </div>

            {/* Notes */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Notes & Documents</h2>
                <div className="grid gap-2">
                    {notes.map(n => (
                        <div key={n.id} className="p-3 border rounded-lg bg-white flex justify-between items-center">
                            <a href={n.fileUrl || n.url} target="_blank" rel="noreferrer" className="text-gray-900 font-medium hover:text-blue-600">
                                📄 {n.title}
                            </a>
                            {isAdmin && (
                                <button onClick={() => handleDelete(n.id)} className="text-red-500 text-sm font-bold border border-red-400 px-2 py-1 rounded hover:bg-red-50">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {notes.length === 0 && <p className="text-gray-400 text-sm">No notes available.</p>}
                </div>
            </section>

            {/* Lectures */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Lectures & Video Links</h2>
                <div className="grid gap-2">
                    {lectures.map(l => (
                        <div key={l.id} className="p-3 border rounded-lg bg-white flex justify-between items-center">
                            <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                                <span>▶️</span> {l.title}
                            </a>
                            {isAdmin && (
                                <button onClick={() => handleDelete(l.id)} className="text-red-500 text-sm font-bold border border-red-400 px-2 py-1 rounded hover:bg-red-50">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {lectures.length === 0 && <p className="text-gray-400 text-sm">No lectures linked yet.</p>}
                </div>
            </section>

            {/* PYQ */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-red-700 mb-3">Previous Year Questions (PYQs)</h2>
                <div className="grid gap-2">
                    {pyqs.map(p => (
                        <div key={p.id} className="p-3 border rounded-lg bg-white flex justify-between items-center">
                            <a href={p.fileUrl || p.url} target="_blank" rel="noreferrer" className="text-red-600 font-medium hover:underline flex items-center gap-2">
                                <span>📝</span> {p.title}
                            </a>
                            {isAdmin && (
                                <button onClick={() => handleDelete(p.id)} className="text-red-500 text-sm font-bold border border-red-400 px-2 py-1 rounded hover:bg-red-50">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {pyqs.length === 0 && <p className="text-gray-400 text-sm">No previous year papers uploaded yet.</p>}
                </div>
            </section>

            {/* Reference Books */}
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Reference Books</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {books.map(b => (
                        <div key={b.id} className="p-4 border rounded-xl bg-white flex justify-between items-start shadow-sm">
                            <a href={b.fileUrl || b.url} target="_blank" rel="noreferrer" className="flex gap-3">
                                <span className="text-3xl">📘</span>
                                <div>
                                    <h4 className="font-bold text-gray-800">{b.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{b.fileUrl ? "PDF File" : "External Web Link"}</p>
                                </div>
                            </a>
                            {isAdmin && (
                                <button onClick={() => handleDelete(b.id)} className="text-red-500 text-xs font-bold border border-red-400 px-2 py-1 rounded">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {books.length === 0 && <p className="text-gray-400 text-sm">No reference books added yet.</p>}
                </div>
            </section>

            {/* Submit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Submit Subject Resource</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input 
                                type="text" 
                                placeholder="Resource Title" 
                                className="border p-2 rounded-lg" 
                                value={formData.title} 
                                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                required 
                            />
                            <select 
                                className="border p-2 rounded-lg" 
                                value={formData.type} 
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="NOTES">Notes (PDF)</option>
                                <option value="LECTURE">Lecture Video (URL Link)</option>
                                <option value="PYQ">Previous Year Question (PDF)</option>
                                <option value="BOOK">Reference Book</option>
                            </select>

                            {formData.type === 'LECTURE' ? (
                                <input 
                                    type="url" 
                                    placeholder="YouTube / Video URL" 
                                    className="border p-2 rounded-lg" 
                                    value={formData.url} 
                                    onChange={e => setFormData({ ...formData, url: e.target.value })} 
                                    required 
                                />
                            ) : (
                                <div>
                                    <label className="text-xs font-bold text-gray-600">Select PDF File</label>
                                    <input 
                                        type="file" 
                                        accept="application/pdf" 
                                        className="border p-2 rounded-lg w-full mt-1" 
                                        onChange={handleFileUpload} 
                                        required={!formData.fileUrl} 
                                    />
                                    {uploading && <p className="text-xs text-blue-600 mt-1">Uploading PDF to Cloudinary...</p>}
                                    {formData.fileUrl && !uploading && <p className="text-xs text-green-600 mt-1">PDF Uploaded Successfully!</p>}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={uploading} 
                                    className={`px-4 py-2 rounded-lg text-white font-bold ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectDetails;