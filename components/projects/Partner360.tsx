import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield, User, FileText, Wrench, FileSignature, TrendingUp, Repeat, Banknote, LayoutGrid,
  Wallet, Trophy, UserCheck, Search, Bell, ChevronDown, Phone, Mail, CheckCircle,
  Clock, AlertCircle, Car, HeartPulse, PlusCircle, MoreVertical, Pencil, Save, History, Download, LifeBuoy, UserCog,
  FilePlus, ClipboardList, Stethoscope, Hourglass, Users, Star, MapPin, Landmark, Info, Briefcase, CreditCard,
  ChevronLeft, Heart, BookUser, X, Target, Link as LinkIcon, Cake, GitBranch, MessageSquare, Users2, CarFront, ShieldCheck,
  IdCard, Share2, Building, Calendar, DollarSign, UserPlus, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';


// ===================================================================================
// --- MOCK DATA (In a real app, this comes from an API) ---
// ===================================================================================

// --- PARTNER PORTAL DATA ---
const partnerData = {
  id: 'POSP-845-231-987',
  name: 'Ananya Sharma',
  joinDate: '2022-08-15',
  contact: { phone: '+91 98765 43210', alternatePhone: '+91 87654 32109', email: 'ananya.sharma@example.com' },
  address: { street: '123, Sunshine Apartments', city: 'Gurugram', state: 'Haryana', zip: '122002' },
  bankDetails: { accountNumber: 'XXXX XXXX 1234', ifsc: 'HDFC0001234', pan: 'ABCDE1234F' },
  primaryBusiness: 'Motor',
  rmAllocation: {
      field: { product: 'Motor', name: 'Sanjay Gupta', contact: '+91 91234 56789' },
      virtual: [
          { product: 'Motor', name: 'Amit Singh', contact: '+91 99887 76655' },
          { product: 'Health', name: 'Priya Desai', contact: '+91 99887 76654' },
          { product: 'Life', name: 'Neha Kakkar', contact: '+91 99887 76652' },
          { product: 'SME', name: null, contact: null },
      ],
      renewal: [
          { product: 'Motor', name: 'Sunita Rao', contact: '+91 99887 76653' },
          { product: 'Health', name: 'Vikram Rathod', contact: '+91 99887 76651' },
          { product: 'Life', name: 'Sunita Rao', contact: '+91 99887 76653' },
      ]
  },
  stats: { activePolicies: 12, openClaims: 2, pendingPayout: '₹12,500', loyaltyCoins: 1580 },
  kyc: { status: 'Verified', docs: [ { name: 'PAN Card', status: 'Verified'}, { name: 'Aadhaar Card', status: 'Verified' }, { name: 'Bank Details', status: 'Verified' }] },
  motorClaims: [ { id: 'MOT-CLM-001', policy: 'POL-MOT-123', status: 'Pending', surveyor: 'Rajesh Kumar', payment: 'Pending', date: '2024-07-28' }, { id: 'MOT-CLM-002', policy: 'POL-MOT-456', status: 'Approved', surveyor: 'Priya Singh', payment: 'Paid', date: '2024-06-15' } ],
  healthClaims: [ { id: 'HLT-CLM-001', policy: 'POL-HLT-789', status: 'Pre-Auth Approved', preAuth: '₹50,000', payment: 'Cashless', date: '2024-07-25' } ],
  policies: [ { id: 'POL-MOT-123', type: 'Motor', status: 'Active', issue: null }, { id: 'POL-HLT-789', type: 'Health', status: 'Active', issue: null }, { id: 'POL-MOT-999', type: 'Motor', status: 'Error', issue: 'Dual Payment' } ],
  openIssues: [ { id: 'ISS-101', module: 'Payout', subject: 'June Payout Mismatch', status: 'Open' } ],
  endorsements: { motor: [{id: 'MOT-END-01', policy: 'POL-MOT-123', type: 'Name Correction', status: 'Pending', date: '2024-08-01'}], health: [{id: 'HLT-END-01', policy: 'POL-HLT-789', type: 'Pre-existing illness update', status: 'Approved', date: '2024-07-20'}] },
  renewals: [ {policyId: 'POL-LIF-001', type: 'Life', premium: '₹30,000', dueDate: '2025-08-15', status: 'Due'}, {policyId: 'POL-MOT-456', type: 'Motor', premium: '₹18,000', dueDate: '2025-08-20', status: 'Due'} ],
  payouts: { history: [{id: 'PAY-07-24', month: 'July 2024', amount: '₹25,600', status: 'Paid', date: '2024-08-05'}], issues: [{id: 'PAY-ISS-01', subject: 'Invoice-GST Mismatch', status: 'Open', reportedDate: '2024-08-02'}] },
  payoutGrid: { motor: [{vehicle: 'Private Car', type: 'New', payout: '15%'}, {vehicle: 'Private Car', type: 'Renewal', payout: '12%'}], health: [{plan: 'Individual Health', type: 'New', payout: '20%'}, {plan: 'Individual Health', type: 'Renewal', payout: '15%'}] },
  ledger: { balance: '₹5,250', entries: [{date: '2024-08-05', desc: 'Credit from Policy POL-MOT-123', amount: '+ ₹1,500'}, {date: '2024-08-02', desc: 'Debit for Endorsement Fee', amount: '- ₹250'}] },
  wallet: { balance: '₹1,500', status: 'Active' },
  loyalty: { coins: 1580, history: [{date: '2024-07-15', desc: 'Contest "Monsoon Bonanza" Win', coins: '+ 500'}], contests: [{name: 'Top Performer August', status: 'Ongoing', details: 'Highest premium collection wins a trip to Goa.'}] },
  preSales: {
      quotes: [ {id: 'Q-MOT-001', type: 'Motor', premium: '₹21,500', status: 'Sent', date: '2024-08-04'}, {id: 'Q-HLT-002', type: 'Health', premium: '₹35,000', status: 'Accepted', date: '2024-08-03'}, {id: 'Q-LIF-003', type: 'Life & Investment', premium: '₹1,00,000', status: 'Generated', date: '2024-08-05'} ],
      inspections: [ {id: 'INS-001', vehicle: 'DL10CA1234', status: 'Scheduled', date: '2024-08-08'}, {id: 'INS-002', vehicle: 'HR26DB5678', status: 'Completed', date: '2024-08-02'} ],
      healthMedicals: [ {id: 'MED-HLT-001', applicant: 'Self', status: 'Scheduled', date: '2024-08-10'} ],
      lifeMedicals: [ {id: 'MED-LIF-001', applicant: 'Self', status: 'Medical Required', date: '2024-08-12'} ],
      underIssuance: [ {id: 'ISS-HLT-002', policyType: 'Health', premium: '₹35,000', status: 'Pending Issuance', quoteId: 'Q-HLT-002'} ]
  },
  technicalIssues: [
      {id: 'T-001', category: 'Payment', subject: 'Payment deducted, policy not generated', status: 'Open', date: '2024-08-05', referenceId: 'TXN-12345'},
      {id: 'T-002', category: 'Data Mismatch', subject: 'Incorrect vehicle make/model', status: 'In Progress', date: '2024-08-04', referenceId: 'POL-MOT-123'},
  ]
};

// --- CUSTOMER BOOK DATA ---
const mockCustomers = [
  { 
    id: 1, name: 'Rohan Sharma', contact: '+91 98765 43210', alternateContact: '+91 98765 11111', email: 'rohan.s@example.com',
    city: 'Mumbai', area: 'Andheri', fullAddress: '12B, Skyline Apartments, Andheri West', dob: '1988-05-15', maritalStatus: 'Married', occupation: 'Software Engineer',
    leadSource: 'Referral by Ankit Kumar',
    vehicleCount: 1,
    familyMembers: [
        { id: 101, name: 'Priya Sharma', relationship: 'Spouse', dob: '1990-03-22', age: 35 },
        { id: 102, name: 'Aarav Sharma', relationship: 'Son', dob: '2018-09-10', age: 7 },
    ],
    activityLog: [
      { id: 101, date: '2025-09-18', product: 'Health', activity: 'Quote Sent', remarks: 'Sent quote for Family Floater Plan A. CJ Link: xyz123'},
      { id: 102, date: '2025-09-16', product: 'General', activity: 'Initial Call', remarks: 'Discussed needs, client is interested in health.'},
    ],
    policies: {
      health: { 
        status: 'Opportunity', reason: 'Family health cover needed.', tentativePremium: 18000, potentialPayout: 2700, 
        followUpDate: '2025-09-25', isDeclined: false, 
        leadDetails: { suggestedInsurer: 'HDFC Ergo', suggestedPlan: 'Optima Restore', suggestedSumInsured: 1000000 },
        cjLink: 'https://example.com/quote/health/xyz123' 
      },
      life: { 
        status: 'Active', renewalDate: '2026-07-20', premium: 63000, 
        policies: [{ id: 'L1', insurer: 'LIC', plan: 'Jeevan Anand', planType: 'Endowment', sumInsured: 5000000, insuredName: 'Rohan Sharma' }]
      },
      motor: { 
        status: 'Active', 
        vehicles: [{ id: 'V1', regNo: 'MH02AB1234', mmv: 'Honda City VX', premium: 22000, idv: 850000, expiryDate: '2026-03-15', insurer: 'Bajaj Allianz', policyNumber: 'BAJ-M-12345', ncb: '25%', fuelType: 'Petrol' }]
      },
    }
  },
  { 
    id: 2, name: 'Priya Verma', contact: '+91 87654 32109', alternateContact: null, email: 'priya.v@example.com',
    city: 'Delhi', area: 'Saket', fullAddress: 'A-45, First Floor, Saket', dob: '1992-11-20', maritalStatus: 'Single', occupation: 'Graphic Designer',
    leadSource: 'Website Inquiry',
    vehicleCount: 0,
    familyMembers: [],
    activityLog: [ { id: 201, date: '2025-09-19', product: 'Life', activity: 'Follow-up Scheduled', remarks: 'Set reminder for Oct 5th.'} ],
    policies: {
      health: { 
          status: 'Active', 
          policies: [{ id: 'H2', insurer: 'Star Health', plan: 'Young Star', sumInsured: 500000, premium: 25000, renewalDate: '2026-01-30' }]
      },
      life: { 
        status: 'Opportunity', reason: 'Underinsured, needs a term plan.', tentativePremium: 15000, potentialPayout: 2250, 
        followUpDate: '2025-10-05', isDeclined: false, 
        leadDetails: { suggestedInsurer: 'Max Life', suggestedPlan: 'Smart Secure Plus', suggestedSumInsured: 10000000 },
        cjLink: null 
      },
      motor: { status: 'OutOfScope', reason: 'Does not own a vehicle.' },
    }
  },
   { 
    id: 3, name: 'Amit Patel', contact: '+91 76543 21098', alternateContact: null, email: 'a.patel@example.com',
    city: 'Ahmedabad', area: 'Navrangpura', fullAddress: '7, Ashirwad Bunglows, Navrangpura', dob: '1984-02-10', maritalStatus: 'Married', occupation: 'Business Owner',
    leadSource: 'Walk-in',
    vehicleCount: 2,
    familyMembers: [{ id: 301, name: 'Mina Patel', relationship: 'Spouse', dob: '1986-04-15', age: 39 }],
    activityLog: [ { id: 301, date: '2025-09-12', product: 'Health', activity: 'Marked Declined', remarks: 'Client has sufficient corporate coverage for now.'} ],
    policies: {
      health: { 
        status: 'Opportunity', reason: 'Top-up plan for parents.', isDeclined: true, declineReason: 'Has corporate health cover.' 
      },
      life: { 
        status: 'Opportunity', reason: 'Approaching 40, retirement plan.', tentativePremium: 50000, potentialPayout: 7500, 
        followUpDate: null, isDeclined: false, 
        leadDetails: { suggestedInsurer: 'ICICI Prudential', suggestedPlan: 'Signature Elite', suggestedSumInsured: 20000000 },
        cjLink: 'https://example.com/quote/life/abc456' 
      },
      motor: { 
          status: 'Active', 
          vehicles: [
              { id: 'V3A', regNo: 'GJ01CD5678', mmv: 'Toyota Fortuner', premium: 45000, idv: 3200000, expiryDate: '2025-09-28', insurer: 'HDFC Ergo', policyNumber: 'HDF-M-67890', ncb: '0%', fuelType: 'Diesel' },
              { id: 'V3B', regNo: 'GJ01EF9012', mmv: 'Maruti Swift', premium: 12000, idv: 550000, expiryDate: '2026-05-10', insurer: 'Go Digit', policyNumber: 'GOD-M-11223', ncb: '35%', fuelType: 'Petrol' }
          ]
      },
    }
  },
];

const mockAgentData = {
    name: 'Ananya Sharma',
    title: 'Certified Insurance Advisor',
    phone: '+91 98765 43210',
    email: 'ananya.sharma@example.com',
    photoUrl: `https://i.pravatar.cc/150?u=agent1`
};
const mockPhoneContacts = [ { id: 'p1', name: 'Aarav Gupta', phone: '+91 91234 56780' }, { id: 'p2', name: 'Isha Reddy', phone: '+91 91234 56781' }, { id: 'p3', name: 'Kabir Khan', phone: '+91 91234 56782' }];

const formatCurrency = (value?: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits:0 }).format(value || 0);
const Card = ({ children, className = '' }: {children: React.ReactNode, className?: string}) => (<div className={`bg-white dark:bg-slate-800/50 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}>{children}</div>);
const CardHeader = ({ children, action }: {children: React.ReactNode, action?: React.ReactNode}) => (<div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center"><h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">{children}</h3>{action}</div>);
const CardContent = ({ children, className = '' }: {children: React.ReactNode, className?: string}) => <div className={`p-4 md:p-5 ${className}`}>{children}</div>;
const ActionButton = ({ icon: Icon, text, onClick }: {icon: React.ElementType, text: string, onClick?: () => void}) => (<button onClick={onClick} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"><Icon className="inline -ml-1 mr-1 h-4 w-4" />{text}</button>);
const StatusBadge = ({ status }: {status: string}) => {
    const statusMap: {[key: string]: {color: string, icon: React.ElementType}} = { 'Pending': { color: 'yellow', icon: Clock }, 'Approved': { color: 'green', icon: CheckCircle }, 'Pre-Auth Approved': { color: 'blue', icon: CheckCircle }, 'Paid': { color: 'green', icon: CheckCircle }, 'Cashless': { color: 'blue', icon: CheckCircle }, 'Active': { color: 'green', icon: CheckCircle }, 'Error': { color: 'red', icon: AlertCircle }, 'Open': { color: 'yellow', icon: Clock }, 'In Progress': { color: 'blue', icon: Clock }, 'Verified': { color: 'green', icon: CheckCircle }, 'Due': {color: 'red', icon: AlertCircle}, 'Upcoming': {color: 'yellow', icon: Clock}, 'Resolved': {color: 'green', icon: CheckCircle}, 'Sent': {color: 'blue', icon: CheckCircle}, 'Accepted': {color: 'green', icon: CheckCircle}, 'Generated': {color: 'gray', icon: FilePlus}, 'Scheduled': {color: 'blue', icon: Clock}, 'Completed': {color: 'green', icon: CheckCircle}, 'Medical Required': {color: 'red', icon: Stethoscope}, 'Pending Issuance': {color: 'yellow', icon: Hourglass} };
    const { color, icon: Icon } = statusMap[status] || { color: 'gray', icon: Info };
    const colors: {[key: string]: string} = {
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        gray: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    };
    return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}><Icon className="mr-1.5 h-3 w-3" />{status}</span>);
};
const TabButton = ({ text, icon: Icon, isActive, onClick }: {text: string, icon?: React.ElementType, isActive: boolean, onClick: () => void}) => (
    <button onClick={onClick} className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm ${isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
        {Icon && <Icon className="inline mr-2 h-5 w-5"/>} {text}
    </button>
);
const PayoutScopeIndicator = ({ policy }: {policy: any}) => {
    if (policy.isDeclined) return <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300`}>Declined</span>;
    if (policy.status === 'Opportunity' && policy.potentialPayout > 0) {
        return <div className="flex flex-col items-center justify-center text-center"><span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{formatCurrency(policy.potentialPayout)}</span><span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mt-1">Opportunity</span></div>;
    }
    const styles: {[key: string]: string} = { Active: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200', OutOfScope: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' };
    const text: {[key: string]: string} = { Active: 'Active', OutOfScope: 'No Scope' };
    if (!policy.status) return null;
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[policy.status]}`}>{text[policy.status]}</span>;
};

const InviteModal = ({ isOpen, onClose }: {isOpen: boolean, onClose: () => void}) => {
    const [step, setStep] = useState(1);
    const [importedContacts, setImportedContacts] = useState<any[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const handleImport = () => { setImportedContacts(mockPhoneContacts); setStep(2); };
    const handleSelectContact = (contactId: string) => { setSelectedContacts(prev => prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]); };
    const handleSelectAll = () => { setSelectedContacts(selectedContacts.length === importedContacts.length ? [] : importedContacts.map(c => c.id)); };
    const handleSendInvites = () => { console.log("Simulating sending invites to:", selectedContacts); setStep(3); };
    const resetAndClose = () => { setStep(1); setImportedContacts([]); setSelectedContacts([]); onClose(); };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Invite New Customers</h3><button onClick={resetAndClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><X size={20}/></button></div>
                <div className="p-6">
                    {step === 1 && (<div className="text-center"><p className="text-slate-600 dark:text-slate-300 mb-4">Grow your customer base by importing contacts and sending them a WhatsApp invitation.</p><button onClick={handleImport} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-transform transform hover:scale-105"><BookUser size={20}/><span>Import from Phone Contacts</span></button></div>)}
                    {step === 2 && (<div><div className="flex justify-between items-center mb-3"><div className="flex items-center"><input type="checkbox" id="selectAll" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={selectedContacts.length > 0 && selectedContacts.length === importedContacts.length} onChange={handleSelectAll}/><label htmlFor="selectAll" className="ml-2 text-sm text-slate-600 dark:text-slate-300">Select All</label></div><p className="text-sm font-medium">{selectedContacts.length} selected</p></div><div className="max-h-60 overflow-y-auto space-y-2 pr-2">{importedContacts.map(contact => (<div key={contact.id} onClick={() => handleSelectContact(contact.id)} className={`flex items-center p-3 rounded-lg cursor-pointer border ${selectedContacts.includes(contact.id) ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700'}`}><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={selectedContacts.includes(contact.id)} readOnly/><div className="ml-3"><p className="font-semibold text-slate-800 dark:text-slate-100">{contact.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{contact.phone}</p></div></div>))}</div><button onClick={handleSendInvites} disabled={selectedContacts.length === 0} className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition"><MessageSquare size={20}/><span>Send WhatsApp Invite ({selectedContacts.length})</span></button></div>)}
                    {step === 3 && (<div className="text-center"><div className="mx-auto bg-green-100 h-16 w-16 rounded-full flex items-center justify-center"><CheckCircle className="text-green-600" size={32}/></div><h4 className="text-xl font-bold text-slate-800 dark:text-white mt-4">Invites Sent!</h4><p className="text-slate-600 dark:text-slate-300 mt-1">Your message has been queued for {selectedContacts.length} contact(s).</p><button onClick={resetAndClose} className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition">Done</button></div>)}
                </div>
            </div>
        </div>
    );
};

const DigitalVCardModal = ({ isOpen, onClose, agent }: {isOpen: boolean, onClose: () => void, agent: any}) => {
    const [shareText, setShareText] = useState('Share Card');
    useEffect(() => { if (!isOpen) { setTimeout(() => setShareText('Share Card'), 300); } }, [isOpen]);
    const handleShare = () => {
        const cardUrl = `https://example.com/advisor/${agent.name.replace(/\s/g, '-')}`;
        const textArea = document.createElement("textarea");
        textArea.value = cardUrl;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setShareText('Link Copied!');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            setShareText('Copy Failed!');
        }
        document.body.removeChild(textArea);
        setTimeout(() => setShareText('Share Card'), 2000);
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all relative overflow-hidden">
                <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 z-20"><X size={20}/></button>
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-600 to-indigo-800 -z-10"></div>
                <div className="absolute top-4 left-4 flex items-center space-x-2"><Building className="text-white/80" size={20}/><span className="font-bold text-white/80 text-lg">Partner Portal</span></div>
                <div className="pt-20 pb-6 text-center">
                    <img src={agent.photoUrl} alt={agent.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"/>
                    <h2 className="text-3xl font-bold text-slate-900">{agent.name}</h2>
                    <p className="text-indigo-700 font-semibold text-md">{agent.title}</p>
                </div>
                <div className="px-6 pb-6 text-center"><div className="bg-white p-4 rounded-xl shadow"><p className="text-slate-700 font-medium">Your one-stop solution for <span className="text-blue-600 font-bold">free, expert advice</span> on all insurance products.</p></div></div>
                <div className="px-6 pb-6 flex justify-center space-x-6 text-slate-600">
                    <div className="text-center"><Heart className="mx-auto text-red-500 h-8 w-8"/><span className="text-xs font-medium">Health</span></div>
                    <div className="text-center"><ShieldCheck className="mx-auto text-green-500 h-8 w-8"/><span className="text-xs font-medium">Life</span></div>
                    <div className="text-center"><CarFront className="mx-auto text-yellow-500 h-8 w-8"/><span className="text-xs font-medium">Motor</span></div>
                </div>
                <div className="px-6 pb-6 space-y-3">
                    <a href={`tel:${agent.phone}`} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"><Phone size={20} className="mr-4 text-blue-600"/><div><div className="text-xs text-slate-500">Call Me</div><span className="font-semibold text-slate-800">{agent.phone}</span></div></a>
                    <a href={`https://wa.me/${agent.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"><MessageSquare size={20} className="mr-4 text-green-500"/><div><div className="text-xs text-slate-500">WhatsApp</div><span className="font-semibold text-slate-800">Chat for free advice</span></div></a>
                    <a href={`mailto:${agent.email}`} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"><Mail size={20} className="mr-4 text-slate-500"/><div><div className="text-xs text-slate-500">Email</div><span className="font-semibold text-slate-800">{agent.email}</span></div></a>
                </div>
                <div className="p-4 bg-slate-200 flex space-x-3">
                    <button onClick={handleShare} className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"><Share2 size={18}/><span>{shareText}</span></button>
                    <button className="bg-white text-slate-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-50 transition shadow-sm"><Download size={18}/><span>Save</span></button>
                </div>
            </div>
        </div>
    );
};

const AddCustomerModal = ({ isOpen, onClose, onAddCustomer }: {isOpen: boolean, onClose: () => void, onAddCustomer: (customer: any) => void}) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [dob, setDob] = useState('');
    const [occupation, setOccupation] = useState('');
    const [leadSource, setLeadSource] = useState('Manual Entry');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !contact) {
            setError('Customer Name and Contact Number are required.');
            return;
        }

        const newCustomer = {
            id: Date.now(),
            name,
            contact,
            alternateContact: '',
            email,
            city,
            area,
            fullAddress: '',
            dob,
            maritalStatus: 'N/A',
            occupation,
            leadSource,
            vehicleCount: 0,
            familyMembers: [],
            activityLog: [
                { id: Date.now() + 1, date: '2025-09-20', product: 'General', activity: 'Customer Added', remarks: 'Manually added to the system.'},
            ],
            policies: {
                health: { status: 'Opportunity', reason: 'Needs initial assessment.', isDeclined: false },
                life: { status: 'Opportunity', reason: 'Needs initial assessment.', isDeclined: false },
                motor: { status: 'Opportunity', reason: 'Needs initial assessment.', isDeclined: false },
            }
        };
        
        onAddCustomer(newCustomer);
        handleClose();
    };
    
    const handleClose = () => {
        setName('');
        setContact('');
        setEmail('');
        setCity('');
        setArea('');
        setDob('');
        setOccupation('');
        setLeadSource('Manual Entry');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center"><UserPlus size={20} className="mr-2"/>Add New Customer</h3>
                    <button onClick={handleClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline ml-2">{error}</span></div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">Full Name <span className="text-red-500">*</span></label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">Contact Number <span className="text-red-500">*</span></label><input type="tel" value={contact} onChange={e => setContact(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                             <div><label className="block font-medium text-slate-700 dark:text-slate-300">Date of Birth</label><input type="date" value={dob} onChange={e => setDob(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">Area</label><input type="text" value={area} onChange={e => setArea(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">Occupation</label><input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"/></div>
                            <div><label className="block font-medium text-slate-700 dark:text-slate-300">Lead Source</label><select value={leadSource} onChange={e => setLeadSource(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm sm:text-sm dark:bg-slate-900 dark:border-slate-600"><option>Manual Entry</option><option>Referral</option><option>Walk-in</option><option>Website Inquiry</option><option>Other</option></select></div>
                        </div>
                    </div>
                    <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                        <button type="button" onClick={handleClose} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm mr-2">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition shadow-sm"><Save size={16}/><span>Save Customer</span></button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: {totalItems: number, itemsPerPage: number, currentPage: number, onPageChange: (page: number) => void}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-between mt-4 px-6 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-700 dark:text-slate-300">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <div className="flex items-center space-x-1">
                <button onClick={() => handlePageClick(1)} disabled={currentPage === 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronsLeft size={16} /></button>
                <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={16} /></button>
                <span className="px-2 text-sm">...</span>
                <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={16} /></button>
                <button onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronsRight size={16} /></button>
            </div>
        </div>
    );
};

const CustomerBookPage = ({ customers, onSelectCustomer, onAddCustomer }: {customers: any[], onSelectCustomer: (customer: any) => void, onAddCustomer: (customer: any) => void}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [isVCardModalOpen, setVCardModalOpen] = useState(false);
    const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [areaFilter, setAreaFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const uniqueCities = useMemo(() => ['all', ...new Set(customers.map(c => c.city))], [customers]);
    const uniqueAreas = useMemo(() => {
        if (cityFilter === 'all') return ['all'];
        return ['all', ...new Set(customers.filter(c => c.city === cityFilter).map(c => c.area))];
    }, [customers, cityFilter]);

    const getCustomerTotalPayout = (customer: any) => {
        let total = 0;
        for (const policy of Object.values(customer.policies)) {
            const p = policy as any;
            total += p.status === 'Opportunity' && !p.isDeclined ? Number(p.potentialPayout || 0) : 0;
        }
        return total;
    };
    
    const filteredCustomers = useMemo(() => {
        const now = new Date('2025-09-20T12:35:00');
        const thirtyDaysFromNow = new Date(now); thirtyDaysFromNow.setDate(now.getDate() + 30);
        const sevenDaysFromNow = new Date(now); sevenDaysFromNow.setDate(now.getDate() + 7);

        let baseFiltered = customers.filter(c => {
            const searchMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.contact.includes(searchTerm);
            const cityMatch = cityFilter === 'all' || c.city === cityFilter;
            const areaMatch = areaFilter === 'all' || c.area === areaFilter;
            
            let actionMatch = true;
            if (activeFilter === 'renewals') {
                actionMatch = Object.values(c.policies).some((p: any) => p.status === 'Active' && ( (p.renewalDate && new Date(p.renewalDate) >= now && new Date(p.renewalDate) <= thirtyDaysFromNow) || (p.vehicles && p.vehicles.some((v: any) => new Date(v.expiryDate) >= now && new Date(v.expiryDate) <= thirtyDaysFromNow))));
            } else if (activeFilter === 'followups') {
                actionMatch = Object.values(c.policies).some((p: any) => p.followUpDate && new Date(p.followUpDate) >= now && new Date(p.followUpDate) <= sevenDaysFromNow);
            } else if (activeFilter === 'opportunities') {
                actionMatch = getCustomerTotalPayout(c) > 0;
            }
            return searchMatch && cityMatch && areaMatch && actionMatch;
        });

        if (activeFilter === 'opportunities') baseFiltered.sort((a, b) => getCustomerTotalPayout(b) - getCustomerTotalPayout(a));
        
        setCurrentPage(1);
        return baseFiltered;
    }, [customers, searchTerm, activeFilter, cityFilter, areaFilter]);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    const filteredPayoutScope = useMemo(() => {
        return filteredCustomers.reduce((acc, c) => {
            const p = c.policies;
            if (p.health?.status === 'Opportunity' && !p.health.isDeclined) acc.health += p.health.potentialPayout || 0;
            if (p.life?.status === 'Opportunity' && !p.life.isDeclined) acc.life += p.life.potentialPayout || 0;
            if (p.motor?.status === 'Opportunity' && !p.motor.isDeclined) acc.motor += p.motor.potentialPayout || 0;
            acc.total = acc.health + acc.life + acc.motor;
            return acc;
        }, { health: 0, life: 0, motor: 0, total: 0 });
    }, [filteredCustomers]);

    const upcomingRenewalsCount = useMemo(() => customers.filter(c => Object.values(c.policies).some((p: any) => p.status === 'Active' && ( (p.renewalDate && new Date(p.renewalDate) <= new Date(new Date().setDate(new Date().getDate() + 30))) || (p.vehicles && p.vehicles.some((v: any) => new Date(v.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30))))))).length, [customers]);
    const followUpsCount = useMemo(() => customers.filter(c => Object.values(c.policies).some((p: any) => p.followUpDate && new Date(p.followUpDate) <= new Date(new Date().setDate(new Date().getDate() + 7)))).length, [customers]);
    const opportunitiesCount = useMemo(() => customers.filter(c => getCustomerTotalPayout(c) > 0).length, [customers]);
    
    const ActionFilterButton = ({ type, count, icon: Icon, color, label }: {type: string, count: number, icon: React.ElementType, color: string, label: string}) => {
        const isActive = activeFilter === type;
        const colorClasses: {[key: string]: any} = {
            indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', badge: 'bg-indigo-500' },
            red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-500' },
            yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', badge: 'bg-yellow-500' },
        };
        const c = colorClasses[color];

        return (
            <button onClick={() => setActiveFilter(isActive ? 'all' : type)} className={`relative flex flex-col items-center justify-center text-center p-3 rounded-xl transition-colors w-28 h-24 ${isActive ? c.bg : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Icon size={24} className={c.text}/>
                <span className={`mt-1 font-semibold text-sm ${isActive ? c.text : 'text-slate-700 dark:text-slate-200'}`}>{label}</span>
                {count > 0 && <span className={`absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white ${c.badge}`}>{count}</span>}
            </button>
        );
    };

    return (
    <>
        <InviteModal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} />
        <DigitalVCardModal isOpen={isVCardModalOpen} onClose={() => setVCardModalOpen(false)} agent={mockAgentData} />
        <AddCustomerModal isOpen={isAddCustomerModalOpen} onClose={() => setAddCustomerModalOpen(false)} onAddCustomer={onAddCustomer} />
        <div>
            <header className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div><h1 className="text-3xl font-bold text-slate-800 dark:text-white">Customer Command Center</h1><p className="text-slate-500 dark:text-slate-400">Saturday, 20 September 2025 • Gurugram, Haryana</p></div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2 sm:space-x-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex flex-col items-center justify-center text-center p-3 w-28 h-24 rounded-lg"> <Users size={24} className="text-blue-600"/> <span className="mt-1 font-semibold text-sm text-slate-700 dark:text-slate-200">Total Customers</span> <p className="font-bold text-xl text-slate-800 dark:text-slate-100">{customers.length}</p></div><div className="w-px h-16 bg-slate-200 dark:bg-slate-700"></div>
                        <ActionFilterButton type="opportunities" count={opportunitiesCount} icon={Target} color="indigo" label="Opportunities" />
                        <ActionFilterButton type="renewals" count={upcomingRenewalsCount} icon={Bell} color="red" label="Renewals Due" />
                        <ActionFilterButton type="followups" count={followUpsCount} icon={Calendar} color="yellow" label="Follow-ups" />
                    </div>
                </div>
            </header>
            <Card>
                <CardHeader>
                    My Customer Book
                </CardHeader>
                 <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                        <div className="flex-1">
                            <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/><input type="text" placeholder="Search by name or contact..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"/></div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setVCardModalOpen(true)} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition shadow-sm"><IdCard size={18}/><span>My Digital Card</span></button>
                            <button onClick={() => setAddCustomerModalOpen(true)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition shadow-sm"><UserPlus size={18}/><span>Add Customer</span></button>
                            <button onClick={() => setInviteModalOpen(true)} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition shadow-sm"><UserPlus size={18}/><span>Invite & Promote Business</span></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <select value={cityFilter} onChange={e => {setCityFilter(e.target.value); setAreaFilter('all');}} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">{uniqueCities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}</select>
                        <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800" disabled={cityFilter === 'all'}><option value="all">All Areas</option>{uniqueAreas.slice(1).map(area => <option key={area} value={area}>{area}</option>)}</select>
                        <div className="lg:col-span-2 flex items-center justify-between">
                            <button onClick={() => { setActiveFilter('all'); setCityFilter('all'); setAreaFilter('all'); setSearchTerm(''); }} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Clear Filters</button>
                        </div>
                    </div>
                </CardContent>
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 border-t border-b border-slate-200 dark:border-slate-700"><div className="flex flex-col sm:flex-row justify-between items-center"><p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2 sm:mb-0">Showing <span className="font-bold">{paginatedCustomers.length}</span> of <span className="font-bold">{filteredCustomers.length}</span> Customers</p><div className="flex items-center space-x-4"><span className="text-sm text-slate-600 dark:text-slate-300 font-semibold">Total Opportunity:</span><span className="flex items-center text-sm font-medium text-red-600"><Heart size={16} className="mr-1"/>{formatCurrency(filteredPayoutScope.health)}</span><span className="flex items-center text-sm font-medium text-green-600"><Shield size={16} className="mr-1"/>{formatCurrency(filteredPayoutScope.life)}</span><span className="flex items-center text-sm font-medium text-yellow-700"><Car size={16} className="mr-1"/>{formatCurrency(filteredPayoutScope.motor)}</span><span className="text-lg font-bold text-slate-900 dark:text-white">= {formatCurrency(filteredPayoutScope.total)}</span></div></div></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400"><tr><th scope="col" className="px-6 py-3">Customer Details</th><th scope="col" className="px-6 py-3 text-center">Health</th><th scope="col" className="px-6 py-3 text-center">Life</th><th scope="col" className="px-6 py-3 text-center">Motor</th><th scope="col" className="px-6 py-3 text-center">Actions</th></tr></thead>
                        <tbody>{paginatedCustomers.map((customer: any) => (<tr key={customer.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"><td className="px-6 py-4"><div className="font-semibold text-slate-900 dark:text-white">{customer.name}</div><div className="text-slate-500 dark:text-slate-400">{customer.contact}</div><div className="text-xs text-slate-400 dark:text-slate-500">{customer.city}, {customer.area}</div></td><td className="px-6 py-4 text-center"><PayoutScopeIndicator policy={customer.policies.health}/></td><td className="px-6 py-4 text-center"><PayoutScopeIndicator policy={customer.policies.life}/></td><td className="px-6 py-4 text-center"><PayoutScopeIndicator policy={customer.policies.motor}/></td><td className="px-6 py-4"><div className="flex items-center justify-center space-x-3"><a href={`tel:${customer.contact}`} className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50"><Phone size={18}/></a><a href={`https://wa.me/${customer.contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-green-600 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50"><MessageSquare size={18}/></a><button onClick={() => onSelectCustomer(customer)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">View</button></div></td></tr>))}</tbody>
                    </table>
                </div>
                 <Pagination totalItems={filteredCustomers.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
            </Card>
        </div>
    </>
    );
};

const CustomerProfile = ({ onNavigateBack, customer }: {onNavigateBack: () => void, customer: any}) => {
    if (!customer) return null;
    const {name, contact, email, alternateContact, dob, occupation, leadSource, vehicleCount, policies, activityLog, familyMembers} = customer;
    
    const ProductCard = ({ type, data }: {type: string, data: any}) => {
        const icons: {[key: string]: React.ReactNode} = { health: <Heart className="text-red-500"/>, life: <ShieldCheck className="text-green-500"/>, motor: <CarFront className="text-yellow-500"/> };
        const titles: {[key: string]: string} = { health: "Health Insurance", life: "Life Insurance", motor: "Motor Insurance" };
        const ScopeIndicator = ({ status, isDeclined }: {status: string, isDeclined: boolean}) => { if(isDeclined) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">Declined</span>; const styles: {[key: string]: string} = { Active: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300', Opportunity: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300', OutOfScope: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' }; const text: {[key: string]: string} = { Active: 'Active', Opportunity: 'Opportunity', OutOfScope: 'No Scope' }; return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>; };

        return (
        <Card className="flex flex-col">
            <CardHeader><div className="flex items-center space-x-3">{icons[type]}<span>{titles[type]}</span></div><ScopeIndicator status={data.status} isDeclined={data.isDeclined}/></CardHeader>
            <CardContent className="flex-grow space-y-4">
                {data.status === 'Active' && (
                    type === 'motor' ? (data.vehicles || []).map((v: any) => (<div key={v.id} className="text-sm border-t border-slate-200 dark:border-slate-700 pt-3 first:border-t-0 first:pt-0 space-y-1"><p><strong>Reg No:</strong> {v.regNo}</p><p><strong>Policy:</strong> {v.policyNumber}</p><p><strong>Vehicle:</strong> {v.mmv} ({v.fuelType})</p><p><strong>IDV:</strong> {formatCurrency(v.idv)}</p><p><strong>Premium:</strong> {formatCurrency(v.premium)}</p><p><strong>NCB:</strong> {v.ncb}</p><p><strong>Insurer:</strong> {v.insurer}</p><p className="font-semibold text-red-600 dark:text-red-400 mt-1">Expiry Date: {v.expiryDate}</p></div>)) :
                    type === 'life' ? (data.policies || []).map((p: any) => (<div key={p.id} className="text-sm border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1"><p><strong>Insured:</strong> {p.insuredName}</p><p><strong>Plan:</strong> {p.plan} ({p.planType})</p><p><strong>Sum Insured:</strong> {formatCurrency(p.sumInsured)}</p><p><strong>Insurer:</strong> {p.insurer}</p><p className="font-semibold text-red-600 dark:text-red-400 mt-1">Renewal: {data.renewalDate}</p></div>)) :
                    (data.policies || []).map((p: any) => (<div key={p.id} className="text-sm border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1"><p><strong>Plan:</strong> {p.plan}</p><p><strong>Sum Insured:</strong> {formatCurrency(p.sumInsured)}</p><p><strong>Premium:</strong> {formatCurrency(p.premium)}</p><p><strong>Insurer:</strong> {p.insurer}</p><p className="font-semibold text-red-600 dark:text-red-400 mt-1">Renewal: {p.renewalDate}</p></div>))
                )}
                {data.status === 'Opportunity' && !data.isDeclined && (<><div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md"><p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{data.reason}</p><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-blue-700 dark:text-blue-300">Suggested SI</p><p className="font-bold text-lg text-blue-900 dark:text-blue-100">{formatCurrency(data.leadDetails?.suggestedSumInsured || 0)}</p></div><div><p className="text-xs text-green-700 dark:text-green-300">Potential Payout</p><p className="font-bold text-lg text-green-900 dark:text-green-100">{formatCurrency(data.potentialPayout || 0)}</p></div></div><p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Suggested: {data.leadDetails?.suggestedPlan} ({data.leadDetails?.suggestedInsurer})</p>{data.followUpDate && <div className="text-sm font-semibold flex items-center text-yellow-800 dark:text-yellow-300 mt-3 pt-3 border-t border-blue-200 dark:border-blue-700"><Calendar size={14} className="mr-2"/> Follow-up due: {data.followUpDate}</div>}</div><div className="flex space-x-2 mt-4"><button className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center space-x-2"><Calendar size={16}/><span>Schedule Follow-up</span></button>{data.cjLink && <a href={data.cjLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center justify-center space-x-2"><LinkIcon size={16}/><span>View Last Quote</span></a>}</div></>)}
                {data.isDeclined && (<div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-4 rounded-md h-full"><p><strong>Reason:</strong> {data.declineReason}</p></div>)}
                {data.status === 'OutOfScope' && (<div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-4 rounded-md h-full"><p><strong>Reason:</strong> {data.reason}</p></div>)}
            </CardContent>
            {data.status === 'Opportunity' && !data.isDeclined && (<div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700"><button className="w-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-800/30 transition">Mark as Declined</button></div>)}
        </Card>
        );
    };

    return (
    <div>
        <header className="flex items-center mb-6"><button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 mr-2"><ChevronLeft size={24} className="text-slate-600 dark:text-slate-300"/></button><h1 className="text-3xl font-bold text-slate-800 dark:text-white">Customer Profile</h1></header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardContent>
                        <div className="flex justify-between items-start"><div><h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{name}</h2><p className="font-semibold text-slate-500 dark:text-slate-400">{occupation}</p></div><div className="flex items-center space-x-2"><a href={`tel:${contact}`} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"><Phone size={20}/></a><a href={`https://wa.me/${contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 text-white bg-green-500 hover:bg-green-600 rounded-full shadow-sm"><MessageSquare size={20}/></a></div></div>
                        <div className="space-y-4 text-slate-600 dark:text-slate-300 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-start"><Mail size={16} className="mr-3 mt-1 text-slate-400"/><div className="text-sm"><div className="font-semibold text-slate-800 dark:text-slate-100">Email</div><div>{email}</div></div></div>
                            <div className="flex items-start"><Phone size={16} className="mr-3 mt-1 text-slate-400"/><div className="text-sm"><div className="font-semibold text-slate-800 dark:text-slate-100">Alternate Contact</div><div>{alternateContact || 'N/A'}</div></div></div>
                            <div className="flex items-start"><Cake size={16} className="mr-3 mt-1 text-slate-400"/><div className="text-sm"><div className="font-semibold text-slate-800 dark:text-slate-100">DOB</div><div>{dob}</div></div></div>
                            <div className="flex items-start"><GitBranch size={16} className="mr-3 mt-1 text-slate-400"/><div className="text-sm"><div className="font-semibold text-slate-800 dark:text-slate-100">Lead Source</div><div>{leadSource}</div></div></div>
                            <div className="flex items-start"><Car size={16} className="mr-3 mt-1 text-slate-400"/><div className="text-sm"><div className="font-semibold text-slate-800 dark:text-slate-100">Vehicles Owned</div><div>{vehicleCount}</div></div></div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader action={<button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"><PlusCircle size={20}/></button>}><Users2 size={20} className="mr-2"/>Family Members</CardHeader>
                    <CardContent><div className="space-y-3">{familyMembers.length > 0 ? familyMembers.map((m: any) => (<div key={m.id} className="flex justify-between items-center text-sm"><p className="font-semibold text-slate-700 dark:text-slate-200">{m.name} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({m.relationship})</span></p><p className="text-slate-500 dark:text-slate-400">{m.dob} (Age: {m.age})</p></div>)) : <p className="text-sm text-slate-500 dark:text-slate-400">No family members added.</p>}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader><History size={20} className="mr-2"/>Activity Log</CardHeader>
                    <CardContent><div className="space-y-4 max-h-60 overflow-y-auto pr-2">{activityLog.length > 0 ? activityLog.map((log: any) => (<div key={log.id} className="text-sm relative pl-6 before:absolute before:left-2 before:top-2 before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full before:border-2 before:border-white"><p className="font-semibold text-slate-700 dark:text-slate-200">{log.activity} - <span className="text-indigo-600 dark:text-indigo-400">{log.product}</span></p><p className="text-slate-500 dark:text-slate-400">{log.remarks}</p><p className="text-xs text-slate-400">{log.date}</p></div>)) : <p className="text-sm text-slate-500 dark:text-slate-400">No activities logged yet.</p>}</div></CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <ProductCard type="health" data={policies.health} />
                <ProductCard type="life" data={policies.life} />
                <ProductCard type="motor" data={policies.motor} />
            </div>
        </div>
    </div>
    );
};

// Fix: Add placeholder components for modules that are not yet implemented.
const PlaceholderModule = ({ title }: { title: string }) => (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">This module is under construction. Please check back later.</p>
    </div>
);

const PartnerProfileModule = ({ partner }: { partner: any }) => <PlaceholderModule title="Partner Profile" />;
const ClaimManagement = ({ partner }: { partner: any }) => <PlaceholderModule title="Claim Management" />;
const PolicyManagement = ({ partner }: { partner: any }) => <PlaceholderModule title="Policy Management" />;
const PaymentManagementModule = ({ partner }: { partner: any }) => <PlaceholderModule title="Payment Management" />;
const TechnicalIssues = ({ partner }: { partner: any }) => <PlaceholderModule title="Technical Issues" />;
const EndorsementManagement = ({ partner }: { partner: any }) => <PlaceholderModule title="Endorsement Management" />;
const PreSalesManagement = ({ partner }: { partner: any }) => <PlaceholderModule title="Pre-Sales Management" />;
const RenewalManagement = ({ partner }: { partner: any }) => <PlaceholderModule title="Renewal Management" />;
const LoyaltyManagement = ({ partner }: { partner: any }) => <PlaceholderModule title="Loyalty Management" />;


// Fix: Define the Header component
const Header = ({ partner, activeModule, setActiveModule }: { partner: any, activeModule: string, setActiveModule: (module: string) => void }) => {
  const navItems = [
    { id: 'customerBook', name: 'Customer Book', icon: BookUser },
    { id: 'partner', name: 'Partner Profile', icon: UserCog },
    { id: 'policies', name: 'Policies', icon: FileSignature },
    { id: 'claims', name: 'Claims', icon: Stethoscope },
    { id: 'payment', name: 'Payments', icon: Banknote },
    { id: 'renewals', name: 'Renewals', icon: Repeat },
    { id: 'endorsements', name: 'Endorsements', icon: Pencil },
    { id: 'presales', name: 'Pre-Sales', icon: TrendingUp },
    { id: 'loyalty', name: 'Loyalty', icon: Trophy },
    { id: 'technical', name: 'Tech Issues', icon: Wrench },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{partner.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{partner.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <Bell size={20} className="text-slate-500 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
            </button>
            <img src={mockAgentData.photoUrl} alt="Agent" className="h-9 w-9 rounded-full" />
          </div>
        </div>
        <nav className="flex space-x-4 overflow-x-auto -mb-px h-12">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeModule === item.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              <item.icon size={16} className="mr-2" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
// Fix: Cannot redeclare block-scoped variable 'CustomerBookModule'.
const CustomerBookModule = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [currentView, setCurrentView] = useState('book');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCurrentView('profile');
  };

  const handleNavigateBack = () => {
    setSelectedCustomer(null);
    setCurrentView('book');
  };

  const handleAddCustomer = (newCustomer: any) => {
    setCustomers(prevCustomers => [newCustomer, ...prevCustomers]);
  };
  
  const handleUpdateCustomer = (updatedCustomer: any) => {
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };


  return (
    <div>
      {currentView === 'book' && <CustomerBookPage customers={customers} onSelectCustomer={handleSelectCustomer} onAddCustomer={handleAddCustomer} />}
      {currentView === 'profile' && <CustomerProfile customer={selectedCustomer} onNavigateBack={handleNavigateBack} />}
    </div>
  );
};

const App = () => {
  const [activeModule, setActiveModule] = useState('customerBook');
  const [partner, setPartner] = useState(partnerData);

  const renderModule = () => {
    switch (activeModule) {
      case 'customerBook': return <CustomerBookModule />;
      case 'partner': return <PartnerProfileModule partner={partner} />;
      case 'claims': return <ClaimManagement partner={partner} />;
      case 'policies': return <PolicyManagement partner={partner} />;
      case 'payment': return <PaymentManagementModule partner={partner} />;
      case 'technical': return <TechnicalIssues partner={partner} />;
      case 'endorsements': return <EndorsementManagement partner={partner} />;
      case 'presales': return <PreSalesManagement partner={partner} />;
      case 'renewals': return <RenewalManagement partner={partner} />;
      case 'loyalty': return <LoyaltyManagement partner={partner} />;
      default: return <CustomerBookModule />;
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-900 min-h-screen font-sans">
      <Header partner={partner} activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {renderModule()}
      </main>
    </div>
  );
}

// Rename and export as default for the main application router
const Partner360 = App;
export default Partner360;