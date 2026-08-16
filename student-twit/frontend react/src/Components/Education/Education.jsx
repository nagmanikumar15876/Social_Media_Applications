import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBranches, getSemesters, getSubjects } from '../../Store/Education/Action';
import SubjectDetails from './SubjectDetails';

const Education = () => {
    const dispatch = useDispatch();
    const { education } = useSelector(store => store);

    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch]);

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch);
        setSelectedSemester(null);
        setSelectedSubject(null);
        dispatch(getSemesters(branch.id));
    };

    const handleSemesterSelect = (semester) => {
        setSelectedSemester(semester);
        setSelectedSubject(null);
        dispatch(getSubjects(semester.id));
    };

    if (selectedSubject) {
        return <SubjectDetails subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
    }

    return (
        <div className="p-6 w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Education Hub</h1>

            {/* Breadcrumbs */}
            <div className="text-gray-600 mb-6 font-medium flex items-center gap-2">
                <span className="cursor-pointer hover:text-blue-600" onClick={() => setSelectedBranch(null)}>
                    All Branches
                </span>
                {selectedBranch && (
                    <>
                        <span>&gt;</span>
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => setSelectedSemester(null)}>
                            {selectedBranch.code}
                        </span>
                    </>
                )}
                {selectedSemester && (
                    <>
                        <span>&gt;</span>
                        <span>Semester {selectedSemester.semesterNumber}</span>
                    </>
                )}
            </div>

            {/* Step 1: Branches Grid */}
            {!selectedBranch ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {education?.branches?.map(b => (
                        <div 
                            key={b.id} 
                            onClick={() => handleBranchSelect(b)} 
                            className="p-6 border rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-md transition bg-white"
                        >
                            <h2 className="text-2xl font-bold text-blue-600">{b.code}</h2>
                            <p className="text-gray-600 mt-1">{b.name}</p>
                        </div>
                    ))}
                </div>
            ) : !selectedSemester ? (
                /* Step 2: Semesters Grid */
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {education?.semesters?.map(s => (
                        <div 
                            key={s.id} 
                            onClick={() => handleSemesterSelect(s)} 
                            className="p-6 border rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-500 text-center transition bg-white"
                        >
                            <h2 className="text-lg font-bold text-gray-800">Semester {s.semesterNumber}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                /* Step 3: Subjects List */
                <div className="grid grid-cols-1 gap-3">
                    {education?.subjects?.map(sub => (
                        <div 
                            key={sub.id} 
                            onClick={() => setSelectedSubject(sub)} 
                            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between items-center bg-white shadow-sm"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">{sub.name}</h2>
                            <span className="text-sm font-bold bg-blue-100 text-blue-700 py-1 px-3 rounded-full">
                                {sub.code}
                            </span>
                        </div>
                    ))}
                    {education?.subjects?.length === 0 && (
                        <p className="text-gray-400">No subjects added for this semester yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Education;