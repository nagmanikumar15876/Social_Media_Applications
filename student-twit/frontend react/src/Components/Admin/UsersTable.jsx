import React, { useState, useEffect } from 'react';
import { api } from '../../Config/apiConfig'; 
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Avatar, CircularProgress, TextField, IconButton, Tooltip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // State for the search bar

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const { data } = await api.get('/api/users/admin/all'); 
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, []);

    // Function to handle deleting a user
    const handleDeleteUser = async (userId) => {
        if (window.confirm(`Are you sure you want to permanently delete User ID: ${userId}?`)) {
            try {
                await api.delete(`/api/users/admin/${userId}/delete`);
                // Remove the user from the screen instantly without reloading the page
                setUsers(users.filter(user => user.id !== userId));
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user. They might be tied to other records (like tweets or clubs).");
            }
        }
    };

    // Filter the users based on what the Admin types in the search bar
    const filteredUsers = users.filter((user) => {
        const nameMatch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const idMatch = user.id?.toString().includes(searchQuery);
        return nameMatch || emailMatch || idMatch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Campus Directory</h3>
                    <p className="text-gray-500">
                        Search for a student to assign them to a club, or remove their account.
                    </p>
                </div>

                {/* SEARCH BAR */}
                <TextField
                    variant="outlined"
                    placeholder="Search by Name, Email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: '300px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className="text-gray-400" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: '20px', bgcolor: '#f9fafb' }
                    }}
                />
            </div>

            <TableContainer component={Paper} className="shadow-none border border-gray-200 rounded-lg">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell><strong>ID Number</strong></TableCell>
                            <TableCell><strong>Student / User</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell className="font-extrabold text-blue-600 text-lg">
                                        {user.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar src={user.image} alt={user.fullName} sx={{ width: 32, height: 32 }} />
                                            <span className="font-medium text-gray-800">{user.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{user.email}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'ROLE_ADMIN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.role || "STUDENT"}
                                        </span>
                                    </TableCell>
                                    
                                    {/* DELETE ACTION BUTTON */}
                                    <TableCell align="center">
                                        <Tooltip title="Delete User">
                                            <IconButton 
                                                onClick={() => handleDeleteUser(user.id)} 
                                                color="error"
                                                // Prevent the admin from accidentally deleting themselves!
                                                disabled={user.role === 'ROLE_ADMIN'} 
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="py-10 text-gray-500">
                                    No users found matching "{searchQuery}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default UsersTable;