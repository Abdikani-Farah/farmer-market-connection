import { useState, useEffect } from "react";
import { api } from "../../context/AuthContext.jsx";
import { AlertCircle, Plus, UserPlus, X } from "lucide-react";

const emptyUserForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "BUYER",
    location: "Mogadishu / Afgooye",
    farmName: "",
    farmDescription: "",
};

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState(emptyUserForm);
    const [creatingUser, setCreatingUser] = useState(false);
    const [createError, setCreateError] = useState("");


    const fetchUsers = async () => {

        setLoading(true);

        try {

            const res = await api.get("/admin/users");

            if (res.data.success) {
                setUsers(res.data.data);
            }

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    const handleToggleStatus = async (userId, currentStatus) => {

        try {

            const res = await api.put(
                `/admin/users/${userId}/status`,
                {
                    isActive: !currentStatus
                }
            );

            if (res.data.success) {
                fetchUsers();
            }

        } catch (err) {

            console.log(err);
            alert("Failed to update user status");

        }
    };


    const handleCreateUser = async (event) => {

        event.preventDefault();
        setCreatingUser(true);
        setCreateError("");

        try {

            const res = await api.post("/admin/users", newUser);

            if (res.data.success) {
                setIsCreateModalOpen(false);
                setNewUser(emptyUserForm);
                fetchUsers();
            }

        } catch (err) {

            setCreateError(err.response?.data?.message || "Failed to add user.");

        } finally {

            setCreatingUser(false);

        }
    };


    const filteredUsers = users.filter((user) => {

        const name = user.name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const location = user.location?.toLowerCase() || "";

        const searchValue = search.toLowerCase();

        const matchesSearch =
            name.includes(searchValue) ||
            email.includes(searchValue) ||
            location.includes(searchValue);

        const matchesRole =
            roleFilter === "ALL" ||
            user.role === roleFilter;

        return matchesSearch && matchesRole;
    });


    const roles = [
        "ALL",
        "FARMER",
        "BUYER",
        "ADMIN"
    ];


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Users
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage registered users and create accounts for your team.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setCreateError("");
                        setIsCreateModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </button>

            </div>


            {/* Search and Role */}

            <div className="bg-white border rounded-xl p-4 mb-6">

                <div className="flex flex-col sm:flex-row gap-4">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, email or location..."
                        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                    />


                    <div className="flex flex-wrap gap-2">

                        {roles.map((role) => (

                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={
                                    roleFilter === role
                                        ? "px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
                                        : "px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
                                }
                            >
                                {role}
                            </button>

                        ))}

                    </div>

                </div>

            </div>


            {/* Users */}

            {loading ? (

                <div className="text-center py-10">
                    Loading users......
                </div>

            ) : filteredUsers.length === 0 ? (

                <div className="bg-white border rounded-xl p-10 text-center">

                    <p className="text-gray-500">
                        No user found.
                    </p>

                </div>

            ) : (

                <div className="bg-white border rounded-xl overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="px-5 py-3 text-sm">
                                    Users
                                </th>

                                <th className="px-5 py-3 text-sm">
                                    Role
                                </th>

                                <th className="px-5 py-3 text-sm">
                                    Location
                                </th>

                                <th className="px-5 py-3 text-sm">
                                    Phone
                                </th>

                                <th className="px-5 py-3 text-sm">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-sm">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredUsers.map((user) => (

                                <tr
                                    key={user._id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    {/* User */}

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden font-bold">

                                                {user.profileImage ? (

                                                    <img
                                                        src={user.profileImage}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />

                                                ) : (

                                                    user.name?.charAt(0)

                                                )}

                                            </div>


                                            <div>

                                                <p className="font-semibold text-gray-900">
                                                    {user.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* Role */}

                                    <td className="px-5 py-4">

                                        <span className="text-sm font-semibold">
                                            {user.role}
                                        </span>

                                    </td>


                                    {/* Location */}

                                    <td className="px-5 py-4 text-sm">

                                        {user.location || "Somalia"}

                                    </td>


                                    {/* Phone */}

                                    <td className="px-5 py-4 text-sm">

                                        {user.phone || "-"}

                                    </td>


                                    {/* Status */}

                                    <td className="px-5 py-4">

                                        <span
                                            className={
                                                !user.isBlocked
                                                    ? "text-green-600 font-semibold text-sm"
                                                    : "text-red-600 font-semibold text-sm"
                                            }
                                        >
                                            {!user.isBlocked
                                                ? "Active"
                                                : "Suspended"}
                                        </span>

                                    </td>


                                    {/* Action */}

                                    <td className="px-5 py-4">

                                        {user.role !== "ADMIN" && (

                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(
                                                        user._id,
                                                        !user.isBlocked
                                                    )
                                                }
                                                className={
                                                    !user.isBlocked
                                                        ? "text-red-600 border border-red-200 px-3 py-1 rounded-lg text-sm"
                                                        : "text-green-600 border border-green-200 px-3 py-1 rounded-lg text-sm"
                                                }
                                            >
                                                {!user.isBlocked
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <form
                        onSubmit={handleCreateUser}
                        className="relative w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Close add user form"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-green-700">Admin User Management</div>
                            <h2 className="mt-1 text-xl font-bold text-gray-900">Add New User</h2>
                            <p className="mt-1 text-xs text-gray-500">Create a Buyer, Farmer, or Admin account.</p>
                        </div>

                        {createError && (
                            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{createError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-xs font-semibold text-gray-700">
                                <span>Full Name</span>
                                <input
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                                    placeholder="Full name"
                                />
                            </label>
                            <label className="space-y-1.5 text-xs font-semibold text-gray-700">
                                <span>Role</span>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600"
                                >
                                    <option value="BUYER">Buyer</option>
                                    <option value="FARMER">Farmer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-xs font-semibold text-gray-700">
                                <span>Email Address</span>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                                    placeholder="name@example.com"
                                />
                            </label>
                            <label className="space-y-1.5 text-xs font-semibold text-gray-700">
                                <span>Phone Number</span>
                                <input
                                    type="tel"
                                    required
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                                    placeholder="+252 61 0000000"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-xs font-semibold text-gray-700">
                                <span>Temporary Password</span>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                                    placeholder="At least 6 characters"
                                />
                            </label>
                            <label className="space-y-1.5 text-xs font-semibold text-gray-700">
                                <span>Location</span>
                                <input
                                    required
                                    value={newUser.location}
                                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                                    placeholder="Mogadishu, Somalia"
                                />
                            </label>
                        </div>

                        {newUser.role === "FARMER" && (
                            <label className="block space-y-1.5 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-900">
                                <span>Farm Name</span>
                                <input
                                    value={newUser.farmName}
                                    onChange={(e) => setNewUser({ ...newUser, farmName: e.target.value })}
                                    className="w-full rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600"
                                    placeholder="Farmer's farm name"
                                />
                            </label>
                        )}

                        <div className="flex gap-3 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creatingUser}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-xs font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <UserPlus className="h-4 w-4" />
                                {creatingUser ? "Adding User..." : "Add User"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}

export default AdminUsers;
