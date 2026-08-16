import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingResources, approveResource, rejectResource } from '../../Store/Education/Action';

const PendingSubmissions = () => {
    const dispatch = useDispatch();
    const { pendingResources } = useSelector(store => store.education);

    useEffect(() => {
        dispatch(getPendingResources());
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Student Submissions</h1>
            <div className="grid gap-4">
                {pendingResources?.map(res => (
                    <div key={res.id} className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{res.title}</h3>
                            <p className="text-sm text-gray-500">
                                Type: <span className="font-semibold">{res.type}</span> | Submitted by: {res.uploadedBy?.fullName || "Student"}
                            </p>
                            <a 
                                href={res.fileUrl || res.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-blue-600 text-sm font-semibold hover:underline mt-1 inline-block"
                            >
                                Open File / Link &rarr;
                            </a>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => dispatch(approveResource(res.id))} 
                                className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Approve
                            </button>
                            <button 
                                onClick={() => dispatch(rejectResource(res.id))} 
                                className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
                {(!pendingResources || pendingResources.length === 0) && (
                    <p className="text-gray-500">No pending submissions to review.</p>
                )}
            </div>
        </div>
    );
};

export default PendingSubmissions;