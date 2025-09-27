// This component depends on the 'lucide-react' library for icons.
// Make sure to install it in your project: npm install lucide-react
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, Users, Heart, Shield, Car, Bell, Calendar, Phone, MapPin, DollarSign, BookUser, UserPlus, X, Check, Target, Link as LinkIcon, Mail, Cake, Briefcase, GitBranch, MessageSquare, History, PlusCircle, Users2, CarFront, ShieldCheck, IdCard, Share2, Download, Building, Edit, Save, Trash2, Ban, ChevronRight } from 'lucide-react';

// --- MOCK DATA ---
const initialMockCustomers = [
  { id: 1, name: 'Rohan Sharma', contact: '+91 98765 43210', alternateContact: '+91 98765 11111', email: 'rohan.s@example.com', city: 'Mumbai', area: 'Andheri', fullAddress: '12B, Skyline Apartments, Andheri West', dob: '1988-05-15', maritalStatus: 'Married', occupation: 'Software Engineer', leadSource: 'Referral by Ankit Kumar', vehicles: [{ id: 'V1', regNo: 'MH02AB1234', make: 'Honda', model: 'City', variant: 'VX', regYear: '2022', fuelType: 'Petrol' }], familyMembers: [{ id: 101, name: 'Priya Sharma', relationship: 'Spouse', dob: '1990-03-22' }, { id: 102, name: 'Aarav Sharma', relationship: 'Son', dob: '2018-09-10' }], activityLog: [{ id: 101, date: '2025-09-18', product: 'Health', activity: 'Quote Sent', remarks: 'Sent quote for Family Floater Plan A. CJ Link: xyz123'}, { id: 102, date: '2025-09-16', product: 'General', activity: 'Initial Call', remarks: 'Discussed needs, client is interested in health.'}], policies: { health: { status: 'Opportunity', reason: 'Family health cover needed.', tentativePremium: 18000, potentialPayout: 2700, followUpDate: '2025-09-25', isDeclined: false, leadDetails: { suggestedInsurer: 'HDFC Ergo', suggestedPlan: 'Optima Restore', suggestedSumInsured: 1000000 }, cjLink: 'https://example.com/quote/health/xyz123' }, life: { status: 'Active', renewalDate: '2026-07-20', premium: 63000, policies: [{ id: 'L1', insurer: 'LIC', plan: 'Jeevan Anand', planType: 'Endowment', sumInsured: 5000000, insuredName: 'Rohan Sharma' }] }, motor: { status: 'Active', vehicles: [{ id: 'V1', regNo: 'MH02AB1234', mmv: 'Honda City VX', premium: 22000, idv: 850000, expiryDate: '2026-03-15', insurer: 'Bajaj Allianz', policyType: 'Comprehensive', ncb: 20 }] } } },
  { id: 2, name: 'Priya Verma', contact: '+91 87654 32109', alternateContact: null, email: 'priya.v@example.com', city: 'Delhi', area: 'Saket', fullAddress: 'A-45, First Floor, Saket', dob: '1992-11-20', maritalStatus: 'Single', occupation: 'Graphic Designer', leadSource: 'Website Inquiry', vehicles: [], familyMembers: [], activityLog: [ { id: 201, date: '2025-09-19', product: 'Life', activity: 'Follow-up Scheduled', remarks: 'Set reminder for Oct 5th.'} ], policies: { health: { status: 'Active', policies: [{ id: 'H2', insurer: 'Star Health', plan: 'Young Star', sumInsured: 500000, premium: 25000, renewalDate: '2026-01-30' }] }, life: { status: 'Opportunity', reason: 'Underinsured, needs a term plan.', tentativePremium: 15000, potentialPayout: 2250, followUpDate: '2025-10-05', isDeclined: false, leadDetails: { suggestedInsurer: 'Max Life', suggestedPlan: 'Smart Secure Plus', suggestedSumInsured: 10000000 }, cjLink: null }, motor: { status: 'OutOfScope', reason: 'Does not own a vehicle.' } } },
  { id: 3, name: 'Amit Patel', contact: '+91 76543 21098', alternateContact: null, email: 'a.patel@example.com', city: 'Ahmedabad', area: 'Navrangpura', fullAddress: '7, Ashirwad Bunglows, Navrangpura', dob: '1984-02-10', maritalStatus: 'Married', occupation: 'Business Owner', leadSource: 'Walk-in', vehicles: [{ id: 'V3A', regNo: 'GJ01CD5678', make: 'Toyota', model: 'Fortuner', variant: '4x2 AT', regYear: '2023', fuelType: 'Diesel' }, { id: 'V3B', regNo: 'GJ01EF9012', make: 'Maruti', model: 'Swift', variant: 'VXI', regYear: '2021', fuelType: 'Petrol' }], familyMembers: [{ id: 301, name: 'Mina Patel', relationship: 'Spouse', dob: '1986-04-15' }], activityLog: [ { id: 301, date: '2025-09-12', product: 'Health', activity: 'Marked Declined', remarks: 'Client has sufficient corporate coverage for now.'} ], policies: { health: { status: 'Opportunity', reason: 'Top-up plan for parents.', isDeclined: true, declineReason: 'Has corporate health cover.' }, life: { status: 'Opportunity', reason: 'Approaching 40, retirement plan.', tentativePremium: 50000, potentialPayout: 7500, followUpDate: null, isDeclined: false, leadDetails: { suggestedInsurer: 'ICICI Prudential', suggestedPlan: 'Signature Elite', suggestedSumInsured: 20000000 }, cjLink: 'https://example.com/quote/life/abc456' }, motor: { status: 'Active', vehicles: [ { id: 'V3A', regNo: 'GJ01CD5678', mmv: 'Toyota Fortuner', premium: 45000, idv: 3200000, expiryDate: '2025-09-28', insurer: 'HDFC Ergo', policyType: 'Comprehensive', ncb: 0 }, { id: 'V3B', regNo: 'GJ01EF9012', mmv: 'Maruti Swift', premium: 12000, idv: 550000, expiryDate: '2026-05-10', insurer: 'Go Digit', policyType: 'Comprehensive', ncb: 25 }] } } },
  { id: 4, name: 'Vikram Singh', contact: '+91 65432 10987', alternateContact: '', email: 'vikram.s@example.com', city: 'Jaipur', area: 'Malviya Nagar', fullAddress: 'Plot 42, Gaurav Nagar, Malviya Nagar', dob: '1975-01-20', maritalStatus: 'Married', occupation: 'Hotel Manager', leadSource: 'Cold Call', vehicles: [{ id: 'V4A', regNo: 'RJ14TE1234', make: 'Hyundai', model: 'Creta', variant: 'SX', regYear: '2024', fuelType: 'Diesel' }], familyMembers: [{ id: 401, name: 'Sunita Singh', relationship: 'Spouse', dob: '1978-06-12' }], activityLog: [{ id: 401, date: '2025-09-19', product: 'General', activity: 'Initial Call', remarks: 'Client needs car insurance and is open to a term plan.'}], policies: { health: { status: 'OutOfScope', reason: 'Has comprehensive employer-provided health insurance.' }, life: { status: 'Opportunity', reason: 'Primary earner, needs term plan for family security.', tentativePremium: 35000, potentialPayout: 5250, followUpDate: '2025-10-01', isDeclined: false, leadDetails: { suggestedInsurer: 'HDFC Life', suggestedPlan: 'Click 2 Protect Super', suggestedSumInsured: 15000000 }, cjLink: null }, motor: { status: 'Opportunity', reason: 'New car purchase, insurance needed.', tentativePremium: 28000, potentialPayout: 4200, followUpDate: '2025-09-29', isDeclined: false, leadDetails: { suggestedInsurer: 'ICICI Lombard', suggestedPlan: 'Comprehensive Car Insurance', suggestedSumInsured: 1200000, regNo: 'RJ14TE1234', policyType: 'Comprehensive', ncb: 0 }, vehicles: [] } } },
  { id: 5, name: 'Ananya Iyer', contact: '+91 99887 76655', email: 'ananya.iyer@example.com', city: 'Bangalore', area: 'Koramangala', dob: '1995-08-25', occupation: 'UI/UX Designer', leadSource: 'LinkedIn', vehicles: [{ id: 'V5A', regNo: 'KA01XY5678', make: 'Kia', model: 'Seltos', variant: 'HTX', regYear: '2023', fuelType: 'Petrol' }], policies: { health: { status: 'Active', policies: [{ id: 'H5', insurer: 'Care Health', plan: 'Care Supreme', sumInsured: 1000000, premium: 12000, renewalDate: '2026-02-15' }] }, life: { status: 'OutOfScope', reason: 'Not interested currently.' }, motor: { status: 'Active', vehicles: [{id: 'V5A', regNo: 'KA01XY5678', mmv: 'Kia Seltos HTX', premium: 18000, idv: 1100000, expiryDate: '2026-06-20', insurer: 'Acko', policyType: 'Comprehensive', ncb: 0}] } } },
  { id: 6, name: 'Siddharth Roy', contact: '+91 88776 65544', email: 'sid.roy@example.com', city: 'Kolkata', area: 'Salt Lake', dob: '1980-12-01', occupation: 'Architect', leadSource: 'Referral', vehicles: [], policies: { health: { status: 'Opportunity', reason: 'Wants to port from existing insurer.', tentativePremium: 32000, potentialPayout: 4800, followUpDate: '2025-10-10', isDeclined: false, leadDetails: { suggestedInsurer: 'Niva Bupa', suggestedPlan: 'ReAssure 2.0', suggestedSumInsured: 1500000 } }, life: { status: 'Opportunity', reason: 'Child future planning.', tentativePremium: 100000, potentialPayout: 15000, followUpDate: '2025-10-10', isDeclined: false, leadDetails: { suggestedInsurer: 'Tata AIA', suggestedPlan: 'Fortune Guarantee Plus', suggestedSumInsured: 5000000 } }, motor: { status: 'OutOfScope', reason: 'Does not own a vehicle.' } } },
  { id: 7, name: 'Meera Deshpande', contact: '+91 77665 54433', email: 'meera.d@example.com', city: 'Pune', area: 'Viman Nagar', dob: '1990-04-18', occupation: 'Marketing Manager', leadSource: 'Website Inquiry', vehicles: [{ id: 'V7A', regNo: 'MH12AB9876', make: 'Volkswagen', model: 'Polo', variant: 'Highline', regYear: '2019', fuelType: 'Petrol' }], policies: { health: { status: 'Active', policies: [{ id: 'H7', insurer: 'Aditya Birla', plan: 'Activ Health Platinum', sumInsured: 700000, premium: 9500, renewalDate: '2025-10-05' }] }, life: { status: 'Active', policies: [{ id: 'L7', insurer: 'Bajaj Allianz', plan: 'eTouch', sumInsured: 10000000, premium: 14000, renewalDate: '2026-08-01' }] }, motor: { status: 'Active', vehicles: [{id: 'V7A', regNo: 'MH12AB9876', mmv: 'Volkswagen Polo', premium: 9800, idv: 600000, expiryDate: '2025-09-22', insurer: 'ICICI Lombard', policyType: 'Third Party', ncb: 35 }] } } },
  { id: 8, name: 'Karan Malhotra', contact: '+91 91234 50987', email: 'karan.m@example.com', city: 'Delhi', area: 'Dwarka', dob: '1985-06-30', occupation: 'Pilot', leadSource: 'Walk-in', vehicles: [{ id: 'V8A', regNo: 'DL3CAB1122', make: 'Jeep', model: 'Compass', variant: 'Limited', regYear: '2021', fuelType: 'Diesel' }], policies: { health: { status: 'Opportunity', reason: 'Requires critical illness rider.', tentativePremium: 25000, potentialPayout: 3750, followUpDate: '2025-11-01', isDeclined: false, leadDetails: { suggestedInsurer: 'Star Health', suggestedPlan: 'Comprehensive', suggestedSumInsured: 2000000 } }, life: { status: 'OutOfScope', reason: 'Already has sufficient cover.' }, motor: { status: 'Opportunity', reason: 'Renewal due next month.', tentativePremium: 25000, potentialPayout: 3750, followUpDate: '2025-10-15', isDeclined: false, leadDetails: { suggestedInsurer: 'Go Digit', suggestedPlan: 'Comprehensive', suggestedSumInsured: 1500000, policyType: 'Comprehensive', ncb: 20 } } } },
  { id: 9, name: 'Natasha Singh', contact: '+91 82345 61098', email: 'natasha.s@example.com', city: 'Mumbai', area: 'Bandra', dob: '1998-02-14', occupation: 'Student', leadSource: 'Social Media', vehicles: [], policies: { health: { status: 'Opportunity', reason: 'First time health insurance buyer.', tentativePremium: 8000, potentialPayout: 1200, followUpDate: '2025-09-26', isDeclined: false, leadDetails: { suggestedInsurer: 'Acko', suggestedPlan: 'Standard Health Plan', suggestedSumInsured: 500000 } }, life: { status: 'OutOfScope', reason: 'Not earning yet.' }, motor: { status: 'OutOfScope', reason: 'N/A' } } },
  { id: 10, name: 'Rajiv Menon', contact: '+91 73456 72109', email: 'rajiv.menon@example.com', city: 'Chennai', area: 'Adyar', dob: '1978-09-09', occupation: 'Professor', leadSource: 'Referral', vehicles: [{ id: 'V10A', regNo: 'TN07XY3456', make: 'Skoda', model: 'Octavia', variant: 'Style', regYear: '2022', fuelType: 'Petrol' }], policies: { health: { status: 'Active', policies: [{ id: 'H10', insurer: 'United India', plan: 'Family Medicare', sumInsured: 500000, premium: 28000, renewalDate: '2026-03-01' }] }, life: { status: 'Opportunity', reason: 'Looking for pension plan.', tentativePremium: 150000, potentialPayout: 22500, followUpDate: null, isDeclined: true, declineReason: 'Decided to invest in mutual funds instead.' }, motor: { status: 'Active', vehicles: [{ id: 'V10A', regNo: 'TN07XY3456', mmv: 'Skoda Octavia Style', premium: 24000, idv: 1800000, expiryDate: '2026-01-25', insurer: 'Royal Sundaram', policyType: 'Comprehensive', ncb: 20 }] } } },
  { id: 11, name: 'Fatima Khan', contact: '+91 94567 83210', email: 'fatima.k@example.com', city: 'Hyderabad', area: 'Banjara Hills', dob: '1989-07-22', occupation: 'Doctor', leadSource: 'Cold Call', vehicles: [], policies: { health: { status: 'Opportunity', reason: 'Wants maternity cover.', tentativePremium: 45000, potentialPayout: 6750, followUpDate: '2025-10-08', isDeclined: false, leadDetails: { suggestedInsurer: 'Niva Bupa', suggestedPlan: 'Health Premia', suggestedSumInsured: 1000000 } }, life: { status: 'Active', policies: [{ id: 'L11', insurer: 'HDFC Life', plan: 'Sanchay Plus', sumInsured: 2500000, premium: 250000, renewalDate: '2026-09-15' }] }, motor: { status: 'OutOfScope', reason: 'N/A' } } },
  { id: 12, name: 'Suresh Gupta', contact: '+91 85678 94321', email: 'suresh.g@example.com', city: 'Ahmedabad', area: 'Satellite', dob: '1965-03-12', occupation: 'Trader', leadSource: 'Walk-in', vehicles: [], policies: { health: { status: 'Opportunity', reason: 'Senior citizen plan for self and spouse.', tentativePremium: 65000, potentialPayout: 9750, followUpDate: '2025-10-02', isDeclined: false, leadDetails: { suggestedInsurer: 'Star Health', suggestedPlan: 'Red Carpet', suggestedSumInsured: 1000000 } }, life: { status: 'OutOfScope', reason: 'Age barred for term plans.' }, motor: { status: 'OutOfScope', reason: 'N/A' } } },
];
const mockAgentData = { name: 'Rajesh Kumar', title: 'Certified Insurance Advisor', phone: '+919876512345', email: 'rajesh.k@insuranceadvisor.com', photoUrl: 'https://i.pravatar.cc/150?u=rajeshkumar' };
const mockPhoneContacts = [ { id: 'p1', name: 'Aarav Gupta', phone: '+91 91234 56780' }, { id: 'p2', name: 'Isha Reddy', phone: '+91 91234 56781' }, { id: 'p3', name: 'Kabir Khan', phone: '+91 91234 56782' }];
const ITEMS_PER_PAGE = 8;

// --- HELPER COMPONENTS --- //
const formatCurrency = (value?: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits:0 }).format(value || 0);
const EditableField = ({ value, onChange, isEditing, placeholder, type='text', className, label, name }: {value: string | null, onChange: React.ChangeEventHandler<HTMLInputElement>, isEditing: boolean, placeholder?: string, type?: string, className?: string, label?: string, name?: string}) => {
    if (isEditing) {
        return <div className="flex flex-col"><label className="text-xs text-gray-500 mb-1">{label}</label><input name={name} type={type} value={value || ''} onChange={onChange} placeholder={placeholder} className={`p-1.5 border rounded-md text-sm bg-white ${className || ''}`} /></div>;
    }
    return <div className="text-sm"><div>{value || <span className="text-gray-400">N/A</span>}</div></div>;
};

// --- MODAL COMPONENTS --- //
const AddCustomerModal = ({ isOpen, onClose, onAddCustomer }: {isOpen: boolean, onClose: () => void, onAddCustomer: (customer: any) => void}) => {
    const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', email: '', city: '', area: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = () => {
        if (!newCustomer.name || !newCustomer.contact) {
            alert('Name and Contact are required.'); return;
        }
        onAddCustomer({
            ...newCustomer,
            id: Date.now(),
            dob: '', occupation: '', leadSource: 'Manual Entry', vehicles: [],
            policies: {
                health: { status: 'Opportunity', reason: '', isDeclined: false, leadDetails: { suggestedSumInsured: 500000 } },
                life: { status: 'Opportunity', reason: '', isDeclined: false, leadDetails: { suggestedSumInsured: 10000000 } },
                motor: { status: 'Opportunity', reason: '', isDeclined: false, leadDetails: { suggestedSumInsured: 700000 } }
            },
            familyMembers: [], activityLog: [{id: Date.now(), date: new Date().toISOString().split('T')[0], product: 'General', activity: 'Profile Created', remarks: 'Manually added to CRM.'}]
        });
        setNewCustomer({ name: '', contact: '', email: '', city: '', area: '' });
        onClose();
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-bold text-gray-800">Add New Customer</h3><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20}/></button></div>
                <div className="p-6 space-y-4">
                    <input type="text" name="name" value={newCustomer.name} onChange={handleChange} placeholder="Full Name*" className="w-full p-2 border rounded-lg" />
                    <input type="text" name="contact" value={newCustomer.contact} onChange={handleChange} placeholder="Contact Number*" className="w-full p-2 border rounded-lg" />
                    <input type="email" name="email" value={newCustomer.email} onChange={handleChange} placeholder="Email Address" className="w-full p-2 border rounded-lg" />
                    <div className="flex space-x-4">
                        <input type="text" name="city" value={newCustomer.city} onChange={handleChange} placeholder="City" className="w-1/2 p-2 border rounded-lg" />
                        <input type="text" name="area" value={newCustomer.area} onChange={handleChange} placeholder="Area" className="w-1/2 p-2 border rounded-lg" />
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end"><button onClick={handleSubmit} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition">Save Customer</button></div>
            </div>
        </div>
    );
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-bold text-gray-800">Invite New Customers</h3><button onClick={resetAndClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20}/></button></div>
                <div className="p-6">
                    {step === 1 && (<div className="text-center"><p className="text-gray-600 mb-4">Grow your customer base by importing contacts and sending them a WhatsApp invitation.</p><button onClick={handleImport} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-transform transform hover:scale-105"><BookUser size={20}/><span>Import from Phone Contacts</span></button></div>)}
                    {step === 2 && (<div><div className="flex justify-between items-center mb-3"><div className="flex items-center"><input type="checkbox" id="selectAll" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={selectedContacts.length > 0 && selectedContacts.length === importedContacts.length} onChange={handleSelectAll}/><label htmlFor="selectAll" className="ml-2 text-sm text-gray-600">Select All</label></div><p className="text-sm font-medium">{selectedContacts.length} selected</p></div><div className="max-h-60 overflow-y-auto space-y-2 pr-2">{importedContacts.map(contact => (<div key={contact.id} onClick={() => handleSelectContact(contact.id)} className={`flex items-center p-3 rounded-lg cursor-pointer border ${selectedContacts.includes(contact.id) ? 'bg-indigo-50 border-indigo-300' : 'bg-white hover:bg-gray-50'}`}><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={selectedContacts.includes(contact.id)} readOnly/><div className="ml-3"><p className="font-semibold text-gray-800">{contact.name}</p><p className="text-sm text-gray-500">{contact.phone}</p></div></div>))}</div><button onClick={handleSendInvites} disabled={selectedContacts.length === 0} className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"><MessageSquare size={20}/><span>Send WhatsApp Invite ({selectedContacts.length})</span></button></div>)}
                    {step === 3 && (<div className="text-center"><div className="mx-auto bg-green-100 h-16 w-16 rounded-full flex items-center justify-center"><Check className="text-green-600" size={32}/></div><h4 className="text-xl font-bold text-gray-800 mt-4">Invites Sent!</h4><p className="text-gray-600 mt-1">Your message has been queued for {selectedContacts.length} contact(s).</p><button onClick={resetAndClose} className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition">Done</button></div>)}
                </div>
            </div>
        </div>
    );
};
const DigitalVCardModal = ({ isOpen, onClose, agent }: {isOpen: boolean, onClose: () => void, agent: any}) => {
    const [shareText, setShareText] = useState('Share Card');
    useEffect(() => { if (!isOpen) { setTimeout(() => setShareText('Share Card'), 300); } }, [isOpen]);
    const handleShare = () => { const cardUrl = `https://insuranceadvisor.com/advisor/${agent.name.replace(/\s/g, '-')}`; navigator.clipboard.writeText(cardUrl).then(() => { setShareText('Link Copied!'); setTimeout(() => setShareText('Share Card'), 2000); }); };
    if (!isOpen) return null;
    return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"><div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all relative overflow-hidden"><button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 z-20"><X size={20}/></button><div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-600 to-indigo-800 -z-10"></div><div className="absolute top-4 left-4 flex items-center space-x-2"><Building className="text-white/80" size={20}/><span className="font-bold text-white/80 text-lg">InsuranceAdvisor</span></div><div className="pt-20 pb-6 text-center"><img src={agent.photoUrl} alt={agent.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"/><h2 className="text-3xl font-bold text-gray-900">{agent.name}</h2><p className="text-indigo-700 font-semibold text-md">{agent.title}</p></div><div className="px-6 pb-6 text-center"><div className="bg-white p-4 rounded-xl shadow"><p className="text-gray-700 font-medium">Your one-stop solution for <span className="text-blue-600 font-bold">free, expert advice</span> on all insurance products from all major companies.</p></div></div><div className="px-6 pb-6 flex justify-center space-x-6 text-gray-600"><div className="text-center"><Heart className="mx-auto text-red-500 h-8 w-8"/><span className="text-xs font-medium">Health</span></div><div className="text-center"><ShieldCheck className="mx-auto text-green-500 h-8 w-8"/><span className="text-xs font-medium">Life</span></div><div className="text-center"><CarFront className="mx-auto text-yellow-500 h-8 w-8"/><span className="text-xs font-medium">Motor</span></div></div><div className="px-6 pb-6 space-y-3"><a href={`tel:${agent.phone}`} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"><Phone size={20} className="mr-4 text-blue-600"/><div><div className="text-xs text-gray-500">Call Me</div><span className="font-semibold text-gray-800">{agent.phone}</span></div></a><a href={`https://wa.me/${agent.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"><MessageSquare size={20} className="mr-4 text-green-500"/><div><div className="text-xs text-gray-500">WhatsApp</div><span className="font-semibold text-gray-800">Chat for free advice</span></div></a><a href={`mailto:${agent.email}`} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"><Mail size={20} className="mr-4 text-gray-500"/><div><div className="text-xs text-gray-500">Email</div><span className="font-semibold text-gray-800">{agent.email}</span></div></a></div><div className="p-4 bg-gray-200 flex space-x-3"><button onClick={handleShare} className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"><Share2 size={18}/><span>{shareText}</span></button><button className="bg-white text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition shadow-sm"><Download size={18}/><span>Save</span></button></div></div></div> );
};
const Pagination = ({ currentPage, totalPages, onPageChange }: {currentPage: number, totalPages: number, onPageChange: (page: number) => void}) => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for(let i=1; i<= totalPages; i++) { pageNumbers.push(i); }

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
            <div className="-mt-px flex w-0 flex-1">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed">
                    <ChevronLeft className="mr-3 h-5 w-5 text-gray-400" />
                    Previous
                </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => onPageChange(number)} className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${currentPage === number ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {number}
                    </button>
                ))}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed">
                    Next
                    <ChevronRight className="ml-3 h-5 w-5 text-gray-400" />
                </button>
            </div>
        </nav>
    );
};

// --- VIEW COMPONENTS --- //
const CustomerBookPage = ({ customers, onSelectCustomer, onAddCustomer }: {customers: any[], onSelectCustomer: (id: number) => void, onAddCustomer: (customer: any) => void}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [isVCardModalOpen, setVCardModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const PayoutScopeIndicator = ({ policy }: {policy: any}) => {
        if (policy.isDeclined) return <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700`}>Declined</span>;
        const styles: {[key: string]: string} = { Active: 'bg-green-100 text-green-800', OutOfScope: 'bg-gray-100 text-gray-600' };
        const text: {[key: string]: string} = { Active: 'Active', OutOfScope: 'No Scope' }; if (!policy.status) return null;
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[policy.status]}`}>{text[policy.status]}</span>;
    };
    const uniqueCities = useMemo(() => ['all', ...new Set(customers.map(c => c.city))], [customers]);
    const getCustomerTotalPayout = useCallback((customer: any): number => {
        let totalPayout = 0;
        for (const policy of Object.values(customer.policies)) {
            const p = policy as any;
            if (p && p.status === 'Opportunity' && !p.isDeclined) {
                totalPayout += Number(p.potentialPayout) || 0;
            }
        }
        return totalPayout;
    }, []);
    
    const filteredCustomers = useMemo(() => {
        setCurrentPage(1); // Reset to first page on filter change
        const now = new Date('2025-09-20T12:35:00');
        const thirtyDaysFromNow = new Date(now); thirtyDaysFromNow.setDate(now.getDate() + 30);
        const sevenDaysFromNow = new Date(now); sevenDaysFromNow.setDate(now.getDate() + 7);
        let baseFiltered = customers.filter(c => {
            const searchMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.contact.includes(searchTerm);
            const cityMatch = cityFilter === 'all' || c.city === cityFilter;
            let actionMatch = true;
            if (activeFilter === 'renewals') { actionMatch = Object.values(c.policies).some((p: any) => p.status === 'Active' && ( (p.renewalDate && new Date(p.renewalDate) >= now && new Date(p.renewalDate) <= thirtyDaysFromNow) || (p.vehicles && p.vehicles.some((v: any) => new Date(v.expiryDate) >= now && new Date(v.expiryDate) <= thirtyDaysFromNow)))); }
            else if (activeFilter === 'followups') { actionMatch = Object.values(c.policies).some((p: any) => p.followUpDate && new Date(p.followUpDate) >= now && new Date(p.followUpDate) <= sevenDaysFromNow); }
            else if (activeFilter === 'opportunities') { actionMatch = getCustomerTotalPayout(c) > 0; }
            return searchMatch && cityMatch && actionMatch;
        });
        if (activeFilter === 'opportunities') baseFiltered.sort((a, b) => getCustomerTotalPayout(b) - getCustomerTotalPayout(a));
        return baseFiltered;
    }, [customers, searchTerm, activeFilter, cityFilter, getCustomerTotalPayout]);

    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
    const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const filteredPayoutScope = useMemo(() => filteredCustomers.reduce((acc, c) => {
            const p = c.policies;
            if (p.health?.status === 'Opportunity' && !p.health.isDeclined) acc.health += p.health.potentialPayout || 0;
            if (p.life?.status === 'Opportunity' && !p.life.isDeclined) acc.life += p.life.potentialPayout || 0;
            if (p.motor?.status === 'Opportunity' && !p.motor.isDeclined) acc.motor += p.motor.potentialPayout || 0;
            acc.total = acc.health + acc.life + acc.motor;
            return acc;
        }, { health: 0, life: 0, motor: 0, total: 0 }), [filteredCustomers]);

    const opportunitiesCount = useMemo(() => customers.filter(c => getCustomerTotalPayout(c) > 0).length, [customers, getCustomerTotalPayout]);
    const upcomingRenewalsCount = useMemo(() => customers.filter(c => Object.values(c.policies).some((p: any) => p.status === 'Active' && ( (p.renewalDate && new Date(p.renewalDate) <= new Date(new Date().setDate(new Date().getDate() + 30))) || (p.vehicles && p.vehicles.some((v: any) => new Date(v.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30))))))).length, [customers]);
    const followUpsCount = useMemo(() => customers.filter(c => Object.values(c.policies).some((p: any) => p.followUpDate && new Date(p.followUpDate) <= new Date(new Date().setDate(new Date().getDate() + 7)))).length, [customers]);
    
    return (
    <>
        <InviteModal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} />
        <DigitalVCardModal isOpen={isVCardModalOpen} onClose={() => setVCardModalOpen(false)} agent={mockAgentData} />
        <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAddCustomer={onAddCustomer} />
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div><h1 className="text-3xl font-bold text-gray-800">Agent Command Center</h1><p className="text-gray-500">Saturday, 20 September 2025 • Gurugram, Haryana</p></div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2 sm:space-x-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2 p-2"><Users size={20} className="text-blue-600"/><div><p className="text-xs text-gray-500">Customers</p><p className="font-bold text-gray-800">{customers.length}</p></div></div><div className="w-px h-8 bg-gray-200"></div>
                        <div className="text-center"><p className="text-xs font-semibold text-gray-600 mb-1">Opportunities</p><button onClick={() => setActiveFilter(activeFilter === 'opportunities' ? 'all' : 'opportunities')} className={`relative p-2 rounded-full transition-colors ${activeFilter === 'opportunities' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}><Target size={22} className="text-indigo-600"/>{opportunitiesCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">{opportunitiesCount}</span>}</button></div>
                        <div className="text-center"><p className="text-xs font-semibold text-gray-600 mb-1">Renewals Due</p><button onClick={() => setActiveFilter(activeFilter === 'renewals' ? 'all' : 'renewals')} className={`relative p-2 rounded-full transition-colors ${activeFilter === 'renewals' ? 'bg-red-100' : 'hover:bg-gray-100'}`}><Bell size={22} className="text-red-600"/>{upcomingRenewalsCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">{upcomingRenewalsCount}</span>}</button></div>
                        <div className="text-center"><p className="text-xs font-semibold text-gray-600 mb-1">Follow-ups</p><button onClick={() => setActiveFilter(activeFilter === 'followups' ? 'all' : 'followups')} className={`relative p-2 rounded-full transition-colors ${activeFilter === 'followups' ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}><Calendar size={22} className="text-yellow-600"/>{followUpsCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-medium text-white">{followUpsCount}</span>}</button></div>
                    </div>
                </div>
            </header>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="text-xl font-semibold text-gray-800">My Customer Book</h2>
                    <div className="flex space-x-2"><button onClick={() => setAddModalOpen(true)} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition shadow-sm"><PlusCircle size={18}/><span>Add Customer</span></button><button onClick={() => setInviteModalOpen(true)} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition shadow-sm"><UserPlus size={18}/><span>Invite & Promote Business</span></button><button onClick={() => setVCardModalOpen(true)} className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition shadow-sm"><IdCard size={18}/><span>My Card</span></button></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-full md:col-span-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="Search by name or contact..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/></div>
                    <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">{uniqueCities.map(city => <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>)}</select>
                    <button onClick={() => { setActiveFilter('all'); setCityFilter('all'); setSearchTerm(''); }} className="text-sm font-semibold text-indigo-600 hover:underline text-left">Clear Filters</button>
                </div>
                <div className="mb-4 p-3 bg-gray-50 border-t border-b border-gray-200">
                     <div className="flex flex-col sm:flex-row justify-between items-center w-full">
                        <div className="text-sm font-semibold text-gray-800 mb-2 sm:mb-0">Customer Count: <span className="text-indigo-600 font-bold">{filteredCustomers.length}</span></div>
                        <div className="flex items-center space-x-3"><span className="text-sm font-semibold text-gray-800">Total Opportunity:</span><span className="flex items-center text-sm font-medium text-red-600" title="Health Opportunity"><Heart size={16} className="mr-1"/>{formatCurrency(filteredPayoutScope.health)}</span><span className="flex items-center text-sm font-medium text-green-600" title="Life Opportunity"><Shield size={16} className="mr-1"/>{formatCurrency(filteredPayoutScope.life)}</span><span className="flex items-center text-sm font-medium text-yellow-700" title="Motor Opportunity"><Car size={16} className="mr-1"/>{formatCurrency(filteredPayoutScope.motor)}</span><span className="text-lg font-bold text-gray-900">= {formatCurrency(filteredPayoutScope.total)}</span></div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th scope="col" className="px-6 py-3">Customer Details</th><th scope="col" className="px-6 py-3 text-center">Health</th><th scope="col" className="px-6 py-3 text-center">Life</th><th scope="col" className="px-6 py-3 text-center">Motor</th><th scope="col" className="px-6 py-3 text-center">Actions</th></tr></thead>
                        <tbody>{paginatedCustomers.map(customer => (<tr key={customer.id} className="bg-white border-b hover:bg-gray-50"><td className="px-6 py-4"><div className="font-semibold text-gray-900">{customer.name}</div><div className="text-gray-500">{customer.contact}</div><div className="text-xs text-gray-400">{customer.city}</div></td>
                        {[customer.policies.health, customer.policies.life, customer.policies.motor].map((policy, i) => (
                            <td key={i} className="px-6 py-4 text-center">
                                {policy.status === 'Opportunity' && !policy.isDeclined ? (<div><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Opportunity</span><p className="font-bold text-gray-800 text-sm mt-1">{formatCurrency(policy.potentialPayout)}</p></div>) : (<PayoutScopeIndicator policy={policy}/>)}
                            </td>
                        ))}
                        <td className="px-6 py-4"><div className="flex items-center justify-center space-x-3"><a href={`tel:${customer.contact}`} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100"><Phone size={18}/></a><a href={`https://wa.me/${customer.contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-100"><MessageSquare size={18}/></a><button onClick={() => onSelectCustomer(customer.id)} className="font-medium text-indigo-600 hover:text-indigo-800">View</button></div></td></tr>))}</tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    </>
    );
};

const CustomerProfile = ({ onNavigateBack, customer, onUpdateCustomer }: {onNavigateBack: () => void, customer: any, onUpdateCustomer: (customer: any) => void}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(customer);
    const [newActivityRemark, setNewActivityRemark] = useState("");

    useEffect(() => { setEditedCustomer(customer); }, [customer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedCustomer((prev: any) => ({ ...prev, [name]: value }));
    };
    const handleVehicleChange = (index: number, field: string, value: string) => {
        const updatedVehicles = [...editedCustomer.vehicles];
        updatedVehicles[index][field] = value;
        setEditedCustomer((prev: any) => ({...prev, vehicles: updatedVehicles}));
    };
    const handleAddVehicle = () => {
        const newVehicle = { id: `V${Date.now()}`, regNo: '', make: '', model: '', variant: '', regYear: '', fuelType: '' };
        setEditedCustomer((prev: any) => ({...prev, vehicles: [...prev.vehicles, newVehicle]}));
    };
    const handleDeleteVehicle = (idToDelete: string) => {
        setEditedCustomer((prev: any) => ({...prev, vehicles: prev.vehicles.filter((v: any) => v.id !== idToDelete)}));
    };
    const handlePolicyChange = useCallback((policyType: string, updatedData: any) => {
        setEditedCustomer((prev: any) => ({ ...prev, policies: { ...prev.policies, [policyType]: updatedData } }));
    }, []);
    const handleSave = () => { onUpdateCustomer(editedCustomer); setIsEditing(false); };
    const handleCancel = () => { setEditedCustomer(customer); setIsEditing(false); };
    const addActivityLog = () => {
        if (!newActivityRemark.trim()) return;
        const newLog = { id: Date.now(), date: new Date().toISOString().split('T')[0], product: 'General', activity: 'Manual Log', remarks: newActivityRemark };
        setEditedCustomer((prev: any) => ({ ...prev, activityLog: [newLog, ...prev.activityLog]}));
        setNewActivityRemark("");
    };
    const getNextFollowUp = (policies: any) => {
        const today = new Date('2025-09-20');
        const followUpDates = Object.values(policies).filter((p: any) => p.status === 'Opportunity' && !p.isDeclined && p.followUpDate).map((p: any) => new Date(p.followUpDate)).filter(date => date >= today);
        if (followUpDates.length === 0) return null;
        const nextDate = new Date(Math.min.apply(null, followUpDates.map(d => d.getTime())));
        return nextDate.toISOString().split('T')[0];
    };

    if (!customer) return null;
    const {name, contact, email, alternateContact, dob, occupation, leadSource, policies, activityLog, vehicles} = editedCustomer;
    const nextFollowUp = getNextFollowUp(policies);
    
    const ProductCard = ({ type, data, isEditing, onDataChange }: {type: string, data: any, isEditing: boolean, onDataChange: (type: string, data: any) => void}) => {
        const [isEditingFollowUp, setIsEditingFollowUp] = useState(false);
        const icons: {[key: string]: React.ReactNode} = { health: <Heart className="text-red-500"/>, life: <ShieldCheck className="text-green-500"/>, motor: <CarFront className="text-yellow-500"/> };
        const titles: {[key: string]: string} = { health: "Health Insurance", life: "Life Insurance", motor: "Motor Insurance" };
        const ScopeIndicator = ({ status, isDeclined }: {status: string, isDeclined: boolean}) => { if(isDeclined) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Declined</span>; const styles: {[key: string]: string} = { Active: 'bg-green-100 text-green-800', Opportunity: 'bg-blue-100 text-blue-800', OutOfScope: 'bg-gray-100 text-gray-600' }; const text: {[key: string]: string} = { Active: 'Active', Opportunity: 'Opportunity', OutOfScope: 'No Scope' }; return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>; };
        const handleFieldChange = (field: string, value: any) => { onDataChange(type, { ...data, [field]: value }); };
        const handleLeadDetailChange = (field: string, value: any) => { onDataChange(type, { ...data, leadDetails: { ...data.leadDetails, [field]: value } }); };
        
        return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
            <div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-3">{icons[type]}<h3 className="text-lg font-bold text-gray-800">{titles[type]}</h3></div><ScopeIndicator status={data.status} isDeclined={data.isDeclined}/></div>
            <div className="flex-grow space-y-4">
                {data.status === 'Active' && (
                    type === 'motor' ? (data.vehicles || []).map((v: any) => (<div key={v.id} className="text-sm border-t pt-3 space-y-2">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p><strong>Reg No:</strong> {v.regNo}</p>
                            <p><strong>Vehicle:</strong> {v.mmv}</p>
                            <p><strong>Policy:</strong> {v.policyType}</p>
                            <p><strong>NCB:</strong> {v.ncb}%</p>
                            <p><strong>IDV:</strong> {formatCurrency(v.idv)}</p>
                            <p><strong>Premium:</strong> {formatCurrency(v.premium)}</p>
                        </div>
                        <p><strong>Insurer:</strong> {v.insurer}</p>
                        <p className="font-semibold text-red-600 mt-1">Expiry: {v.expiryDate}</p>
                    </div>)) :
                    type === 'life' ? (data.policies || []).map((p: any) => (<div key={p.id} className="text-sm border-t pt-3 space-y-1"><p><strong>Insured:</strong> {p.insuredName}</p><p><strong>Plan:</strong> {p.plan} ({p.planType})</p><p><strong>Sum Insured:</strong> {formatCurrency(p.sumInsured)}</p><p><strong>Insurer:</strong> {p.insurer}</p><p className="font-semibold text-red-600 mt-1">Renewal: {data.renewalDate}</p></div>)) :
                    (data.policies || []).map((p: any) => (<div key={p.id} className="text-sm border-t pt-3 space-y-1"><p><strong>Plan:</strong> {p.plan}</p><p><strong>Sum Insured:</strong> {formatCurrency(p.sumInsured)}</p><p><strong>Premium:</strong> {formatCurrency(p.premium)}</p><p><strong>Insurer:</strong> {p.insurer}</p><p className="font-semibold text-red-600 mt-1">Renewal: {p.renewalDate}</p></div>))
                )}
                {data.status === 'Opportunity' && !data.isDeclined && ( isEditing ? (
                    <div className="space-y-3"><textarea value={data.reason} onChange={e => handleFieldChange('reason', e.target.value)} placeholder="Opportunity Reason" className="w-full text-sm p-2 border rounded-md" rows={2}/>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="number" value={data.leadDetails.suggestedSumInsured} onChange={e => handleLeadDetailChange('suggestedSumInsured', e.target.value)} placeholder="Suggested SI" className="w-full text-sm p-2 border rounded-md"/>
                            <input type="number" value={data.potentialPayout} onChange={e => handleFieldChange('potentialPayout', e.target.value)} placeholder="Payout" className="w-full text-sm p-2 border rounded-md"/>
                             {type === 'motor' && <>
                                <input type="text" value={data.leadDetails.policyType || ''} onChange={e => handleLeadDetailChange('policyType', e.target.value)} placeholder="Policy Type (e.g., Comp)" className="w-full text-sm p-2 border rounded-md"/>
                                <input type="number" value={data.leadDetails.ncb || ''} onChange={e => handleLeadDetailChange('ncb', e.target.value)} placeholder="NCB %" className="w-full text-sm p-2 border rounded-md"/>
                            </>}
                        </div>
                        <input type="text" value={data.leadDetails.suggestedPlan} onChange={e => handleLeadDetailChange('suggestedPlan', e.target.value)} placeholder="Suggested Plan" className="w-full text-sm p-2 border rounded-md"/>
                        <input type="date" value={data.followUpDate || ''} onChange={e => handleFieldChange('followUpDate', e.target.value)} className="w-full text-sm p-2 border rounded-md"/>
                    </div>
                    ) : ( <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                        <p className="font-semibold text-blue-800 mb-2">{data.reason || 'No reason specified.'}</p>
                        <div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-blue-700">Suggested SI</p><p className="font-bold text-lg text-blue-900">{formatCurrency(data.leadDetails.suggestedSumInsured)}</p></div><div><p className="text-xs text-green-700">Potential Payout</p><p className="font-bold text-lg text-green-900">{formatCurrency(data.potentialPayout)}</p></div></div>
                        {type === 'motor' && data.leadDetails.policyType && <p className="text-xs text-gray-500 mt-2">Policy Type: {data.leadDetails.policyType} with {data.leadDetails.ncb}% NCB</p>}
                        <p className="text-xs text-gray-500 mt-2">Suggested: {data.leadDetails.suggestedPlan || 'N/A'} ({data.leadDetails.suggestedInsurer || 'N/A'})</p>
                    </div>)
                )}
                {data.isDeclined && (<div className="flex items-center space-x-2 text-gray-600 bg-gray-100 p-4 rounded-md h-full"><p><strong>Reason:</strong> {data.declineReason}</p></div>)}
                {data.status === 'OutOfScope' && (<div className="flex items-center space-x-2 text-gray-600 bg-gray-100 p-4 rounded-md h-full"><p><strong>Reason:</strong> {data.reason}</p></div>)}
            </div>
            {isEditing && data.status === 'Opportunity' && (<div className="flex space-x-2 mt-4 pt-4 border-t"><button onClick={() => onDataChange(type, {...data, isDeclined: !data.isDeclined, declineReason: data.isDeclined ? '' : 'Manually marked.'})} className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition flex items-center justify-center space-x-2"><Ban size={14}/><span>{data.isDeclined ? 'Re-open' : 'Decline'}</span></button></div>)}
            {data.status === 'Opportunity' && !data.isDeclined && !isEditing && (
                <div className="mt-4 pt-4 border-t">
                    {!isEditingFollowUp && (data.followUpDate ? (<div className="flex justify-between items-center"><p className="text-sm font-semibold flex items-center text-yellow-800"><Calendar size={14} className="mr-2"/> Follow-up: {data.followUpDate}</p><button onClick={() => setIsEditingFollowUp(true)} className="text-xs text-indigo-600 hover:underline">Change</button></div>) : (<button onClick={() => setIsEditingFollowUp(true)} className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">Set Follow-up Date</button>))}
                    {isEditingFollowUp && (<div className="flex items-center space-x-2"><input type="date" value={data.followUpDate || ''} onChange={(e) => onDataChange(type, {...data, followUpDate: e.target.value})} className="flex-1 text-sm p-2 border rounded-md"/><button onClick={() => { onUpdateCustomer(editedCustomer); setIsEditingFollowUp(false); }} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"><Check size={16}/></button></div>)}
                </div>
            )}
        </div>
        );
    };

    return (
    <div className="p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6"><div className="flex items-center"><button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-gray-200 mr-2"><ChevronLeft size={24} className="text-gray-600"/></button><h1 className="text-3xl font-bold text-gray-800">Customer Profile</h1></div>{isEditing ? (<div className="flex space-x-2"><button onClick={handleCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button><button onClick={handleSave} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 flex items-center space-x-2"><Save size={16}/><span>Save Changes</span></button></div>) : (<button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"><Edit size={16}/><span>Edit Profile</span></button>)}</header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-start"><div><EditableField value={name} onChange={handleInputChange} isEditing={isEditing} name="name" label="Full Name" className="text-2xl font-bold text-indigo-700"/><EditableField value={occupation} onChange={handleInputChange} isEditing={isEditing} name="occupation" label="Occupation" className="font-semibold text-gray-500"/></div><div className="flex items-center space-x-2"><a href={`tel:${contact}`} className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"><Phone size={20}/></a><a href={`https://wa.me/${contact.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-3 text-white bg-green-500 hover:bg-green-600 rounded-full shadow-sm"><MessageSquare size={20}/></a></div></div>
                    <div className="space-y-4 text-gray-600 mt-6 pt-4 border-t">
                        {nextFollowUp && !isEditing && <div className="flex items-center p-3 bg-yellow-50 text-yellow-800 rounded-lg font-semibold"><Calendar size={16} className="mr-3"/><p>Next Follow-up: {nextFollowUp}</p></div>}
                        <div className="flex items-start"><Mail size={16} className="mr-3 mt-1 text-gray-400"/><EditableField value={email} onChange={handleInputChange} isEditing={isEditing} name="email" label="Email" /></div>
                        <div className="flex items-start"><Phone size={16} className="mr-3 mt-1 text-gray-400"/><EditableField value={alternateContact} onChange={handleInputChange} isEditing={isEditing} name="alternateContact" label="Alternate Contact" /></div>
                        <div className="flex items-start"><Cake size={16} className="mr-3 mt-1 text-gray-400"/><EditableField value={dob} onChange={handleInputChange} isEditing={isEditing} name="dob" label="Date of Birth" type="date"/></div>
                        <div className="flex items-start"><GitBranch size={16} className="mr-3 mt-1 text-gray-400"/><EditableField value={leadSource} onChange={handleInputChange} isEditing={isEditing} name="leadSource" label="Lead Source" /></div>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-800 flex items-center"><Car size={20} className="mr-2"/>Vehicles</h3>{isEditing && <button onClick={handleAddVehicle} className="text-indigo-600 hover:text-indigo-800"><PlusCircle size={20}/></button>}</div>
                    <div className="space-y-3">
                        {vehicles.length > 0 ? vehicles.map((v: any, index: number) => {
                            const motorPolicy = policies.motor?.vehicles?.find((p: any) => p.id === v.id || p.regNo === v.regNo);
                            return (
                                <div key={v.id} className="text-sm p-3 rounded-md bg-gray-50">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-end"><button onClick={() => handleDeleteVehicle(v.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button></div>
                                            <input value={v.regNo} onChange={e => handleVehicleChange(index, 'regNo', e.target.value)} placeholder="Reg. Number" className="w-full p-1.5 border rounded-md"/>
                                            <div className="flex space-x-2">
                                                <input value={v.make} onChange={e => handleVehicleChange(index, 'make', e.target.value)} placeholder="Make" className="w-1/2 p-1.5 border rounded-md"/>
                                                <input value={v.model} onChange={e => handleVehicleChange(index, 'model', e.target.value)} placeholder="Model" className="w-1/2 p-1.5 border rounded-md"/>
                                            </div>
                                            <input value={v.variant} onChange={e => handleVehicleChange(index, 'variant', e.target.value)} placeholder="Variant" className="w-full p-1.5 border rounded-md"/>
                                            <div className="flex space-x-2">
                                                 <input value={v.regYear} onChange={e => handleVehicleChange(index, 'regYear', e.target.value)} placeholder="Reg. Year" className="w-1/2 p-1.5 border rounded-md"/>
                                                 <input value={v.fuelType} onChange={e => handleVehicleChange(index, 'fuelType', e.target.value)} placeholder="Fuel Type" className="w-1/2 p-1.5 border rounded-md"/>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-700">{v.regNo || 'N/A'}</p>
                                                <p className="text-gray-500">{v.make} {v.model}</p>
                                            </div>
                                             <div className="text-xs text-gray-500">{v.regYear} • {v.fuelType}</div>
                                            {motorPolicy ? (
                                                <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                                                    <div className="flex justify-between items-center">
                                                         <span className="text-gray-600">Insurer: {motorPolicy.insurer}</span>
                                                         <span className="text-gray-600">Policy: {motorPolicy.policyType} ({motorPolicy.ncb}% NCB)</span>
                                                    </div>
                                                    <div className="font-semibold text-red-600 text-right mt-1">Renewal Due: {motorPolicy.expiryDate}</div>
                                                </div>
                                            ) : (
                                                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">No active policy details.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }) : <p className="text-sm text-gray-500">No vehicles added.</p>}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><History size={20} className="mr-2"/>Activity Log</h3>
                    {isEditing && <div className="flex space-x-2 mb-4"><input type="text" value={newActivityRemark} onChange={e => setNewActivityRemark(e.target.value)} placeholder="Add new activity..." className="flex-1 p-2 border rounded-md text-sm"/><button onClick={addActivityLog} className="bg-gray-200 px-4 rounded-md font-semibold text-sm hover:bg-gray-300">Add</button></div>}
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">{activityLog.length > 0 ? activityLog.map((log: any) => (<div key={log.id} className="text-sm relative pl-6 before:absolute before:left-2 before:top-2 before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full before:border-2 before:border-white"><p className="font-semibold text-gray-700">{log.activity} - <span className="text-indigo-600">{log.product}</span></p><p className="text-gray-500">{log.remarks}</p><p className="text-xs text-gray-400">{log.date}</p></div>)) : <p className="text-sm text-gray-500">No activities logged yet.</p>}</div>
                </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <ProductCard type="health" data={policies.health} isEditing={isEditing} onDataChange={handlePolicyChange} />
                <ProductCard type="life" data={policies.life} isEditing={isEditing} onDataChange={handlePolicyChange} />
                <ProductCard type="motor" data={policies.motor} isEditing={isEditing} onDataChange={handlePolicyChange} />
            </div>
        </div>
    </div>
    );
};

// --- MAIN APP COMPONENT --- //
export default function CustomerBook360() {
  const [customers, setCustomers] = useState(initialMockCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  
  const handleSelectCustomer = (id: number) => { setSelectedCustomerId(id); };
  const handleNavigateBack = () => { setSelectedCustomerId(null); };
  const handleUpdateCustomer = (updatedCustomer: any) => {
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  const handleAddCustomer = (newCustomer: any) => {
      setCustomers(prev => [newCustomer, ...prev]);
  };
  
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
      <div className="min-h-screen bg-gray-50 font-sans">
          <main>
              {selectedCustomerId && selectedCustomer ? 
                <CustomerProfile customer={selectedCustomer} onNavigateBack={handleNavigateBack} onUpdateCustomer={handleUpdateCustomer}/> : 
                <CustomerBookPage customers={customers} onSelectCustomer={handleSelectCustomer} onAddCustomer={handleAddCustomer}/>}
          </main>
      </div>
  );
}
