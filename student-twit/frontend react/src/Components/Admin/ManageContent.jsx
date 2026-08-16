import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBranches, getSemesters, getSubjects } from '../../Store/Education/Action';
import { uploadToCloudinary } from '../../Utils/UploadToCloudinary';
import { api } from '../../Config/apiConfig';

const ManageContent = () => {
    const dispatch = useDispatch();
    const { education } = useSelector(store => store);

    const [branchForm, setBranchForm] = useState({ name: '', code: '' });
    const [semesterForm, setSemesterForm] = useState({ branchId: '', semesterNumber: '' });
    const [subjectForm, setSubjectForm] = useState({ branchId: '', semesterId: '', name: '', code: '' });

    const [resourceForm, setResourceForm] = useState({
        branchId: '',
        semesterId: '',
        subjectId: '',
        title: '',
        type: 'NOTES',
        url: '',
        fileUrl: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    // Handlers for dynamic dropdown selections
    const handleBranchSelect = (branchId) => {
        setSubjectForm(prev => ({ ...prev, branchId }));
        dispatch(getSemesters(branchId));
    };

    const handleSemesterSelect = (semesterId) => {
        setSubjectForm(prev => ({ ...prev, semesterId }));
        dispatch(getSubjects(semesterId));
    };

    const handleResourceBranchSelect = (branchId) => {
        setResourceForm(prev => ({ ...prev, branchId }));
        dispatch(getSemesters(branchId));
    };

    const handleResourceSemesterSelect = (semesterId) => {
        setResourceForm(prev => ({ ...prev, semesterId }));
        dispatch(getSubjects(semesterId));
    };

    // Submissions
    const createBranch = async (e) => {
        e.preventDefault();
        await api.post('/api/admin/education/branches', branchForm);
        alert("Branch created successfully!");
        setBranchForm({ name: '', code: '' });
        dispatch(getBranches());
    };

    const createSemester = async (e) => {
        e.preventDefault();
        await api.post(`/api/admin/education/branches/${semesterForm.branchId}/semesters`, {
            semesterNumber: semesterForm.semesterNumber
        });
        alert("Semester created!");
        setSemesterForm({ branchId: '', semesterNumber: '' });
    };

    const createSubject = async (e) => {
        e.preventDefault();
        await api.post(`/api/admin/education/semesters/${subjectForm.semesterId}/subjects`, {
            name: subjectForm.name,
            code: subjectForm.code
        });
        alert("Subject created!");
        setSubjectForm({ branchId: '', semesterId: '', name: '', code: '' });
    };

    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setUploading(true);
    //         const uploadedUrl = await uploadToCloudinary(file);
    //         if (uploadedUrl) {
    //             setResourceForm(prev => ({ ...prev, fileUrl: uploadedUrl }));
    //         }
    //         setUploading(false);
    //     }
    // };

    const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setUploading(true);
        // Pass "raw" as the second argument to handle PDFs
        const uploadedUrl = await uploadToCloudinary(file, "raw"); 
        
        if (uploadedUrl) {
            setResourceForm(prev => ({ ...prev, fileUrl: uploadedUrl }));
        }
        setUploading(false);
    }
};

    const directUpload = async (e) => {
        e.preventDefault();
        await api.post(`/api/admin/education/subjects/${resourceForm.subjectId}/resources`, resourceForm);
        alert("Resource published instantly to students!");
        setResourceForm({
            branchId: '',
            semesterId: '',
            subjectId: '',
            title: '',
            type: 'NOTES',
            url: '',
            fileUrl: ''
        });
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900">Manage Platform Education Content</h1>

            {/* 1. Branch */}
            <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold text-lg mb-3">1. Add New Branch</h3>
                <form onSubmit={createBranch} className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Branch Name (e.g. Computer Science)" className="border p-2 rounded" value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} required />
                    <input type="text" placeholder="Branch Code (e.g. CSE)" className="border p-2 rounded" value={branchForm.code} onChange={e => setBranchForm({ ...branchForm, code: e.target.value })} required />
                    <button type="submit" className="col-span-2 bg-gray-900 text-white py-2 rounded font-bold">Add Branch</button>
                </form>
            </div>

            {/* 2. Semester */}
            <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold text-lg mb-3">2. Add Semester to Branch</h3>
                <form onSubmit={createSemester} className="grid grid-cols-2 gap-3">
                    <select className="border p-2 rounded" value={semesterForm.branchId} onChange={e => setSemesterForm({ ...semesterForm, branchId: e.target.value })} required>
                        <option value="">-- Select Branch --</option>
                        {education.branches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <input type="number" placeholder="Semester Number (e.g. 5)" className="border p-2 rounded" value={semesterForm.semesterNumber} onChange={e => setSemesterForm({ ...semesterForm, semesterNumber: e.target.value })} required />
                    <button type="submit" className="col-span-2 bg-gray-900 text-white py-2 rounded font-bold">Add Semester</button>
                </form>
            </div>

            {/* 3. Subject */}
            <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold text-lg mb-3">3. Add Subject</h3>
                <form onSubmit={createSubject} className="grid grid-cols-2 gap-3">
                    <select className="border p-2 rounded" value={subjectForm.branchId} onChange={e => handleBranchSelect(e.target.value)} required>
                        <option value="">-- Select Branch --</option>
                        {education.branches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={subjectForm.semesterId} onChange={e => handleSemesterSelect(e.target.value)} required>
                        <option value="">-- Select Semester --</option>
                        {education.semesters?.map(s => <option key={s.id} value={s.id}>Semester {s.semesterNumber}</option>)}
                    </select>
                    <input type="text" placeholder="Subject Name" className="border p-2 rounded" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
                    <input type="text" placeholder="Subject Code" className="border p-2 rounded" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} required />
                    <button type="submit" className="col-span-2 bg-gray-900 text-white py-2 rounded font-bold">Add Subject</button>
                </form>
            </div>

            {/* 4. Direct Upload */}
            <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-bold text-lg mb-3">4. Direct Publish Resource (Auto-Approved)</h3>
                <form onSubmit={directUpload} className="grid grid-cols-2 gap-3">
                    <select className="border p-2 rounded" value={resourceForm.branchId} onChange={e => handleResourceBranchSelect(e.target.value)} required>
                        <option value="">-- Select Branch --</option>
                        {education.branches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={resourceForm.semesterId} onChange={e => handleResourceSemesterSelect(e.target.value)} required>
                        <option value="">-- Select Semester --</option>
                        {education.semesters?.map(s => <option key={s.id} value={s.id}>Semester {s.semesterNumber}</option>)}
                    </select>
                    <select className="border p-2 rounded col-span-2" value={resourceForm.subjectId} onChange={e => setResourceForm({ ...resourceForm, subjectId: e.target.value })} required>
                        <option value="">-- Select Subject --</option>
                        {education.subjects?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={resourceForm.type} onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })}>
                        <option value="NOTES">Notes (PDF)</option>
                        <option value="LECTURE">Lecture Video (Link)</option>
                        <option value="PYQ">Previous Year Question (PDF)</option>
                        <option value="BOOK">Reference Book</option>
                    </select>
                    <input type="text" placeholder="Resource Title" className="border p-2 rounded" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} required />

                    {resourceForm.type === 'LECTURE' ? (
                        <input type="url" placeholder="YouTube URL" className="border p-2 rounded col-span-2" value={resourceForm.url} onChange={e => setResourceForm({ ...resourceForm, url: e.target.value })} required />
                    ) : (
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-600">Select PDF File for Cloudinary</label>
                            <input type="file" accept="application/pdf" className="border p-2 rounded w-full mt-1" onChange={handleFileUpload} required={!resourceForm.fileUrl} />
                            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading PDF to Cloudinary...</p>}
                            {resourceForm.fileUrl && !uploading && <p className="text-xs text-green-600 mt-1">Ready to publish!</p>}
                        </div>
                    )}

                    <button type="submit" disabled={uploading} className="col-span-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                        Publish Instantly
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageContent;