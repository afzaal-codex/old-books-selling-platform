import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatusAction } from "../../store/slices/orderSlice";
import toast from "react-hot-toast";
import { Package, Truck, CheckCircle2, Clock, ShieldAlert, Eye, Search, SlidersHorizontal, UserCheck, MessageSquare, FileDown } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { jsPDF } from "jspdf";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  // States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [payMethodFilter, setPayMethodFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [searchTransactionId, setSearchTransactionId] = useState("");

  const [employees, setEmployees] = useState([]);
  const [notesState, setNotesState] = useState({
    processingNotes: "",
    deliveryNotes: "",
    approvalNotes: "",
    internalNotes: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setEmployees(res.data || []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setNotesState({
        processingNotes: selectedOrder.processingNotes || "",
        deliveryNotes: selectedOrder.deliveryNotes || "",
        approvalNotes: selectedOrder.approvalNotes || "",
        internalNotes: selectedOrder.internalNotes || "",
      });
    }
  }, [selectedOrder]);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await dispatch(updateOrderStatusAction({ id: orderId, orderStatus: newStatus })).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      dispatch(fetchAllOrders());
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPayStatus) => {
    try {
      const res = await dispatch(updateOrderStatusAction({ id: orderId, paymentStatus: newPayStatus })).unwrap();
      toast.success(`Payment status updated to ${newPayStatus}`);
      dispatch(fetchAllOrders());
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleAssignEmployee = async (orderId, employeeId) => {
    try {
      const res = await dispatch(updateOrderStatusAction({ id: orderId, assignedEmployee: employeeId || "" })).unwrap();
      toast.success("Employee assignment updated successfully!");
      dispatch(fetchAllOrders());
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res);
      }
    } catch (error) {
      toast.error(error.message || "Failed to assign employee");
    }
  };

  const handleSaveNotes = async () => {
    try {
      const res = await dispatch(updateOrderStatusAction({ 
        id: selectedOrder._id, 
        ...notesState 
      })).unwrap();
      toast.success("Order notes and timeline log updated!");
      dispatch(fetchAllOrders());
      setSelectedOrder(res);
    } catch (error) {
      toast.error(error.message || "Failed to save notes");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/orders/admin/report-csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders-report-6months-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("6-Month Report exported successfully!");
    } catch (err) {
      console.error("Failed to download report:", err);
      toast.error("Failed to download report");
    }
  };

  const generateInvoicePDF = (order) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFillColor(17, 17, 20);
    doc.rect(0, 0, 210, 45, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(212, 175, 55);
    doc.text("NBookr World", 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text("Premium & Rare Book Collections", 15, 26);
    doc.text("info@nbookrworld.com | +92 300 1234567", 15, 32);

    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("INVOICE", 150, 22);

    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(`Order #: ${order.orderNumber || "N/A"}`, 150, 28);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 34);

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(0, 45, 210, 45);

    doc.setFontSize(11);
    doc.setTextColor(17, 17, 20);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO (SHIPPING ADDRESS):", 15, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Name: ${order.shippingAddress?.fullName || order.user?.name || "Guest"}`, 15, 67);
    doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 15, 73);
    doc.text(`Email: ${order.shippingAddress?.email || "N/A"}`, 15, 79);
    doc.text(`City: ${order.shippingAddress?.city || "N/A"}`, 15, 85);
    doc.text(`Address: ${order.shippingAddress?.address || "N/A"}`, 15, 91);

    doc.setFontSize(11);
    doc.setTextColor(17, 17, 20);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INFORMATION:", 120, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Method: ${order.paymentMethod || "COD"}`, 120, 67);
    doc.text(`Status: ${order.paymentStatus || "Pending"}`, 120, 73);
    if (order.transactionId) {
      doc.text(`Txn ID: ${order.transactionId}`, 120, 79);
    }

    let y = 105;
    doc.setFillColor(17, 17, 20);
    doc.rect(15, y, 180, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(212, 175, 55);
    doc.text("BOOK TITLE", 20, y + 5);
    doc.text("QTY", 125, y + 5);
    doc.text("UNIT PRICE (Rs.)", 145, y + 5);
    doc.text("TOTAL (Rs.)", 175, y + 5);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    
    order.orderItems.forEach((item) => {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(15, y, 195, y);

      const title = item.title.length > 50 ? item.title.substring(0, 48) + "..." : item.title;
      doc.text(title, 20, y + 5);
      doc.text(item.quantity.toString(), 127, y + 5);
      doc.text(item.price.toLocaleString(), 147, y + 5);
      doc.text((item.price * item.quantity).toLocaleString(), 177, y + 5);
      y += 8;
    });

    doc.setDrawColor(17, 17, 20);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    y += 5;

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    doc.text("Subtotal:", 140, y);
    doc.text(`Rs. ${order.subtotal?.toLocaleString()}`, 175, y);
    y += 6;

    if (order.couponDiscount > 0) {
      doc.text("Discount:", 140, y);
      doc.text(`Rs. -${order.couponDiscount?.toLocaleString()}`, 175, y);
      y += 6;
    }

    doc.text("Delivery Charges:", 140, y);
    doc.text(`Rs. ${order.deliveryCharges?.toLocaleString()}`, 175, y);
    y += 7;

    doc.setFillColor(17, 17, 20);
    doc.rect(125, y - 4, 75, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(212, 175, 55);
    const totalLabel = (order.paymentMethod === "COD" || order.paymentStatus !== "Paid") ? "Total Payable Amount:" : "Total Paid Amount:";
    doc.text(totalLabel, 128, y + 1);
    doc.text(`Rs. ${order.totalPrice?.toLocaleString()}`, 175, y + 1);

    y += 25;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 17, 20);
    doc.text("THANK YOU FOR YOUR PURCHASE!", 15, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Please keep this invoice copy for package returns or inquiries.", 15, y + 5);
    doc.text("All sales are governed by the platform terms of service.", 15, y + 9);

    doc.save(`Invoice-${order.orderNumber || order._id}.pdf`);
  };

  const handleDownloadInvoice = async (order) => {
    if (order.downloadCount > 0) {
      const confirmDownload = window.confirm(
        `This invoice has already been downloaded ${order.downloadCount} time(s). Are you sure you want to download it again?`
      );
      if (!confirmDownload) return;
    }

    try {
      generateInvoicePDF(order);
      const res = await axiosInstance.put(`/orders/${order._id}/increment-download`);
      if (res.data.success) {
        toast.success("Invoice downloaded successfully!");
        dispatch(fetchAllOrders());
        if (selectedOrder && selectedOrder._id === order._id) {
          setSelectedOrder(prev => ({ ...prev, downloadCount: res.data.downloadCount }));
        }
      }
    } catch (err) {
      console.error("Failed to increment download count:", err);
      toast.error("Failed to track download count");
    }
  };

  // Filter orders in frontend
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    const matchesMethod = !payMethodFilter || order.paymentMethod === payMethodFilter;
    const matchesCity = !cityFilter || order.shippingAddress?.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesCustomer = !searchCustomer ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      order.shippingAddress?.email?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      order.shippingAddress?.phone?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchCustomer.toLowerCase());
    const matchesOrderNumber = !searchOrderNumber ||
      order.orderNumber?.toLowerCase().includes(searchOrderNumber.toLowerCase());
    const matchesTransactionId = !searchTransactionId ||
      order.transactionId?.toLowerCase().includes(searchTransactionId.toLowerCase());

    return matchesStatus && matchesMethod && matchesCity && matchesCustomer && matchesOrderNumber && matchesTransactionId;
  });

  // Calculate Order statistics
  const getStats = () => {
    let pendingCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let totalRevenue = 0;
    let codCount = 0;

    orders.forEach((order) => {
      if (order.orderStatus === "Pending Payment Verification" || order.orderStatus === "Approved") pendingCount++;
      if (order.orderStatus === "Delivered") deliveredCount++;
      if (order.orderStatus === "Cancelled") cancelledCount++;
      if (order.orderStatus !== "Cancelled") totalRevenue += order.totalPrice;
      if (order.paymentMethod === "COD") codCount++;
    });

    return { pendingCount, deliveredCount, cancelledCount, totalRevenue, codCount };
  };

  const stats = getStats();

  const statusWorkflow = [
    "Pending Payment Verification",
    "Payment Verified",
    "Payment Failed",
    "Approved",
    "Processing",
    "Ready to Ship",
    "Shipped",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Returned",
    "Return Processing",
    "Refunded",
    "Cancelled",
    "Hold",
  ];

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Order Operations Dashboard</h1>
          <p className="text-sm text-gray-400 mt-2">Manage customer transactions, tracking parameters, and delivery workflows</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-black font-extrabold rounded-xl hover:opacity-90 transition cursor-pointer text-xs uppercase tracking-wider h-fit"
        >
          <FileDown size={14} />
          Download 6-Month Report
        </button>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase">Total Orders</span>
          <span className="text-2xl font-black text-white">{orders.length}</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase text-yellow-500">Pending Orders</span>
          <span className="text-2xl font-black text-yellow-500">{stats.pendingCount}</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase text-emerald-400">Delivered</span>
          <span className="text-2xl font-black text-emerald-400">{stats.deliveredCount}</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase text-blue-400">COD Orders</span>
          <span className="text-2xl font-black text-blue-400">{stats.codCount}</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-455 block font-semibold uppercase text-[var(--color-primary)]">Revenue Generated</span>
          <span className="text-xl font-black text-[var(--color-primary)]">{stats.totalRevenue} PKR</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-5 grid gap-4 md:grid-cols-6">
        <div className="flex items-center bg-neutral-900 border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-primary)] transition-all duration-300">
          <input
            type="text"
            placeholder="Search Customer..."
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
            className="flex-1 bg-transparent px-3 py-3 text-xs outline-none text-white placeholder-gray-500"
          />
          <div className="h-5 w-[1px] bg-neutral-800" />
          <div className="px-2 py-1.5 flex items-center justify-center">
            <div className="bg-[var(--color-primary)] text-black p-1 rounded-lg flex items-center justify-center">
              <Search size={12} strokeWidth={2.5} style={{ color: "#000000" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center bg-neutral-900 border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-primary)] transition-all duration-300">
          <input
            type="text"
            placeholder="Order Number..."
            value={searchOrderNumber}
            onChange={(e) => setSearchOrderNumber(e.target.value)}
            className="flex-1 bg-transparent px-3 py-3 text-xs outline-none text-white placeholder-gray-500 uppercase"
          />
          <div className="h-5 w-[1px] bg-neutral-800" />
          <div className="px-2 py-1.5 flex items-center justify-center">
            <div className="bg-[var(--color-primary)] text-black p-1 rounded-lg flex items-center justify-center">
              <Search size={12} strokeWidth={2.5} style={{ color: "#000000" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center bg-neutral-900 border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-primary)] transition-all duration-300">
          <input
            type="text"
            placeholder="Transaction ID..."
            value={searchTransactionId}
            onChange={(e) => setSearchTransactionId(e.target.value)}
            className="flex-1 bg-transparent px-3 py-3 text-xs outline-none text-white placeholder-gray-500 uppercase font-mono"
          />
          <div className="h-5 w-[1px] bg-neutral-800" />
          <div className="px-2 py-1.5 flex items-center justify-center">
            <div className="bg-[var(--color-primary)] text-black p-1 rounded-lg flex items-center justify-center">
              <Search size={12} strokeWidth={2.5} style={{ color: "#000000" }} />
            </div>
          </div>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs outline-none focus:border-[var(--color-primary)] cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statusWorkflow.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={payMethodFilter}
            onChange={(e) => setPayMethodFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs outline-none focus:border-[var(--color-primary)] cursor-pointer"
          >
            <option value="">All Payments</option>
            <option value="COD">Cash On Delivery (COD)</option>
            <option value="JazzCash">JazzCash</option>
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Filter City..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-xs outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
            <tr>
              <th className="px-6 py-4">Order ID & Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Payment status</th>
              <th className="px-6 py-4">Order status</th>
              <th className="px-6 py-4">Total Price</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {filteredOrders.map((order) => {
              return (
                <tr key={order._id} className="hover:bg-neutral-900/40 transition">
                  <td className="px-6 py-4">
                    {order.orderNumber && (
                      <span className="text-xs font-bold text-white uppercase tracking-wider block">{order.orderNumber}</span>
                    )}
                    <span className="font-mono text-[9px] text-gray-555 block">ID: {order._id}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{new Date(order.createdAt).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-150 block text-xs">{order.shippingAddress?.fullName || order.user?.name}</span>
                    <span className="text-[10px] text-gray-500 block">{order.shippingAddress?.city}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-xs text-gray-300">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.paymentStatus === "Paid" ? "bg-emerald-950/30 text-emerald-450 border border-emerald-800" : "bg-red-950/20 text-red-400 border border-red-900"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className="bg-neutral-900 border border-[var(--color-border)] rounded-lg text-xs py-1 px-2.5 outline-none cursor-pointer focus:border-[var(--color-primary)] text-white"
                    >
                      {statusWorkflow.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-200">
                    {order.totalPrice} PKR
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-[var(--color-primary)] border border-transparent hover:border-neutral-750 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-[var(--color-primary)] border border-transparent hover:border-neutral-750 transition cursor-pointer flex items-center gap-1.5"
                        title={`Download Invoice PDF (${order.downloadCount || 0} downloads)`}
                      >
                        <FileDown size={16} />
                        <span className="text-[10px] text-gray-400 font-mono font-bold bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                          {order.downloadCount || 0}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-2xl text-white relative shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto animate-zoomIn">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-[var(--color-primary)]">
                  Order Details - {selectedOrder.orderNumber || "No Order Number"}
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">ID: {selectedOrder._id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs px-3 py-1.5 bg-neutral-900 border border-[var(--color-border)] rounded-xl hover:border-red-500 transition cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-[var(--color-primary)] flex items-center gap-1.5"><Truck size={14} /> Shipping Details</h4>
                <p><span className="text-gray-450">Recipient Name:</span> {selectedOrder.shippingAddress.fullName}</p>
                <p><span className="text-gray-455">Contact Number:</span> {selectedOrder.shippingAddress.phone}</p>
                <p><span className="text-gray-455">Email Address:</span> {selectedOrder.shippingAddress.email}</p>
                <p><span className="text-gray-455">Destination City:</span> {selectedOrder.shippingAddress.city}</p>
                <p><span className="text-gray-455">Delivery Address:</span> {selectedOrder.shippingAddress.address}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[var(--color-primary)] flex items-center gap-1.5"><CheckCircle2 size={14} /> Payment Details</h4>
                <p><span className="text-gray-455">Payment Gateway:</span> {selectedOrder.paymentMethod}</p>
                <p><span className="text-gray-455">Payment Status:</span> {selectedOrder.paymentStatus}</p>
                <p><span className="text-gray-455">Total Price:</span> {selectedOrder.totalPrice} PKR</p>
                <p><span className="text-gray-455">Invoice Downloads:</span> {selectedOrder.downloadCount || 0} times</p>
                {selectedOrder.transactionId && (
                  <p><span className="text-gray-455 font-bold">Transaction ID:</span> <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-850">{selectedOrder.transactionId}</span></p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] text-[var(--color-primary)] transition cursor-pointer text-xs"
                  >
                    <FileDown size={14} />
                    Download Invoice PDF
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-gray-455">Actions:</span>
                  <button
                    onClick={() => handleUpdatePaymentStatus(selectedOrder._id, "Paid")}
                    className="px-3 py-1 rounded bg-emerald-900/40 text-emerald-450 border border-emerald-850 hover:bg-emerald-900 text-[10px] cursor-pointer font-bold transition"
                  >
                    Set Paid
                  </button>
                  <button
                    onClick={() => handleUpdatePaymentStatus(selectedOrder._id, "Pending")}
                    className="px-3 py-1 rounded bg-red-950/20 text-red-400 border border-red-850 hover:bg-red-950 text-[10px] cursor-pointer font-bold transition"
                  >
                    Set Pending
                  </button>
                </div>
              </div>
            </div>

            {/* Proof screenshot preview */}
            {selectedOrder.paymentScreenshot && (
              <div className="space-y-2 pt-2 border-t border-neutral-900 text-xs">
                <span className="text-gray-400 font-bold block">Payment Screenshot Proof</span>
                <a href={selectedOrder.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="inline-block max-h-48 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-2 hover:border-gray-500 transition">
                  <img src={selectedOrder.paymentScreenshot} alt="payment verification" className="max-h-40 object-contain rounded-lg" />
                </a>
              </div>
            )}

            {/* Staff dropdown and notes editing fields */}
            <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-neutral-900 text-xs">
              <div className="space-y-4">
                <h4 className="font-bold text-[var(--color-primary)] flex items-center gap-1.5"><UserCheck size={14} /> Staff Assignments</h4>
                <div className="space-y-2">
                  <label className="text-gray-400 block text-[10px]">Assign Employee</label>
                  <select
                    value={selectedOrder.assignedEmployee?._id || selectedOrder.assignedEmployee || ""}
                    onChange={(e) => handleAssignEmployee(selectedOrder._id, e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 block text-[10px]">Internal Notes (Admins Only)</label>
                  <textarea
                    rows={2}
                    value={notesState.internalNotes}
                    onChange={(e) => setNotesState({ ...notesState, internalNotes: e.target.value })}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-2.5 outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Admin internal comments..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-[var(--color-primary)] flex items-center gap-1.5"><MessageSquare size={14} /> Order Processing Notes</h4>
                
                <div className="space-y-2">
                  <label className="text-gray-400 block text-[10px]">Approval Notes</label>
                  <textarea
                    rows={1}
                    value={notesState.approvalNotes}
                    onChange={(e) => setNotesState({ ...notesState, approvalNotes: e.target.value })}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-2 outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Approval comments shared with customer..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 block text-[10px]">Processing Updates</label>
                  <textarea
                    rows={1}
                    value={notesState.processingNotes}
                    onChange={(e) => setNotesState({ ...notesState, processingNotes: e.target.value })}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-2 outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Details about stock prep, package etc..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400 block text-[10px]">Delivery Updates</label>
                  <textarea
                    rows={1}
                    value={notesState.deliveryNotes}
                    onChange={(e) => setNotesState({ ...notesState, deliveryNotes: e.target.value })}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-2 outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Tracking codes or courier details..."
                  />
                </div>
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-6 py-2.5 bg-[var(--color-primary)] text-black font-extrabold rounded-xl hover:opacity-90 transition cursor-pointer text-xs"
                >
                  Save Notes & Logs
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 pt-4 border-t border-neutral-900">
              <h4 className="font-bold text-[var(--color-primary)] text-xs uppercase tracking-wider">Ordered Books</h4>
              <div className="space-y-2.5">
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs text-gray-300 bg-neutral-900/50 p-3 rounded-xl border border-neutral-900">
                    <span className="font-medium text-gray-200">{item.title}</span>
                    <span>{item.price} PKR x {item.quantity} = {item.price * item.quantity} PKR</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity History Logs */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="pt-4 border-t border-neutral-900 space-y-3 text-xs">
                <h4 className="font-bold text-[var(--color-primary)] uppercase tracking-wider">Historical status updates</h4>
                <div className="relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-850">
                  {selectedOrder.timeline.map((item, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
                      <div className="flex justify-between items-center text-gray-300 font-semibold">
                        <span>{item.status}</span>
                        <span className="text-[10px] text-gray-500">{new Date(item.actionDate).toLocaleString()}</span>
                      </div>
                      {item.notes && <p className="text-gray-400 italic text-[11px] leading-tight">{item.notes}</p>}
                      <span className="text-[10px] text-gray-500 block">By: {item.actionBy || "System"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
