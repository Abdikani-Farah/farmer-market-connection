import { useState, useEffect } from "react";
import { api } from "../../context/AuthContext.jsx";
import OrderCard from "../../components/OrderCard.jsx";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchOrders = async () => {
        setLoading(true);

        try {
            const res = await api.get("/admin/orders");

            if (res.data.success) {
                setOrders(res.data.data);
            }

        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);


    const handleUpdateStatus = async (orderId, newStatus) => {

        try {
            const res = await api.put(
                `/orders/${orderId}/status`,
                {
                    status: newStatus
                }
            );

            if (res.data.success) {
                fetchOrders();
            }

        } catch (err) {
            console.log(err);
            alert("Failed to update order status");
        }
    };


    const filteredOrders =
        statusFilter === "ALL"
            ? orders
            : orders.filter(
                (order) => order.status === statusFilter
            );


    const statuses = [
        "ALL",
        "PENDING",
        "ACCEPTED",
        "PROCESSING",
        "READY_FOR_DELIVERY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "COMPLETED",
        "REJECTED",
        "CANCELLED"
    ];


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-900">
                    All Orders
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage all customer orders
                </p>

            </div>


            {/* Status Filter */}

            <div className="flex flex-wrap gap-2 mb-6">

                {statuses.map((status) => (

                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={
                            statusFilter === status
                                ? "px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
                                : "px-3 py-2 rounded-lg bg-white border text-gray-700 text-sm hover:bg-gray-100"
                        }
                    >
                        {status.replace(/_/g, " ")}
                    </button>

                ))}

            </div>


            {/* Orders */}

            {loading ? (

                <div className="text-center py-10">
                    Loading orders...
                </div>

            ) : filteredOrders.length === 0 ? (

                <div className="bg-white border rounded-xl p-10 text-center">

                    <p className="text-gray-500">
                        No orders found.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {filteredOrders.map((order) => (

                        <OrderCard
                            key={order._id}
                            order={order}
                            userRole="ADMIN"
                            onUpdateStatus={handleUpdateStatus}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminOrders;