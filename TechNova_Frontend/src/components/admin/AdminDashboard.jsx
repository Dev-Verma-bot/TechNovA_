import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle2, TrendingUp, Search, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getAllApplicationsService, approveRejectService } from '../../services/Operations';

const data = [
  { name: 'Mon', apps: 400, approvals: 240 },
  { name: 'Tue', apps: 300, approvals: 139 },
  { name: 'Wed', apps: 550, approvals: 380 },
  { name: 'Thu', apps: 278, approvals: 190 },
  { name: 'Fri', apps: 189, approvals: 120 },
  { name: 'Sat', apps: 439, approvals: 280 },
  { name: 'Sun', apps: 349, approvals: 210 },
];

const StatCard = ({ title, value, change, icon: Icon, colorClass }) => (
   <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
   >
      <div className="flex items-center justify-between mb-4">
         <div className={`p-3 rounded-xl ${colorClass.bg} ${colorClass.text}`}>
            <Icon className="w-6 h-6" />
         </div>
         <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${change >= 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'} flex items-center gap-1`}>
            {change >= 0 ? '+' : ''}{change}%
            <TrendingUp className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
         </span>
      </div>
      <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</h3>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tighter tabular-nums">{value}</div>
   </motion.div>
);

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadApplications = async () => {
      try {
        const response = await getAllApplicationsService(token);
        setApplications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setApplications([]);
      }
    };

    loadApplications();
  }, []);

  const totalApplications = applications.length;
  const approvedCount = applications.filter((app) => app.status === "approved").length;
  const pendingCount = applications.filter((app) => app.status === "pending").length;
  const rejectedCount = applications.filter((app) => app.status === "rejected").length;

  const handleStatusUpdate = async (applicationId, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await approveRejectService(
        applicationId,
        { status },
        token
      );

      const updated = response?.data;
      if (!updated?._id) return;

      setApplications((prev) =>
        prev.map((item) =>
          item._id === updated._id
            ? { ...item, status: updated.status, predictedScore: updated.predictedScore ?? item.predictedScore }
            : item
        )
      );
    } catch (error) {
      // no-op for now
    }
  };

  const tableRows = useMemo(() => {
    return applications.slice(0, 10).map((app) => ({
      id: app._id,
      name: app.name || app.userId?.name || "Applicant",
      amount: `INR ${Number(app.amount || 0).toLocaleString("en-IN")}`,
      score: Number.isFinite(Number(app.predictedScore)) ? Number(app.predictedScore) : "--",
      status: app.status || "pending",
      time: app.createdAt ? new Date(app.createdAt).toLocaleString() : "-",
    }));
  }, [applications]);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
         <div />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            title="Total Applications" 
            value={totalApplications} 
            change={0} 
            icon={FileText} 
            colorClass={{ bg: 'bg-primary-50', text: 'text-primary-600' }} 
         />
         <StatCard 
            title="Auto-Approved" 
            value={approvedCount} 
            change={0} 
            icon={CheckCircle2} 
            colorClass={{ bg: 'bg-success/10', text: 'text-success' }} 
         />
         <StatCard 
            title="Manual Review Queue" 
            value={pendingCount} 
            change={0} 
            icon={Users} 
            colorClass={{ bg: 'bg-warning/10', text: 'text-warning' }} 
         />
         <StatCard 
            title="Rejected" 
            value={rejectedCount} 
            change={0} 
            icon={ShieldAlert} 
            colorClass={{ bg: 'bg-danger/10', text: 'text-danger' }} 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900">Application Volume vs Approvals</h3>
               <select className="text-sm border-0 bg-slate-50 text-slate-700 rounded-lg py-2 pl-4 pr-10 focus:ring-0 font-medium">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
               </select>
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600, fontSize: '14px' }}
                     />
                     <Area type="monotone" dataKey="apps" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                     <Area type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApprovals)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Alert Panel */}
         <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-warning" />
               System Alerts
            </h3>
            <div className="flex-1 space-y-4">
               {[
                  { title: 'Demographic Bias Detected', desc: 'Slight approval rate variance detected in younger applicants (18-24). Fairness engine adjusting weights.', urgency: 'high' },
                  { title: 'High Volume Source', desc: 'Unexpected 40% surge in applications originating from California.', urgency: 'medium' },
                  { title: 'Model Drift Warning', desc: 'Income inference accuracy drift detected in regional segment B.', urgency: 'medium' },
               ].map((alert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-4 items-start group hover:bg-slate-100 transition-colors cursor-pointer">
                     <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${alert.urgency === 'high' ? 'bg-danger animate-pulse' : 'bg-warning'}`}></span>
                     <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{alert.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{alert.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
         <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
            <div className="relative max-w-xs w-full">
               <input type="text" placeholder="Search ID or Name" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                     <th className="p-4 pl-6 font-medium">App ID</th>
                     <th className="p-4 font-medium">Applicant</th>
                     <th className="p-4 font-medium">Amount</th>
                     <th className="p-4 font-medium">Risk Score</th>
                     <th className="p-4 font-medium">Status</th>
                     <th className="p-4 font-medium">Time</th>
                     <th className="p-4 pr-6">Action</th>
                  </tr>
               </thead>
               <tbody className="text-sm font-medium text-slate-900">
                  {tableRows.map((app, idx) => (
                     <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 pl-6 font-mono text-slate-500 text-xs">{app.id}</td>
                        <td className="p-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                              {app.name.substring(0,2)}
                           </div>
                           {app.name}
                        </td>
                        <td className="p-4 text-slate-600">{app.amount}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded-md text-xs font-bold ${typeof app.score === 'number' ? (app.score >= 700 ? 'bg-success/10 text-success' : app.score >= 600 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger') : 'bg-slate-100 text-slate-500'}`}>
                               {app.score}
                           </span>
                        </td>
                        <td className="p-4 uppercase text-xs tracking-wider">
                           {app.status === 'approved' && <span className="text-success font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success block"></span>Approved</span>}
                           {app.status === 'rejected' && <span className="text-danger font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-danger block"></span>Rejected</span>}
                           {app.status === 'pending' && <span className="text-warning font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warning block"></span>Pending</span>}
                        </td>
                        <td className="p-4 text-slate-400 text-xs whitespace-nowrap">{app.time}</td>
                        <td className="p-4 pr-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button
                                 onClick={() => handleStatusUpdate(app.id, "approved")}
                                 className="px-3 py-1.5 rounded-md text-xs font-bold bg-success/10 text-success border border-success/20 hover:bg-success/20"
                              >
                                 Accept
                              </button>
                              <button
                                 onClick={() => handleStatusUpdate(app.id, "rejected")}
                                 className="px-3 py-1.5 rounded-md text-xs font-bold bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20"
                              >
                                 Decline
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
