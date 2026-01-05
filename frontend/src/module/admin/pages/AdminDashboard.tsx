import { useNavigate } from "react-router-dom";
import { AdminLiveFeedModal } from "../components/AdminLiveFeedModal";
import { AdminExportModal } from "../components/AdminExportModal";
import { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Card } from "@/components/ui/card";
import {
    Users,
    Store,
    ShoppingBag,
    IndianRupee,
    TrendingUp,
    ArrowUpRight,
    Clock,
    CheckCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', revenue: 4000, orders: 24 },
    { name: 'Tue', revenue: 3000, orders: 18 },
    { name: 'Wed', revenue: 2000, orders: 12 },
    { name: 'Thu', revenue: 2780, orders: 30 },
    { name: 'Fri', revenue: 1890, orders: 20 },
    { name: 'Sat', revenue: 2390, orders: 28 },
    { name: 'Sun', revenue: 3490, orders: 35 },
];

export function AdminDashboard() {
    const { stats, pendingVendors } = useAdminStore();
    const navigate = useNavigate();
    const [showLiveFeed, setShowLiveFeed] = useState(false);
    const [showExport, setShowExport] = useState(false);

    const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
        <Card className="p-6 flex items-start justify-between hover:shadow-lg transition-all border-border/50">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>{trend}</span>
                    <span className="text-muted-foreground ml-1">{subtext}</span>
                </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
                <Icon className="w-5 h-5 text-primary" />
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AdminLiveFeedModal open={showLiveFeed} onOpenChange={setShowLiveFeed} />
            <AdminExportModal open={showExport} onOpenChange={setShowExport} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Real-time overview of your platform's performance.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowExport(true)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                        Export Report
                    </button>
                    <button onClick={() => setShowLiveFeed(true)} className="px-4 py-2 !bg-red-600 !text-white hover:!bg-red-700 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        View Live Feed
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    trend="+12.5%"
                    subtext="vs last month"
                    icon={IndianRupee}
                />
                <StatCard
                    title="Active Orders"
                    value={stats.activeOrders}
                    trend="+5.2%"
                    subtext="currently live"
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Total Vendors"
                    value={stats.totalVendors}
                    trend="+2"
                    subtext="new this week"
                    icon={Store}
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    trend="+18%"
                    subtext="growth rate"
                    icon={Users}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="col-span-2 p-6 border-border/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-lg">Revenue Overview</h3>
                            <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FBBC05" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FBBC05" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.2} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#FBBC05" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Pending Approvals / Activity */}
                <Card className="p-6 border-border/50 flex flex-col">
                    <h3 className="font-semibold text-lg mb-1">Pending Approvals</h3>
                    <p className="text-sm text-muted-foreground mb-6">Vendors waiting for verification</p>

                    <div className="flex-1 space-y-4">
                        {pendingVendors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <CheckCircle className="w-12 h-12 mb-3 text-green-500/50" />
                                <p>All caught up!</p>
                            </div>
                        ) : (
                            pendingVendors.map((vendor) => (
                                <div
                                    key={vendor.id}
                                    onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold">
                                            {vendor.businessName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{vendor.businessName}</p>
                                            <p className="text-xs text-muted-foreground">{vendor.type} • {vendor.location}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-background rounded-full transition-colors border border-transparent hover:border-border group-hover:bg-primary group-hover:text-black">
                                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-black" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <button onClick={() => navigate('/admin/vendors')} className="w-full py-3 mt-6 text-sm font-semibold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                        View All Requests
                    </button>
                </Card>
            </div>

            {/* Recent Orders Table Mockup */}
            <div className="grid grid-cols-1">
                <Card className="p-6 border-border/50">
                    <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="pb-3 text-sm font-medium text-muted-foreground pl-4">Booking ID</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Customer</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Vendor</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Amount</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Time</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[1, 2, 3].map((i) => (
                                    <tr
                                        key={i}
                                        onClick={() => navigate('/admin/bookings')}
                                        className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                                    >
                                        <td className="py-4 pl-4 font-medium">#ORD-2024-00{i}</td>
                                        <td className="py-4">Rahul Sharma</td>
                                        <td className="py-4">Glamour Studio</td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                                Confirmed
                                            </span>
                                        </td>
                                        <td className="py-4 font-medium">₹850.00</td>
                                        <td className="py-4 text-muted-foreground flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> 2 mins ago
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
