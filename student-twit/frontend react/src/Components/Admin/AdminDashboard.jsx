import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import your Admin components
import PendingSubmissions from './PendingSubmissions';
import ManageContent from './ManageContent';
import CreateClubForm from '../Club/CreateClubForm'; 
import UsersTable from './UsersTable'; // <-- 1. Import the new table!

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('PENDING');
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-gray-100">
            
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-6 flex flex-col gap-3">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-2">Admin Panel</h2>
                
                <button 
                    onClick={() => setActiveTab('PENDING')} 
                    className={`text-left p-3 rounded-lg font-semibold transition ${activeTab === 'PENDING' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    Review Submissions
                </button>
                
                <button 
                    onClick={() => setActiveTab('ADD_CONTENT')} 
                    className={`text-left p-3 rounded-lg font-semibold transition ${activeTab === 'ADD_CONTENT' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    Add Branches & Uploads
                </button>

                {/* NEW: Users List Tab */}
                <button 
                    onClick={() => setActiveTab('USERS')} 
                    className={`text-left p-3 rounded-lg font-semibold transition ${activeTab === 'USERS' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    View All Users
                </button>

                <button 
                    onClick={() => setActiveTab('MANAGE_CLUBS')} 
                    className={`text-left p-3 rounded-lg font-semibold transition ${activeTab === 'MANAGE_CLUBS' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    Manage Clubs
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
                {activeTab === 'PENDING' && <PendingSubmissions />}
                {activeTab === 'ADD_CONTENT' && <ManageContent />}
                
                {/* 2. Show the Users Table when the tab is clicked */}
                {activeTab === 'USERS' && <UsersTable />}
                
                {activeTab === 'MANAGE_CLUBS' && (
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Edit or Delete Existing Clubs</h3>
                                <p className="text-gray-500 mt-1">
                                    To change a President, edit details, or delete a club entirely, go to the directory and click "Manage" on any club.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/clubs')}
                                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition whitespace-nowrap"
                            >
                                Go to Clubs Directory
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="text-black">
                                <CreateClubForm />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default AdminDashboard;