import React, { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Search, Filter, ChevronDown, ChevronUp, Inbox, Send, FileText, Trash2, Star, Clock, Users, Target, CheckCircle, XCircle, FileDown, Briefcase, User, Building, Phone, Mail, MessageSquare, Bell, Settings, LogOut, ChevronLeft, ChevronRight, MoreVertical, Paperclip, Smile, PhoneCall, PhoneOff, Bot, PlusCircle, LayoutDashboard, BarChart2 } from 'lucide-react';

// --- MOCK DATA ---
const USERS: {[key: string]: {name: string, role: string}} = {
  'USR-1025': { name: 'Anjali M.', role: 'Resolution Expert' },
  'USR-1026': { name: 'Rohan S.', role: 'Resolution Expert' },
  'USR-1027': { name: 'Priya K.', role: 'Team Lead' },
  'USR-1028': { name: 'Sandeep G.', role: 'Resolution Expert' },
  'USR-1029': { name: 'Kavita N.', role: 'Resolution Expert' },
  'USR-1030': { name: 'Amit Desai', role: 'Resolution Expert' },
  'USR-1031': { name: 'Sunita Rao', role: 'Resolution Expert' },
  'USR-1032': { name: 'Rajesh Kumar', role: 'Team Lead' },
  'SYS-001': { name: 'System', role: 'System' },
};

const CUSTOMERS: {[key: string]: any} = {
  'CUST-5543': { name: 'John Doe', email: 'john.doe@example.com', phone: '+919876543210' },
  'CUST-5544': { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+919876543211' },
  'CUST-5545': { name: 'Michael Brown', email: 'michael.b@example.com', phone: '+919876543212' },
  'CUST-5546': { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+919876543213' },
  'CUST-5547': { name: 'Diya Patel', email: 'diya.patel@example.com', phone: '+919876543214' },
  'CUST-5548': { name: 'Vivaan Singh', email: 'vivaan.singh@example.com', phone: '+919876543215' },
};

const PARTNERS: {[key: string]: any} = {
    'PRT-007': { name: 'Future Generali', code: 'FG007', rmName: 'Vikram Singh', rmEmail: 'vikram.s@futuregenerali.com'},
    'PRT-008': { name: 'HDFC Ergo', code: 'HD008', rmName: 'Sunita Sharma', rmEmail: 'sunita.s@hdfcergo.com'},
};

const POLICIES: {[key: string]: any} = {
    'POL-9876': { number: 'FG-V-12345678', type: 'Car Insurance', premium: 15000, issueDate: '2025-06-15', vehicle: 'Maruti Swift - DL10AB1234' },
    'POL-9877': { number: 'HD-H-87654321', type: 'Health Insurance', premium: 25000, issueDate: '2025-07-20', vehicle: null },
};

const CATEGORIES: {[key: string]: { name: string; subCategories: { [key: string]: string; }; }} = {
  'CAT-01': { name: 'Policy', subCategories: { 'SUB-01': 'Document Request', 'SUB-02': 'Correction Request', 'SUB-09': 'Endorsement Request', 'SUB-10': 'Renewal Query' } },
  'CAT-02': { name: 'Claims', subCategories: { 'SUB-03': 'Status Query', 'SUB-04': 'Intimation Assistance', 'SUB-11': 'Document Submission', 'SUB-12': 'Settlement Discrepancy' } },
  'CAT-03': { name: 'Payout', subCategories: { 'SUB-05': 'Discrepancy Report', 'SUB-06': 'Delay Inquiry', 'SUB-13': 'Bank Details Update' } },
  'CAT-04': { name: 'General', subCategories: { 'SUB-07': 'Feedback', 'SUB-08': 'Grievance', 'SUB-14': 'Website Issue' } },
};

const generateTickets = () => {
    // ... (keeping generateTickets logic as it is extensive but self-contained)
    const initialTickets = [
      { ticket_id: 'TKT-001', subject: 'Policy document not received', priority: 'High', status: 'Work In Progress', category_id: 'CAT-01', sub_category_id: 'SUB-01', owner_user_id: 'USR-1025', customer_id: 'CUST-5543', policy_id: 'POL-9876', partner_id: 'PRT-007', created_at: '2025-08-08T10:00:00Z', updated_at: '2025-08-11T09:30:12Z', sla_due_date: '2025-08-12T18:00:00Z', sla_status: 'On Track' },
      { ticket_id: 'TKT-002', subject: 'Question about my health plan claim', priority: 'Medium', status: 'Awaiting Validation', category_id: 'CAT-02', sub_category_id: 'SUB-03', owner_user_id: 'USR-1026', customer_id: 'CUST-5544', policy_id: 'POL-9877', partner_id: 'PRT-008', created_at: '2025-08-10T11:00:00Z', updated_at: '2025-08-10T11:00:00Z', sla_due_date: '2025-08-13T18:00:00Z', sla_status: 'On Track' },
      { ticket_id: 'TKT-003', subject: 'Incorrect name on policy', priority: 'High', status: 'New', category_id: 'CAT-01', sub_category_id: 'SUB-02', owner_user_id: null, customer_id: 'CUST-5543', policy_id: 'POL-9876', partner_id: 'PRT-007', created_at: '2025-08-11T09:00:00Z', updated_at: '2025-08-11T09:00:00Z', sla_due_date: '2025-08-13T18:00:00Z', sla_status: 'On Track' },
      { ticket_id: 'TKT-004', subject: 'Payout amount seems wrong', priority: 'High', status: 'Work In Progress', category_id: 'CAT-03', sub_category_id: 'SUB-05', owner_user_id: 'USR-1025', customer_id: 'CUST-5544', policy_id: 'POL-9877', partner_id: 'PRT-008', created_at: '2025-08-07T14:00:00Z', updated_at: '2025-08-10T15:00:00Z', sla_due_date: '2025-08-11T18:00:00Z', sla_status: 'SLA At Risk' },
      { ticket_id: 'TKT-005', subject: 'Urgent: Claim status needed', priority: 'High', status: 'Out of TAT', category_id: 'CAT-02', sub_category_id: 'SUB-03', owner_user_id: 'USR-1026', customer_id: 'CUST-5543', policy_id: 'POL-9876', partner_id: 'PRT-007', created_at: '2025-08-05T12:00:00Z', updated_at: '2025-08-10T18:30:00Z', sla_due_date: '2025-08-08T18:00:00Z', sla_status: 'Breached' },
      { ticket_id: 'TKT-006', subject: 'How to file a new claim?', priority: 'Low', status: 'Resolved - SR Validation Pending', category_id: 'CAT-02', sub_category_id: 'SUB-04', owner_user_id: 'USR-1025', customer_id: 'CUST-5544', policy_id: 'POL-9877', partner_id: 'PRT-008', created_at: '2025-08-09T16:00:00Z', updated_at: '2025-08-10T10:00:00Z', sla_due_date: '2025-08-14T18:00:00Z', sla_status: 'On Track' },
      { ticket_id: 'TKT-007', subject: 'Follow up on policy docs', priority: 'Medium', status: 'Closed', category_id: 'CAT-01', sub_category_id: 'SUB-01', owner_user_id: 'USR-1026', customer_id: 'CUST-5543', policy_id: 'POL-9876', partner_id: 'PRT-007', created_at: '2025-08-01T10:00:00Z', updated_at: '2025-08-03T12:00:00Z', sla_due_date: '2025-08-04T18:00:00Z', sla_status: 'On Track' },
    ];
    return initialTickets;
};
let TICKETS = generateTickets();

let ACTIVITY_HISTORY: {[key: string]: any[]} = {
  'TKT-001': [
    { activity_id: 'ACT-9901', ticket_id: 'TKT-001', user_id: 'SYS-001', activity_type: 'StatusChange', channel: 'System', content: "Ticket Created. Priority set to 'High'.", timestamp: '2025-08-08T10:00:00Z', visibility: 'Internal' },
    { activity_id: 'ACT-9902', ticket_id: 'TKT-001', user_id: 'USR-1025', activity_type: 'Note', channel: 'UI', content: "Customer called, very anxious about the documents. Promised to expedite.", timestamp: '2025-08-08T11:30:00Z', visibility: 'Internal' },
  ],
};

const EMAILS = [
    { id: 1, from: 'john.doe@example.com', name: 'John Doe', subject: 'Re: Your Policy Documents', body: 'Hi, any update on my policy documents? It has been a while. Thanks, John', read: false, linkedTicketId: 'TKT-001', time: '2025-08-11T11:00:00Z', sentiment: 'neutral' },
    { id: 2, from: 'angry.customer@example.com', name: 'Angry Customer', subject: 'THIS IS UNACCEPTABLE!!', body: 'I have been waiting for weeks and your service is terrible! I want to talk to a manager NOW!', read: false, linkedTicketId: null, time: '2025-08-11T10:30:00Z', sentiment: 'negative' },
];

const AppContext = createContext<any>(null);

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};
const getStatusColor = (status: string) => {
  const colors: {[key: string]: string} = { 'New': 'bg-blue-100 text-blue-800', 'Awaiting Validation': 'bg-yellow-100 text-yellow-800', 'Work In Progress': 'bg-indigo-100 text-indigo-800', 'Out of TAT': 'bg-red-100 text-red-800', 'Resolved - SR Validation Pending': 'bg-purple-100 text-purple-800', 'Closed': 'bg-green-100 text-green-800', 'SLA At Risk': 'bg-orange-100 text-orange-800', };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
const getPriorityColor = (priority: string) => { return priority === 'High' ? 'text-red-500' : priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'; };

const KpiCard = ({ title, value, icon, color }: {title: string, value: string | number, icon: React.ReactNode, color: string}) => ( <div className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between"> <div> <p className="text-sm text-gray-500">{title}</p> <p className="text-2xl font-bold text-gray-800">{value}</p> </div> <div className={`p-2 rounded-full ${color}`}> {icon} </div> </div> );
const TicketListItem = ({ ticket, onTicketClick }: {ticket: any, onTicketClick: (ticket: any) => void}) => ( <div onClick={() => onTicketClick(ticket)} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer border border-gray-200 transition-shadow duration-200"> <div className="flex justify-between items-start"> <div> <p className="font-semibold text-gray-800">{ticket.subject}</p> <p className="text-sm text-gray-500">{`#${ticket.ticket_id} • Created: ${formatDate(ticket.created_at)} • Customer: ${CUSTOMERS[ticket.customer_id]?.name || 'N/A'}`}</p> </div> <div className="flex items-center space-x-2"> <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}> {ticket.status} </span> <MoreVertical size={20} className="text-gray-400" /> </div> </div> <div className="mt-4 flex justify-between items-center text-sm"> <div className="flex items-center space-x-2"> <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`}></div> <span className="text-gray-600">{ticket.priority} Priority</span> <span className="text-gray-400">•</span> <span className="text-gray-600">Owner: {USERS[ticket.owner_user_id]?.name || 'Unassigned'}</span> </div> <div className="flex items-center space-x-2"> <Clock size={14} className="text-gray-500" /> <span className="text-gray-600">SLA Due: {formatDate(ticket.sla_due_date)}</span> </div> </div> </div> );
const Pagination = ({ currentPage, totalPages, onPageChange }: {currentPage: number, totalPages: number, onPageChange: (page: number) => void}) => ( <div className="flex justify-center items-center space-x-2 mt-6"> <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> <ChevronLeft size={20} /> </button> {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => ( <button key={page} onClick={() => onPageChange(page)} className={`px-4 py-2 rounded-md text-sm ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}> {page} </button> ))} <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> <ChevronRight size={20} /> </button> </div> );
const DashboardView = () => {
  const { onTicketClick } = useContext(AppContext);
  const [activeBucket, setActiveBucket] = useState('New');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const ticketBuckets = useMemo(() => ({ 'New': TICKETS.filter(t => t.status === 'New'), 'SLA At Risk (Predicted)': TICKETS.filter(t => t.sla_status === 'SLA At Risk'), 'Awaiting Validation': TICKETS.filter(t => t.status === 'Awaiting Validation' || t.status === 'Resolved - SR Validation Pending'), 'Work In Progress': TICKETS.filter(t => t.status === 'Work In Progress'), 'Out of TAT': TICKETS.filter(t => t.status === 'Out of TAT'), 'Closed': TICKETS.filter(t => t.status === 'Closed'), }), [TICKETS]);
  const filteredTickets = useMemo(() => {
    let tickets = ticketBuckets[activeBucket as keyof typeof ticketBuckets] || [];
    if (searchTerm) { tickets = tickets.filter(t => t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || (CUSTOMERS[t.customer_id]?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ); }
    if (filters.category) { tickets = tickets.filter(t => t.category_id === filters.category); }
    if (filters.subCategory) { tickets = tickets.filter(t => t.sub_category_id === filters.subCategory); }
    if (filters.owner) { tickets = tickets.filter(t => t.owner_user_id === filters.owner); }
    return tickets;
  }, [activeBucket, searchTerm, filters, ticketBuckets]);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage);
  const handleApplyFilters = (newFilters: any) => { setFilters(newFilters); setFilterModalOpen(false); };
  const removeFilter = (key: string) => { const newFilters = {...filters}; delete newFilters[key as keyof typeof newFilters]; setFilters(newFilters); }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800">Resolution Desk</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <KpiCard title="Average Resolution TAT" value="2d 8h" icon={<Clock size={24} className="text-blue-500"/>} color="bg-blue-100" />
        <KpiCard title="Total Unread Emails" value={EMAILS.filter(e => !e.read).length} icon={<Mail size={24} className="text-green-500"/>} color="bg-green-100" />
        <KpiCard title="Awaiting Customer Reply" value="3" icon={<Users size={24} className="text-yellow-500"/>} color="bg-yellow-100" />
      </div>
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {Object.entries(ticketBuckets).map(([name, tickets]) => (
              <button key={name} onClick={() => { setActiveBucket(name); setCurrentPage(1); }} className={`${ activeBucket === name ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`} > {name} <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${activeBucket === name ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900'}`}> {tickets.length} </span> </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <div className="flex-grow relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Search by Ticket ID, Subject, or Customer Name..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => setFilterModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"> <Filter size={20} className="text-gray-500"/> <span>Filter</span> </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && <span className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">{`Category: ${CATEGORIES[filters.category]?.name}`} <XCircle size={14} className="ml-2 cursor-pointer" onClick={() => removeFilter('category')}/></span>}
          {filters.subCategory && <span className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">{`Sub-Category: ${CATEGORIES[filters.category]?.subCategories[filters.subCategory]}`} <XCircle size={14} className="ml-2 cursor-pointer" onClick={() => removeFilter('subCategory')}/></span>}
          {filters.owner && <span className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">{`Owner: ${USERS[filters.owner]?.name}`} <XCircle size={14} className="ml-2 cursor-pointer" onClick={() => removeFilter('owner')}/></span>}
      </div>
      <div className="mt-4 space-y-4">
        {paginatedTickets.length > 0 ? ( paginatedTickets.map(ticket => <TicketListItem key={ticket.ticket_id} ticket={ticket} onTicketClick={onTicketClick} />) ) : ( <div className="text-center py-12 bg-white rounded-lg shadow-sm"> <p className="text-gray-500">No tickets found in this view.</p> </div> )}
      </div>
      {paginatedTickets.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      {isFilterModalOpen && <FilterModal onApply={handleApplyFilters} onClose={() => setFilterModalOpen(false)} currentFilters={filters} />}
    </div>
  );
};
const FilterModal = ({ onApply, onClose, currentFilters }: { onApply: (filters: any) => void, onClose: () => void, currentFilters: any }) => {
    const [category, setCategory] = useState(currentFilters.category || '');
    const [subCategory, setSubCategory] = useState(currentFilters.subCategory || '');
    const [owner, setOwner] = useState(currentFilters.owner || '');
    const handleApply = () => { onApply({ category, subCategory, owner }); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center"> <h2 className="text-lg font-semibold">Filters</h2> <button onClick={onClose}><XCircle size={24} className="text-gray-500" /></button> </div>
                <div className="mt-4 space-y-4">
                    <div> <label className="block text-sm font-medium text-gray-700">Category</label> <select value={category} onChange={e => {setCategory(e.target.value); setSubCategory('')}} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"> <option value="">All Categories</option> {Object.entries(CATEGORIES).map(([id, cat]) => <option key={id} value={id}>{cat.name}</option>)} </select> </div>
                    {category && ( <div> <label className="block text-sm font-medium text-gray-700">Sub-Category</label> <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"> <option value="">All Sub-Categories</option> {Object.entries(CATEGORIES[category].subCategories).map(([id, name]) => <option key={id} value={id}>{name}</option>)} </select> </div> )}
                    <div> <label className="block text-sm font-medium text-gray-700">Owner</label> <select value={owner} onChange={e => setOwner(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"> <option value="">All Owners</option> {Object.entries(USERS).map(([id, user]) => user.role !== 'System' && <option key={id} value={id}>{user.name}</option>)} </select> </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3"> <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button> <button onClick={handleApply} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Apply Filters</button> </div>
            </div>
        </div>
    );
};
const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => ( <div className="bg-white p-4 rounded-lg border border-gray-200"> <h3 className="font-semibold text-gray-800 mb-3">{title}</h3> <div className="space-y-2"> {children} </div> </div> );
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => ( <div className="flex justify-between items-start text-sm"> <p className="text-gray-500 flex-shrink-0 mr-2">{label}</p> <p className="font-medium text-gray-800 text-right break-all">{value}</p> </div> );
const TicketDetailModal = ({ ticket, onClose }: {ticket: any, onClose: () => void}) => {
    const { navigate, forceUpdate } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Note');
    const [history, setHistory] = useState(ACTIVITY_HISTORY[ticket.ticket_id] || []);
    const [note, setNote] = useState('');
    const [email, setEmail] = useState({ to: CUSTOMERS[ticket.customer_id]?.email || '', subject: `Re: ${ticket.subject}`, body: '' });
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [callLog, setCallLog] = useState({ outcome: 'Connected', notes: '' });
    const [isCallActive, setIsCallActive] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef<any>(null);

    useEffect(() => { if (isCallActive) { timerRef.current = setInterval(() => { setCallDuration(prev => prev + 1); }, 1000); } else { clearInterval(timerRef.current); } return () => clearInterval(timerRef.current); }, [isCallActive]);
    
    const formatDuration = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}m ${s}s`; };
    const handleAddActivity = (item: any) => { const newHistory = [item, ...history]; setHistory(newHistory); ACTIVITY_HISTORY[ticket.ticket_id] = newHistory; forceUpdate(); };
    const handleSubmit = () => {
        const newActivity = { activity_id: `ACT-${Date.now()}`, ticket_id: ticket.ticket_id, user_id: 'USR-1025', timestamp: new Date().toISOString(), visibility: 'Internal', };
        switch(activeTab) {
            case 'Note': if (!note) return; handleAddActivity({ ...newActivity, activity_type: 'Note', channel: 'UI', content: note }); setNote(''); break;
            case 'Email': if (!email.body) return; handleAddActivity({ ...newActivity, activity_type: 'Email', channel: 'Email', content: `Sent email to ${email.to} with subject "${email.subject}". Body: ${email.body}` }); setEmail(prev => ({ ...prev, body: '' })); break;
            case 'WhatsApp': if (!whatsappMessage) return; handleAddActivity({ ...newActivity, activity_type: 'WhatsApp', channel: 'WhatsApp', content: `Sent message: '${whatsappMessage}'` }); setWhatsappMessage(''); break;
            case 'Log Call': setIsCallActive(false); const durationStr = formatDuration(callDuration); handleAddActivity({ ...newActivity, activity_type: 'Call', channel: 'Call', content: `Logged call. Outcome: ${callLog.outcome}. Duration: ${durationStr}. Notes: ${callLog.notes}` }); setCallLog({ outcome: 'Connected', notes: '' }); setCallDuration(0); break;
            default: break;
        }
    };
    const customer = CUSTOMERS[ticket.customer_id];
    const policy = POLICIES[ticket.policy_id];
    const partner = PARTNERS[ticket.partner_id];
    const handleViewPartner360 = () => { onClose(); navigate('360° Search', { prefill: { partnerCode: partner.code } }); };
    const getActionButtons = () => { switch (ticket.status) { case 'Awaiting Validation': return <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Validate & Proceed</button>; case 'Resolved - SR Validation Pending': return <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Validate & Close Ticket</button>; default: return null; } };
    const communicationTabs = [ { name: 'Note', icon: <MessageSquare size={16} /> }, { name: 'Email', icon: <Mail size={16} /> }, { name: 'WhatsApp', icon: <Bot size={16} /> }, { name: 'Log Call', icon: <Phone size={16} /> }, ];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b bg-white rounded-t-xl flex justify-between items-center"> <div> <h2 className="text-xl font-bold text-gray-900">{ticket.subject}</h2> <p className="text-sm text-gray-500">Ticket ID: {ticket.ticket_id}</p> </div> <button onClick={onClose}><XCircle size={28} className="text-gray-400 hover:text-gray-600" /></button> </div>
                <div className="flex-grow flex overflow-hidden">
                    <div className="w-1/3 bg-white p-4 overflow-y-auto border-r space-y-4">
                        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg"> <h4 className="font-semibold text-indigo-800">Next Best Action</h4> <p className="text-sm text-indigo-700 mt-1">Request updated document from Partner RM: {partner.rmName}.</p> </div>
                        {/* Fix: Wrap multiple children of InfoCard in a fragment */}
                        <InfoCard title="Ticket Details"><>
                          <InfoRow label="Status" value={<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>} />
                          <InfoRow label="Priority" value={ticket.priority} />
                          <InfoRow label="Category" value={CATEGORIES[ticket.category_id]?.name} />
                          <InfoRow label="Owner" value={USERS[ticket.owner_user_id]?.name || 'Unassigned'} />
                        </></InfoCard>
                        {/* Fix: Wrap multiple children of InfoCard in a fragment */}
                        <InfoCard title="Customer & Policy"><>
                          <InfoRow label="Customer" value={customer?.name} />
                          <InfoRow label="Email" value={customer?.email} />
                          <InfoRow label="Phone" value={customer?.phone} />
                          <InfoRow label="Policy #" value={policy?.number} />
                          <InfoRow label="Vehicle" value={policy?.vehicle || 'N/A'} />
                          <button className="mt-2 w-full text-sm flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg"> <FileDown size={16} /> <span>Download Policy Soft Copy</span> </button>
                        </></InfoCard>
                        {/* Fix: Wrap multiple children of InfoCard in a fragment */}
                        <InfoCard title="Partner & RM Details"><>
                          <InfoRow label="Partner" value={partner?.name} />
                          <InfoRow label="Partner RM" value={partner?.rmName} />
                          <InfoRow label="RM Email" value={partner?.rmEmail} />
                          <button onClick={handleViewPartner360} className="mt-2 w-full text-sm flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg"> <Briefcase size={16} /> <span>View Partner 360°</span> </button>
                        </></InfoCard>
                        <div className="pt-4"> {getActionButtons()} </div>
                    </div>
                    <div className="w-2/3 flex flex-col bg-gray-50 p-4">
                        <div className="flex-shrink-0">
                            <div className="flex border-b"> {communicationTabs.map(tab => ( <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === tab.name ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}> {tab.icon}<span>{tab.name}</span> </button> ))} </div>
                            <div className="p-4 bg-white rounded-b-lg shadow-sm">
                                {activeTab === 'Note' && <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 border rounded-md" rows={4} placeholder="Add an internal note..."></textarea>}
                                {activeTab === 'Email' && <div className="space-y-2"> <input type="text" value={email.to} onChange={e => setEmail({...email, to: e.target.value})} className="w-full p-2 border rounded-md bg-gray-100" placeholder="To" /> <input type="text" value={email.subject} onChange={e => setEmail({...email, subject: e.target.value})} className="w-full p-2 border rounded-md" placeholder="Subject" /> <textarea value={email.body} onChange={e => setEmail({...email, body: e.target.value})} className="w-full p-2 border rounded-md" rows={4} placeholder="Compose your email..."></textarea> </div>}
                                {activeTab === 'WhatsApp' && <textarea value={whatsappMessage} onChange={e => setWhatsappMessage(e.target.value)} className="w-full p-2 border rounded-md" rows={4} placeholder="Type your WhatsApp message..."></textarea>}
                                {activeTab === 'Log Call' && <div className="space-y-3"> {!isCallActive ? ( <button onClick={() => setIsCallActive(true)} className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"> <PhoneCall size={18} /><span>Start Call</span> </button> ) : ( <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg"> <span className="font-mono text-red-700 font-semibold animate-pulse">On Call: {formatDuration(callDuration)}</span> <button onClick={() => setIsCallActive(false)} className="flex items-center justify-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"> <PhoneOff size={16} /><span>End Call</span> </button> </div> )} <select value={callLog.outcome} onChange={e => setCallLog({...callLog, outcome: e.target.value})} className="w-full p-2 border rounded-md"> <option>Connected</option><option>No Answer</option><option>Left Voicemail</option><option>Busy</option> </select> <textarea value={callLog.notes} onChange={e => setCallLog({...callLog, notes: e.target.value})} className="w-full p-2 border rounded-md" rows={3} placeholder="Add call notes..."></textarea> </div>}
                                <div className="mt-2 flex justify-between items-center"> <div> {activeTab === 'Email' && <button className="p-2 text-gray-500 hover:text-gray-700"><Paperclip size={18}/></button>} </div> <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"> {activeTab === 'Log Call' ? 'Log Call' : `Send ${activeTab}`} </button> </div>
                            </div>
                        </div>
                        <div className="mt-4 flex-grow overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Activity History</h3>
                            <div className="space-y-4 pr-2">
                                {history.map(item => ( <div key={item.activity_id} className="flex space-x-3"> <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"> {item.channel === 'Email' ? <Mail size={16} className="text-gray-600"/> : item.channel === 'WhatsApp' ? <Bot size={16} className="text-gray-600"/> : item.channel === 'Call' ? <Phone size={16} className="text-gray-600"/> : <User size={16} className="text-gray-600"/>} </div> <div> <p className="text-sm"> <span className="font-semibold">{USERS[item.user_id]?.name || 'Unknown'}</span> {item.content} </p> <p className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)} via {item.channel}</p> </div> </div> ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const AnalyticsView = () => {
    const ticketsByStatus = Object.entries( TICKETS.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {} as any) ).map(([name, value]) => ({ name, value }));
    const ticketsByCategory = Object.entries( TICKETS.reduce((acc, t) => { const catName = CATEGORIES[t.category_id]?.name || 'Unknown'; acc[catName] = (acc[catName] || 0) + 1; return acc; }, {} as any) ).map(([name, value]) => ({ name, value }));
    const dailyTicketVolume = [ { name: 'Aug 5', volume: 5 }, { name: 'Aug 6', volume: 8 }, { name: 'Aug 7', volume: 6 }, { name: 'Aug 8', volume: 10 }, { name: 'Aug 9', volume: 7 }, { name: 'Aug 10', volume: 12 }, { name: 'Aug 11', volume: 9 }, ];
    const categoryAvgTAT = [ { name: 'Policy', tat: 2.5 }, { name: 'Claims', tat: 4.1 }, { name: 'Payout', tat: 3.2 }, ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <KpiCard title="Avg. Resolution TAT" value="2d 8h" icon={<Clock size={24} className="text-blue-500"/>} color="bg-blue-100" />
                <KpiCard title="TAT Breached Cases" value="8" icon={<XCircle size={24} className="text-red-500"/>} color="bg-red-100" />
                <KpiCard title="First Contact Resolution" value="72%" icon={<Target size={24} className="text-green-500"/>} color="bg-green-100" />
                <KpiCard title="Total Closed Tickets" value="152" icon={<CheckCircle size={24} className="text-purple-500"/>} color="bg-purple-100" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm"> <h3 className="font-semibold text-gray-700">Tickets by Status</h3> <ResponsiveContainer width="100%" height={300}> <PieChart> <Pie data={ticketsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label> {ticketsByStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)} </Pie> <Tooltip /> <Legend /> </PieChart> </ResponsiveContainer> </div>
                <div className="bg-white p-4 rounded-lg shadow-sm"> <h3 className="font-semibold text-gray-700">Tickets by Category</h3> <ResponsiveContainer width="100%" height={300}> <BarChart data={ticketsByCategory} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" /> <YAxis /> <Tooltip /> <Bar dataKey="value" fill="#82ca9d" /> </BarChart> </ResponsiveContainer> </div>
                <div className="bg-white p-4 rounded-lg shadow-sm"> <h3 className="font-semibold text-gray-700">Category-wise Avg. TAT (Days)</h3> <ResponsiveContainer width="100%" height={300}> <BarChart data={categoryAvgTAT} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" /> <YAxis /> <Tooltip /> <Bar dataKey="tat" fill="#8884d8" /> </BarChart> </ResponsiveContainer> </div>
                <div className="bg-white p-4 rounded-lg shadow-sm"> <h3 className="font-semibold text-gray-700">Daily Ticket Volume (Last 7 Days)</h3> <ResponsiveContainer width="100%" height={300}> <LineChart data={dailyTicketVolume} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" /> <YAxis /> <Tooltip /> <Line type="monotone" dataKey="volume" stroke="#ff7300" strokeWidth={2} /> </LineChart> </ResponsiveContainer> </div>
            </div>
        </div>
    );
};
const EmailView = () => {
    const [selectedEmail, setSelectedEmail] = useState(EMAILS[0]);
    const SentimentIcon = ({ sentiment }: {sentiment: string}) => { if (sentiment === 'positive') return <Smile size={16} className="text-green-500" />; if (sentiment === 'negative') return <Smile size={16} className="text-red-500" />; return null; };
    return (
        <div className="flex h-full bg-white">
            <div className="w-64 border-r p-4 flex-shrink-0"> <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mb-6">Compose</button> <ul> <li className="flex justify-between items-center p-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold"> <div className="flex items-center space-x-3"><Inbox size={20} /><span>Inbox</span></div> <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">{EMAILS.filter(e => !e.read).length}</span> </li> <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"><Star size={20} /><span>Starred</span></li> <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"><Send size={20} /><span>Sent</span></li> <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"><FileText size={20} /><span>Drafts</span></li> <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"><Trash2 size={20} /><span>Trash</span></li> </ul> </div>
            <div className="w-96 border-r overflow-y-auto flex-shrink-0"> {EMAILS.map(email => ( <div key={email.id} onClick={() => setSelectedEmail(email)} className={`p-4 border-b cursor-pointer ${selectedEmail.id === email.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}> <div className="flex justify-between"> <p className={`font-semibold ${!email.read ? 'text-gray-900' : 'text-gray-600'}`}>{email.name}</p> <p className="text-xs text-gray-500">{formatTimeAgo(email.time)}</p> </div> <p className={`text-sm truncate ${!email.read ? 'text-gray-800' : 'text-gray-500'}`}>{email.subject}</p> <div className="flex items-center justify-between mt-2"> {email.linkedTicketId ? ( <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{email.linkedTicketId}</span> ) : ( <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Unlinked</span> )} <SentimentIcon sentiment={email.sentiment} /> </div> </div> ))} </div>
            <div className="flex-grow p-6 overflow-y-auto"> {selectedEmail && ( <> <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2> <div className="flex items-center space-x-4 mt-4"> <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">{selectedEmail.name.charAt(0)}</div> <div> <p className="font-semibold">{selectedEmail.name}</p> <p className="text-sm text-gray-500">From: {selectedEmail.from}</p> </div> </div> <div className="mt-6 border-t pt-6 text-gray-700 leading-relaxed"> {selectedEmail.body} </div> {!selectedEmail.linkedTicketId && ( <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between"> <p className="text-yellow-800">This email is not linked to a ticket.</p> <div className="space-x-2"> <button className="px-3 py-1 border border-gray-400 rounded-md text-sm">Link to Ticket</button> <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Create New Ticket</button> </div> </div> )} </> )} </div>
        </div>
    );
};
const SearchView = ({ prefill }: {prefill?: any}) => {
    const [openSection, setOpenSection] = useState(prefill ? 'partner' : 'customer');
    const [searchParams, setSearchParams] = useState({ ticketCreationDate: '', partnerCode: prefill?.partnerCode || '', customerPhone: '', policyNumber: '', registrationNumber: '', });
    const [searchResults, setSearchResults] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setSearchParams(prev => ({ ...prev, [name]: value })); };
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        setSearchResults(null);
        setTimeout(() => {
            let filteredTickets = [...TICKETS];
            if (searchParams.partnerCode) { filteredTickets = filteredTickets.filter(t => PARTNERS[t.partner_id]?.code.toLowerCase().includes(searchParams.partnerCode.toLowerCase())); }
            if (searchParams.customerPhone) { filteredTickets = filteredTickets.filter(t => CUSTOMERS[t.customer_id]?.phone.includes(searchParams.customerPhone)); }
            if (searchParams.policyNumber) { filteredTickets = filteredTickets.filter(t => POLICIES[t.policy_id]?.number.toLowerCase().includes(searchParams.policyNumber.toLowerCase())); }
            if (searchParams.registrationNumber) { filteredTickets = filteredTickets.filter(t => POLICIES[t.policy_id]?.vehicle?.toLowerCase().includes(searchParams.registrationNumber.toLowerCase())); }
            if (searchParams.ticketCreationDate) { filteredTickets = filteredTickets.filter(t => t.created_at.startsWith(searchParams.ticketCreationDate)); }
            const policyIds = [...new Set(filteredTickets.map(t => t.policy_id))];
            const policyResults = policyIds.map(id => ({ ...POLICIES[id], id }));
            const customerIds = [...new Set(filteredTickets.map(t => t.customer_id))];
            const customerResults = customerIds.map(id => ({ ...CUSTOMERS[id], id }));
            setSearchResults({ tickets: filteredTickets, policies: policyResults, customers: customerResults, });
            setIsSearching(false);
        }, 1000);
    };
    
    useEffect(() => { if (prefill?.partnerCode) { handleSearch(); } }, [prefill]);
    const AccordionSection = ({ title, id, children }: {title: string, id: string, children: React.ReactNode}) => ( <div className="border rounded-lg overflow-hidden"> <button type="button" onClick={() => setOpenSection(openSection === id ? null : id)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"> <h3 className="font-semibold text-gray-700">{title}</h3> {openSection === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />} </button> {openSection === id && <div className="p-4 bg-white">{children}</div>} </div> );
    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-2xl font-bold text-gray-800">360° Unified Search</h1>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleSearch}>
                        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                            <AccordionSection title="Date Range" id="date"> <div className="space-y-4"> <div><label className="text-sm">Ticket Creation Date</label><input type="date" name="ticketCreationDate" value={searchParams.ticketCreationDate} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md"/></div> </div> </AccordionSection>
                            <AccordionSection title="Partner Information" id="partner"> <div className="space-y-4"> <div><label className="text-sm">Partner Code</label><input type="text" name="partnerCode" value={searchParams.partnerCode} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md"/></div> </div> </AccordionSection>
                            <AccordionSection title="Customer & Policy Information" id="customer"> <div className="space-y-4"> <div><label className="text-sm">Customer Phone</label><input type="text" name="customerPhone" value={searchParams.customerPhone} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md"/></div> <div><label className="text-sm">Policy Number</label><input type="text" name="policyNumber" value={searchParams.policyNumber} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md"/></div> </div> </AccordionSection>
                            <AccordionSection title="Vehicle Information" id="vehicle"> <div className="space-y-4"> <div><label className="text-sm">Registration Number</label><input type="text" name="registrationNumber" value={searchParams.registrationNumber} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md"/></div> </div> </AccordionSection>
                            <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700"> <Search size={20}/> <span>Search</span> </button>
                        </div>
                    </form>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold">Search Results</h2>
                    {isSearching ? <LoadingSpinner /> : !searchResults ? <InitialSearchMessage /> : searchResults.tickets.length === 0 ? <NoResultsMessage /> : <SearchResultsComponent results={searchResults} />}
                </div>
            </div>
        </div>
    );
};
const LoadingSpinner = () => ( <div className="flex justify-center items-center h-64"> <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div> </div> );
const InitialSearchMessage = () => ( <div className="mt-10 text-center"> <Search size={48} className="mx-auto text-gray-300"/> <p className="mt-4 text-gray-500">Perform a search to see results.</p> </div> );
const NoResultsMessage = () => ( <div className="mt-10 text-center"> <FileText size={48} className="mx-auto text-gray-300"/> <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Found</h3> <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p> </div> );
const SearchResultsComponent = ({ results }: {results: any}) => {
    const [activeTab, setActiveTab] = useState('Tickets');
    const { onTicketClick } = useContext(AppContext);
    const tabs = [ { name: 'Tickets', count: results.tickets.length }, { name: 'Policies', count: results.policies.length }, { name: 'Customers', count: results.customers.length }, ];
    return (
        <div className="mt-4">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6"> {tabs.map(tab => ( <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`${activeTab === tab.name ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}> {tab.name} <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${activeTab === tab.name ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900'}`}>{tab.count}</span> </button> ))} </nav>
            </div>
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {activeTab === 'Tickets' && results.tickets.map((t: any) => <TicketListItem key={t.ticket_id} ticket={t} onTicketClick={onTicketClick} />)}
                {activeTab === 'Policies' && results.policies.map((p: any) => <PolicyListItem key={p.id} policy={p} />)}
                {activeTab === 'Customers' && results.customers.map((c: any) => <CustomerListItem key={c.id} customer={c} />)}
            </div>
        </div>
    );
};
const PolicyListItem = ({ policy }: {policy: any}) => ( <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"> <div className="flex justify-between items-center"> <p className="font-semibold text-gray-800">{policy.type}</p> <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Policy</span> </div> <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-x-4 gap-y-1"> <span><strong>Policy #:</strong> {policy.number}</span> <span><strong>Premium:</strong> ₹{policy.premium.toLocaleString('en-IN')}</span> <span><strong>Vehicle:</strong> {policy.vehicle || 'N/A'}</span> <span><strong>Issued On:</strong> {formatDate(policy.issueDate)}</span> </div> </div> );
const CustomerListItem = ({ customer }: {customer: any}) => ( <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"> <div className="flex justify-between items-center"> <p className="font-semibold text-gray-800">{customer.name}</p> <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Customer</span> </div> <div className="mt-2 text-sm text-gray-600 grid grid-cols-1"> <span><strong>Email:</strong> {customer.email}</span> <span><strong>Phone:</strong> {customer.phone}</span> </div> </div> );

const AppHeader = () => {
  const { activeView, navigate } = useContext(AppContext);
  const navItems = [ { name: 'Resolution Desk', icon: <LayoutDashboard /> }, { name: '360° Search', icon: <Search /> }, { name: 'Email', icon: <Mail /> }, { name: 'Analytics', icon: <BarChart2 /> }, ];
  return ( <header className="bg-white text-gray-800 flex items-center justify-between p-4 shadow-md z-10"> <div className="flex items-center space-x-3"> <Briefcase size={32} className="text-indigo-600" /> <span className="text-xl font-bold text-gray-900">ResolutionCRM</span> </div> <nav className="flex items-center space-x-2"> {navItems.map(item => ( <button key={item.name} onClick={() => navigate(item.name)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${ activeView === item.name ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900' }`} > {React.cloneElement(item.icon, { size: 20 })} <span>{item.name}</span> </button> ))} </nav> <div className="flex items-center space-x-4"> <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"> <PlusCircle size={18} /> <span>Raise Ticket</span> </button> <button className="p-2 rounded-full hover:bg-gray-100"> <Bell size={20} className="text-gray-600"/> </button> <div className="flex items-center space-x-2"> <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">A</div> <span className="text-sm font-medium">Anjali M.</span> </div> <button className="p-2 rounded-full hover:bg-gray-100"> <LogOut size={20} className="text-gray-600"/> </button> </div> </header> );
};

export default function ResolutionOwner() {
  const [activeView, setActiveView] = useState('Resolution Desk');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchPrefill, setSearchPrefill] = useState(null);
  const [, setUpdate] = useState(0);

  const forceUpdate = () => setUpdate(u => u + 1);
  const handleTicketClick = (ticket: any) => { setSelectedTicket(ticket); };
  const handleCloseModal = () => { setSelectedTicket(null); };
  const navigate = (view: string, params: any = {}) => { if (params.prefill) { setSearchPrefill(params.prefill); } else { setSearchPrefill(null); } setActiveView(view); };

  const renderView = () => {
    switch (activeView) {
      case 'Resolution Desk': return <DashboardView />;
      case 'Analytics': return <AnalyticsView />;
      case 'Email': return <EmailView />;
      case '360° Search': return <SearchView prefill={searchPrefill} />;
      default: return <DashboardView />;
    }
  };

  return (
    <AppContext.Provider value={{ activeView, navigate, onTicketClick: handleTicketClick, forceUpdate }}>
      <div className="h-screen w-screen flex flex-col bg-gray-50 font-sans">
        <AppHeader />
        <main className="flex-grow overflow-y-auto">
          {renderView()}
        </main>
        {selectedTicket && <TicketDetailModal ticket={selectedTicket} onClose={handleCloseModal} />}
      </div>
    </AppContext.Provider>
  );
}