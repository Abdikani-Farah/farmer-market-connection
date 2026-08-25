import { useState, useEffect } from "react";
import { api } from "../../context/AuthContext.jsx";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");


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

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-900">
                    Users
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage registered users
                </p>

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
                                                user.isActive !== false
                                                    ? "text-green-600 font-semibold text-sm"
                                                    : "text-red-600 font-semibold text-sm"
                                            }
                                        >
                                            {user.isActive !== false
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
                                                        user.isActive !== false
                                                    )
                                                }
                                                className={
                                                    user.isActive !== false
                                                        ? "text-red-600 border border-red-200 px-3 py-1 rounded-lg text-sm"
                                                        : "text-green-600 border border-green-200 px-3 py-1 rounded-lg text-sm"
                                                }
                                            >
                                                {user.isActive !== false
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

        </div>
    );
}

export default AdminUsers;