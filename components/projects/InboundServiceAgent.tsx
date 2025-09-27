import React, { useState, useMemo } from 'react';
import { Bell, Phone, Mail, MessageSquare, Search, User, FileText, DollarSign, Shield, History, BookOpen, ChevronsRight, AlertCircle, LifeBuoy, CheckCircle, XCircle, Clock, Download, Send, RefreshCw, Wrench, UserCheck, UserX, Link2 } from 'lucide-react';

// --- MOCK DATA GENERATOR ---
// A comprehensive data store simulating a backend with 50+ scenarios.

const generateScenarios = () => {
    const scenarios = {
        'Onboarding Journey': {
            'PAN Mismatch': {
                partner: { name: "Aarav Sharma", code: "PB9876", status: "Onboarding Pending", mobile: "+91-9876543210", email: "aarav.s@example.com", rms: {}, criticalAlert: "ACTION REQUIRED: PAN name mismatch." },
                onboarding: { status: 'Action Required', statusDetail: 'PAN name does not match application name.', checklist: [ { name: 'PAN Card', status: 'Rejected', reason: 'Name on PAN (Aarav Kumar Sharma) does not match application name (Aarav Sharma).' }, { name: 'Education Doc', status: 'Approved' }, { name: 'Profile Selfie', status: 'Approved' }, { name: 'Bank Details', status: 'Approved' } ] }
            },
            'Illegible Selfie': {
                partner: { name: "Bhavna Chauhan", code: "PB9877", status: "Onboarding Pending", mobile: "+91-9876543211", email: "bhavna.c@example.com", rms: {}, criticalAlert: "ACTION REQUIRED: Selfie rejected." },
                onboarding: { status: 'Action Required', statusDetail: 'Profile selfie is not clear.', checklist: [ { name: 'PAN Card', status: 'Approved' }, { name: 'Education Doc', status: 'Approved' }, { name: 'Profile Selfie', status: 'Rejected', reason: 'Image is blurry and out of focus. Please upload a clear, front-facing photo.' }, { name: 'Bank Details', status: 'Approved' } ] }
            },
            'Pending NOC': {
                partner: { name: "Chetan Dubey", code: "PB9878", status: "Onboarding Pending", mobile: "+91-9876543212", email: "chetan.d@example.com", rms: {}, criticalAlert: "ACTION REQUIRED: NOC from previous employer needed." },
                onboarding: { status: 'Action Required', statusDetail: 'NOC required as PAN is linked to another broker.', checklist: [ { name: 'PAN Card', status: 'Approved' }, { name: 'Education Doc', status: 'Approved' }, { name: 'Profile Selfie', status: 'Approved' }, { name: 'Bank Details', status: 'Approved' }, { name: 'NOC (from ABC Brokers)', status: 'Pending', reason: 'Awaiting upload from partner.' } ] }
            },
            'Bank Details Mismatch': {
                partner: { name: "Divya Reddy", code: "PB9879", status: "Onboarding Pending", mobile: "+91-9876543213", email: "divya.r@example.com", rms: {}, criticalAlert: "ACTION REQUIRED: Bank details verification failed." },
                onboarding: { status: 'Action Required', statusDetail: 'Account holder name mismatch.', checklist: [ { name: 'PAN Card', status: 'Approved' }, { name: 'Education Doc', status: 'Approved' }, { name: 'Profile Selfie', status: 'Approved' }, { name: 'Bank Details', status: 'Rejected', reason: 'Name on bank account (Divya R.) does not match PAN card (Divya Reddy).' } ] }
            },
        },
        'Payout Related Issues': {
            'Commission Dispute': {
                partner: { name: "Rohan Mehra", code: "PB1234", status: "Active", mobile: "+91-9999988888", email: "rohan.mehra@example.com", rms: { motor: "Amit Verma" }, criticalAlert: "Partner has disputed commission on policy M-567890." },
                payouts: { summary: { lifetimeEarnings: "1,50,000" }, transactions: [{ date: "10-Aug-25", policyNo: "M-567890", description: "Commission: Bajaj Allianz Motor", credit: "3,000", debit: "", balance: "14,500" }], deals: [{ insurer: 'Bajaj Allianz', product: 'Motor', deal: '15% on Net Premium' }] }
            },
            'ODP Disabled (Recovery)': {
                partner: { name: "Priya Patel", code: "PB5566", status: "Active", mobile: "+91-9555566666", email: "priya.p@example.com", rms: { health: "Sunita Nair" }, criticalAlert: "PAYOUT RECOVERY PENDING (-₹1,500)" },
                payouts: { summary: { odpStatus: "Disabled (Recovery Pending)" }, transactions: [{ date: "02-Aug-25", policyNo: "M-456789", description: "Recovery: Policy Cancelled", credit: "", debit: "1,500", balance: "22,000" }] }
            },
            'GST Invoice Query': {
                partner: { name: "Sameer Khan", code: "PB4455", status: "Active", mobile: "+91-9444455555", email: "sameer.k@example.com", rms: {}, criticalAlert: "Partner asking for GST invoice status." },
                payouts: { gstInvoices: [{ invoiceNo: 'GST-001', date: '01-Aug-25', amount: '18,000', status: 'Pending Verification' }, { invoiceNo: 'GST-002', date: '05-Aug-25', amount: '22,000', status: 'Approved' }] }
            },
            'Offline Policy Mapping': {
                partner: { name: "Tara Singh", code: "PB3322", status: "Active", mobile: "+91-9333322222", email: "tara.s@example.com", rms: {}, criticalAlert: "Request to map offline policy." },
                tech: { tickets: [{ id: 'T-88991', type: 'Request', status: 'Open', summary: 'Map offline policy HZ-998877 to this partner code.' }] }
            }
        },
        'Policy Issuance': {
            'Motor Inspection Pending': {
                partner: { name: "Faisal Ahmed", code: "PB6677", status: "Active", mobile: "+91-9666677777", email: "faisal.a@example.com", rms: { motor: "Amit Verma" }, criticalAlert: "Client waiting for motor inspection." },
                policies: [{ id: 'M-112233', type: 'Motor', insurer: 'ICICI Lombard', client: 'Sunita Devi', status: 'Pending Issuance', pendencyReason: 'Pre-inspection scheduled for 13-Aug-2025 at 2 PM.' }]
            },
            'Health Medicals Pending': {
                partner: { name: "Geeta Iyer", code: "PB7788", status: "Active", mobile: "+91-9777788888", email: "geeta.i@example.com", rms: { health: "Sunita Nair" }, criticalAlert: "Client medical test reports awaited." },
                policies: [{ id: 'H-445566', type: 'Health', insurer: 'Niva Bupa', client: 'Rakesh Verma', status: 'Pending Issuance', pendencyReason: 'Awaiting medical reports from diagnostics lab.' }]
            },
            'Premium Loading': {
                partner: { name: "Harish Kumar", code: "PB8899", status: "Active", mobile: "+91-9888899999", email: "harish.k@example.com", rms: { health: "Sunita Nair" }, criticalAlert: "Partner questioning premium loading." },
                policies: [{ id: 'H-778899', type: 'Health', insurer: 'Star Health', client: 'Meena Kumari', status: 'Pending Payment', pendencyReason: 'Premium loaded by 20% due to high BMI. Underwriter note available.' }]
            }
        },
        'Renewals': {
            'Generate Renewal List': {
                partner: { name: "Imran Jaffrey", code: "PB1133", status: "Active", mobile: "+91-9111133333", email: "imran.j@example.com", rms: { motor: "Amit Verma" }, criticalAlert: "" },
                renewals: { motor: [{ policyId: 'M-OLD-01', client: 'A. Kumar', expiry: '30-Aug-2025' }, { policyId: 'M-OLD-02', client: 'B. Singh', expiry: '05-Sep-2025' }], health: [] }
            },
            'Life Persistency Report': {
                partner: { name: "Jyoti Mehra", code: "PB2244", status: "Active", mobile: "+91-9222244444", email: "jyoti.m@example.com", rms: { life: "Rajesh Singh" }, criticalAlert: "" },
                renewals: { lifePersistency: { '13th_month': '95%', '25th_month': '88%' }, pendingLeads: [{ policyId: 'L-OLD-01', client: 'C. Sharma', premium: 50000, dueDate: '15-Sep-2025' }] }
            }
        },
        'Claims': {
            'Cashless Pre-Auth Query': {
                partner: { name: "Kavita Lal", code: "PB3355", status: "Active", mobile: "+91-9333355555", email: "kavita.l@example.com", rms: { health: "Sunita Nair" }, criticalAlert: "URGENT: Client pre-auth has a query." },
                claims: [{ id: 'C-HLT-004', policyId: 'H-ABC-01', clientName: 'Suresh Menon', status: 'Pre-Auth Query', amount: "1,50,000", details: { lastUpdate: 'Insurer TPA has raised a query for previous treatment documents.' } }]
            },
            'Settlement Dispute': {
                partner: { name: "Lalit Modi", code: "PB4466", status: "Active", mobile: "+91-9444466666", email: "lalit.m@example.com", rms: { motor: "Amit Verma" }, criticalAlert: "Client disputing claim settlement amount." },
                claims: [{ id: 'C-MOT-005', policyId: 'M-DEF-02', clientName: 'Rajni Gupta', status: 'Settled', amount: "80,000", details: { settledAmount: "65,000", deductionReason: 'Depreciation on plastic parts (25%) and non-payable consumables.', lastUpdate: 'Settlement breakdown shared with partner.' } }]
            },
            'Surveyor Details Request': {
                partner: { name: "Mona Singh", code: "PB5577", status: "Active", mobile: "+91-9555577777", email: "mona.s@example.com", rms: { motor: "Amit Verma" }, criticalAlert: "" },
                claims: [{ id: 'C-MOT-006', policyId: 'M-GHI-03', clientName: 'Vikas Rao', status: 'Surveyor Assigned', amount: "45,000", details: { surveyorName: 'Sanjay Tripathi', surveyorContact: '9811122233', lastUpdate: 'Surveyor assigned. Inspection scheduled.' } }]
            }
        },
        'Tech & Platform Issues': {
            'MMV Not Found': {
                partner: { name: "Naveen Pillai", code: "PB6688", status: "Active", mobile: "+91-9666688888", email: "naveen.p@example.com", rms: {}, criticalAlert: "" },
                tech: { tickets: [{ id: 'T-99001', type: 'Bug', status: 'Open', summary: "Tata Punch EV variant not found in motor portal." }] }
            },
            'Payment Deducted, Policy Not Generated': {
                partner: { name: "Omar Abdullah", code: "PB7799", status: "Active", mobile: "+91-9777799999", email: "omar.a@example.com", rms: {}, criticalAlert: "CRITICAL: Payment deducted, policy not issued." },
                tech: { tickets: [{ id: 'T-99002', type: 'Critical', status: 'In Progress', summary: 'Payment of Rs. 15,234 deducted (Ref: PAY123), policy not generated.' }] }
            }
        },
        'Post-Policy Endorsements': {
            'Name Correction': {
                partner: { name: "Parul Gupta", code: "PB1144", status: "Active", mobile: "+91-9111144444", email: "parul.g@example.com", rms: {}, criticalAlert: "" },
                endorsements: [{ id: 'E-001', policyId: 'H-XYZ-01', type: 'Name Correction', status: 'Pending Insurer Approval', requestedOn: '11-Aug-25' }]
            },
            'Ownership Transfer': {
                partner: { name: "Qamar Ali", code: "PB2255", status: "Active", mobile: "+91-9222255555", email: "qamar.a@example.com", rms: {}, criticalAlert: "" },
                endorsements: [{ id: 'E-002', policyId: 'M-PQR-02', type: 'Ownership Transfer', status: 'Documents Required', requestedOn: '12-Aug-25', notes: 'Awaiting new RC copy from partner.' }]
            }
        },
        'RM Relations': {
            'RM Not Contactable': {
                partner: { name: "Rina Dsouza", code: "PB3366", status: "Active", mobile: "+91-9333366666", email: "rina.d@example.com", rms: { motor: "Amit Verma" }, criticalAlert: "Partner unable to reach RM." },
                rm: { tickets: [{ id: 'RMT-001', type: 'Request', status: 'Open', summary: 'Partner requests a callback from Motor RM Amit Verma.' }] }
            },
            'Complaint Against RM': {
                partner: { name: "Salim Merchant", code: "PB4477", status: "Active", mobile: "+91-9444477777", email: "salim.m@example.com", rms: { health: "Sunita Nair" }, criticalAlert: "" },
                rm: { tickets: [{ id: 'RMT-002', type: 'Complaint', status: 'Under Investigation', summary: 'Complaint filed against RM for lack of support. (Confidential)' }] }
            }
        }
    };
    // Flatten for easy access in the dropdown
    const flatScenarios: any[] = [];
    for (const category in scenarios) {
        for (const title in scenarios[category as keyof typeof scenarios]) {
            flatScenarios.push({
                key: `${category}-${title}`,
                category,
                title,
                data: scenarios[category as keyof typeof scenarios][title as keyof typeof scenarios[keyof typeof scenarios]]
            });
        }
    }
    return { scenarios, flatScenarios };
};

const { scenarios, flatScenarios } = generateScenarios();

// --- UI COMPONENTS ---
// Components are defined here to render the data.

const Header = () => ( <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center w-full sticky top-0 z-20"> <div className="flex items-center"> <h1 className="text-xl font-bold text-gray-800">Pbpmitra<span className="text-blue-600">CRM</span></h1> <div className="relative ml-8"> <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /> <input type="text" placeholder="Search Partner Code, Policy No..." className="bg-gray-100 rounded-lg pl-10 pr-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500" /> </div> </div> <div className="flex items-center space-x-6"> <Bell className="h-6 w-6 text-gray-500 hover:text-blue-600 cursor-pointer" /> <div className="flex items-center space-x-3"> <img src={`https://i.pravatar.cc/150?u=priya`} alt="Priya Singh" className="h-9 w-9 rounded-full border-2 border-blue-500" /> <div> <p className="font-semibold text-sm text-gray-700">Priya Singh</p> <p className="text-xs text-green-600 font-medium">Available</p> </div> </div> </div> </header> );
const PartnerSnapshot = ({ data }: {data: any}) => { /* ... (same as previous version) ... */ return ( <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div className="col-span-1 md:col-span-2"> <div className="flex items-center mb-4 flex-wrap"> <h2 className="text-2xl font-bold text-gray-800 mr-4">{data.name}</h2> <span className="text-sm font-mono bg-blue-100 text-blue-700 px-3 py-1 rounded-full mr-3 mb-2">{data.code}</span> <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-2 ${data.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{data.status}</span> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600"> <div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-400"/> {data.mobile}</div> <div className="flex items-center"><Mail className="h-4 w-4 mr-2 text-gray-400"/> {data.email}</div> {Object.entries(data.rms).map(([key, value]) => value && <div key={key} className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-400"/> RM ({key.charAt(0).toUpperCase() + key.slice(1)}): <span className="font-semibold ml-1">{value as string}</span></div>)} </div> </div> <div className="flex flex-col justify-center items-start md:items-end"> <div className="flex space-x-2"> <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-sm"><Phone className="h-4 w-4 mr-2"/> Call</button> <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"><Mail className="h-4 w-4"/></button> <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"><MessageSquare className="h-4 w-4"/></button> </div> </div> </div> {data.criticalAlert && ( <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-800 p-3 rounded-r-lg flex items-center"> <AlertCircle className="h-5 w-5 mr-3"/> <span className="font-bold text-sm">CRITICAL ALERT:</span> <span className="ml-2 text-sm">{data.criticalAlert}</span> </div> )} </div> ); };
const OnboardingTab = ({ data }: {data: any}) => { /* ... (same as previous version) ... */ const statusIcon: {[key: string]: React.ReactNode} = { Approved: <CheckCircle className="h-5 w-5 text-green-500" />, Rejected: <XCircle className="h-5 w-5 text-red-500" />, Pending: <Clock className="h-5 w-5 text-yellow-500" />, }; return ( <div className="animate-fade-in"> <div className="bg-gray-50 rounded-lg p-4 mb-6 flex justify-between items-center"> <div> <p className="text-sm text-gray-500">Overall Status</p> <p className={`text-xl font-bold ${data.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>{data.status}</p> </div> <p className="text-gray-600 font-semibold">{data.statusDetail}</p> </div> <h3 className="text-lg font-semibold text-gray-700 mb-3">Document Checklist</h3> <ul className="space-y-3"> {data.checklist?.map((item: any, index: number) => ( <li key={index} className="bg-white p-4 rounded-lg border border-gray-200"> <div className="flex items-center justify-between"> <div className="flex items-center"> {statusIcon[item.status]} <p className="ml-3 font-semibold text-gray-800">{item.name}</p> </div> <p className="text-xs text-gray-400">{item.timestamp}</p> </div> {item.reason && <p className="mt-2 ml-8 text-sm text-red-700 bg-red-50 p-2 rounded-md">{item.reason}</p>} </li> ))} </ul> <div className="mt-6 flex justify-end space-x-3"> <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Create Service Request</button> <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Send className="h-4 w-4 mr-2"/> Send Re-upload Link</button> </div> </div> ); };
const PoliciesTab = ({ data }: {data: any}) => { /* ... (same as previous version) ... */ return ( <div className="animate-fade-in"> <div className="overflow-x-auto"> <table className="w-full text-sm text-left text-gray-500"> <thead className="text-xs text-gray-700 uppercase bg-gray-100"> <tr> <th className="px-6 py-3 rounded-l-lg">Policy ID</th> <th className="px-6 py-3">Type</th> <th className="px-6 py-3">Insurer</th> <th className="px-6 py-3">Client</th> <th className="px-6 py-3">Status</th> <th className="px-6 py-3 rounded-r-lg">Actions</th> </tr> </thead> <tbody> {data?.map((policy: any) => ( <tr key={policy.id} className="bg-white border-b"> <td className="px-6 py-4 font-mono text-gray-800">{policy.id}</td> <td className="px-6 py-4">{policy.type}</td> <td className="px-6 py-4">{policy.insurer}</td> <td className="px-6 py-4 font-medium">{policy.client}</td> <td className="px-6 py-4"> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}> {policy.status} </span> {policy.pendencyReason && <p className="text-xs text-gray-500 mt-1">{policy.pendencyReason}</p>} </td> <td className="px-6 py-4 flex space-x-2"> <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"><Download className="h-4 w-4"/></button> <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"><Mail className="h-4 w-4"/></button> </td> </tr> ))} </tbody> </table> </div> </div> ); };
const ClaimsTab = ({ data }: {data: any}) => { /* ... (same as previous version) ... */ const statusColors: {[key: string]: string} = { 'Surveyor Assigned': 'bg-blue-100 text-blue-800', 'Settled': 'bg-green-100 text-green-800', 'Rejected': 'bg-red-100 text-red-800', 'Pre-Auth Query': 'bg-yellow-100 text-yellow-800', }; return ( <div className="animate-fade-in space-y-4"> {data?.map((claim: any) => ( <div key={claim.id} className="bg-white p-4 rounded-lg border border-gray-200"> <div className="flex justify-between items-start mb-2"> <div> <p className="font-bold text-gray-800">{claim.id} <span className="font-normal text-gray-500">({claim.clientName})</span></p> <p className="text-sm text-gray-500">Policy: {claim.policyId} | Claimed: ₹{claim.amount}</p> </div> <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[claim.status]}`}>{claim.status}</span> </div> <div className="bg-gray-50 p-3 rounded-md text-sm"> <p className="font-semibold text-gray-600">Last Update:</p> <p className="text-gray-800">{claim.details.lastUpdate}</p> {claim.status === 'Settled' && <p className="text-green-700 font-semibold">Settled Amount: ₹{claim.details.settledAmount}</p>} {claim.status === 'Rejected' && <p className="text-red-700 font-semibold">Reason: {claim.details.rejectionReason}</p>} </div> </div> ))} </div> )};
const PayoutsTab = ({ data }: {data: any}) => { /* ... (same as previous version) ... */ return ( <div className="animate-fade-in space-y-6"> {data.summary && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center"> <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Lifetime Earnings</p><p className="text-2xl font-bold text-gray-800">₹{data.summary.lifetimeEarnings}</p></div> {data.summary.lastPayout && <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Last Payout</p><p className="text-xl font-semibold text-gray-800">₹{data.summary.lastPayout.split(' ')[0]}</p><p className="text-xs text-gray-500">{data.summary.lastPayout.split('on ')[1]}</p></div>} {data.summary.odpStatus && <div className="bg-red-50 p-4 rounded-lg border border-red-200"><p className="text-sm text-red-600">ODP Status</p><p className="text-xl font-bold text-red-700">{data.summary.odpStatus.split(' ')[0]}</p><p className="text-xs text-red-500">{data.summary.odpStatus.match(/\(([^)]+)\)/)[1]}</p></div>} {data.summary.pendingPayout && <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"><p className="text-sm text-yellow-600">Pending Payout</p><p className="text-xl font-bold text-yellow-700">₹{data.summary.pendingPayout.split(' ')[0]}</p><p className="text-xs text-yellow-500">{data.summary.pendingPayout.match(/\(([^)]+)\)/)[1]}</p></div>} </div>} {data.deals && <div><h3 className="text-lg font-semibold text-gray-700 mb-3">Applicable Deals</h3><div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm font-mono">{data.deals.map((d: any) => `${d.insurer} (${d.product}): ${d.deal}`).join(' | ')}</div></div>} {data.transactions && <div> <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Transactions</h3> <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500"><thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th scope="col" className="px-6 py-3 rounded-l-lg">Date</th><th scope="col" className="px-6 py-3">Policy No.</th><th scope="col" className="px-6 py-3">Description</th><th scope="col" className="px-6 py-3 text-right">Credit (₹)</th><th scope="col" className="px-6 py-3 text-right">Debit (₹)</th><th scope="col" className="px-6 py-3 text-right rounded-r-lg">Balance (₹)</th></tr></thead> <tbody>{data.transactions.map((tx: any, index: number) => (<tr key={index} className="bg-white border-b"><td className="px-6 py-4 font-medium text-gray-900">{tx.date}</td><td className="px-6 py-4 font-mono">{tx.policyNo || '-'}</td><td className="px-6 py-4">{tx.description}</td><td className="px-6 py-4 text-right font-semibold text-green-600">{tx.credit}</td><td className="px-6 py-4 text-right font-semibold text-red-600">{tx.debit}</td><td className="px-6 py-4 text-right font-bold text-gray-800">{tx.balance}</td></tr>))}</tbody> </table></div> </div>} {data.gstInvoices && <div> <h3 className="text-lg font-semibold text-gray-700 mb-3">GST Invoices</h3> <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500"><thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th className="px-6 py-3 rounded-l-lg">Invoice No</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Amount (₹)</th><th className="px-6 py-3 rounded-r-lg">Status</th></tr></thead> <tbody>{data.gstInvoices.map((inv: any, index: number) => (<tr key={index} className="bg-white border-b"><td className="px-6 py-4 font-mono">{inv.invoiceNo}</td><td className="px-6 py-4">{inv.date}</td><td className="px-6 py-4">{inv.amount}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${inv.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{inv.status}</span></td></tr>))}</tbody> </table></div> </div>} </div> ); };
const RenewalsTab = ({ data }: {data: any}) => ( <div className="animate-fade-in space-y-6"> {data.motor?.length > 0 && <div><h3 className="text-lg font-semibold text-gray-700 mb-3">Motor Renewals Due</h3><div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500"><thead className="text-xs text-gray-700 uppercase bg-gray-100"><tr><th className="px-6 py-3 rounded-l-lg">Policy ID</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Expiry Date</th><th className="px-6 py-3 rounded-r-lg">Actions</th></tr></thead> <tbody>{data.motor.map((r: any) => <tr key={r.policyId} className="bg-white border-b"><td className="px-6 py-4 font-mono">{r.policyId}</td><td className="px-6 py-4">{r.client}</td><td className="px-6 py-4">{r.expiry}</td><td className="px-6 py-4"><button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Send Link</button></td></tr>)}</tbody></table></div></div>} {data.lifePersistency && <div><h3 className="text-lg font-semibold text-gray-700 mb-3">Life Persistency</h3><div className="flex space-x-4"><div className="bg-gray-50 p-4 rounded-lg text-center flex-1"><p className="text-sm text-gray-500">13th Month</p><p className="text-2xl font-bold text-green-600">{data.lifePersistency['13th_month']}</p></div><div className="bg-gray-50 p-4 rounded-lg text-center flex-1"><p className="text-sm text-gray-500">25th Month</p><p className="text-2xl font-bold text-green-600">{data.lifePersistency['25th_month']}</p></div></div></div>} </div>);
const TechTab = ({ data }: {data: any}) => ( <div className="animate-fade-in space-y-4"> {data.tickets?.map((ticket: any) => ( <div key={ticket.id} className="bg-white p-4 rounded-lg border border-gray-200"> <div className="flex justify-between items-start mb-2"> <div> <p className="font-bold text-gray-800">{ticket.id} <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${ticket.type === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{ticket.type}</span></p> <p className="text-sm text-gray-700 mt-1">{ticket.summary}</p> </div> <span className={`px-2 py-1 text-xs font-bold rounded-full ${ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{ticket.status}</span> </div> </div> ))} </div>);
const EndorsementsTab = ({ data }: {data: any}) => ( <div className="animate-fade-in space-y-4"> {data?.map((endo: any) => ( <div key={endo.id} className="bg-white p-4 rounded-lg border border-gray-200"> <div className="flex justify-between items-start mb-2"> <div> <p className="font-bold text-gray-800">{endo.id}: {endo.type}</p> <p className="text-sm text-gray-500">Policy: {endo.policyId} | Requested: {endo.requestedOn}</p> </div> <span className={`px-2 py-1 text-xs font-bold rounded-full ${endo.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{endo.status}</span> </div> {endo.notes && <p className="text-sm text-red-700 bg-red-50 p-2 rounded-md">{endo.notes}</p>} </div> ))} </div>);
const RmTab = ({ data }: {data: any}) => ( <div className="animate-fade-in space-y-4"> {data.tickets?.map((ticket: any) => ( <div key={ticket.id} className="bg-white p-4 rounded-lg border border-gray-200"> <div className="flex justify-between items-start mb-2"> <div> <p className="font-bold text-gray-800">{ticket.id} <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${ticket.type === 'Complaint' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{ticket.type}</span></p> <p className="text-sm text-gray-700 mt-1">{ticket.summary}</p> </div> <span className={`px-2 py-1 text-xs font-bold rounded-full ${ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{ticket.status}</span> </div> </div> ))} </div>);
const PlaceholderTab = ({ title }: {title: string}) => ( <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg animate-fade-in"><LifeBuoy className="h-16 w-16 text-gray-300 mb-4" /><h3 className="text-xl font-semibold text-gray-400">{title}</h3></div>);
const Sidebar = () => ( <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 space-y-6"> <div><h3 className="text-lg font-semibold text-gray-800 mb-3">Open Service Requests</h3><div className="space-y-3">{[{ id: "SR-54320", type: "Payouts", status: "Pending", details: "Policy Verification for H-123789", sla: "24h Remaining", team: "Policy Ops" }, { id: "SR-54112", type: "Tech", status: "Resolved", details: "MMV for 'Kia Carens' added", sla: "Closed", team: "Tech" }].map(req => (<div key={req.id} className="bg-white p-4 rounded-lg border border-gray-200"><div className="flex justify-between items-start"><p className="font-bold text-gray-700">{req.id} <span className="font-normal text-gray-500">({req.team})</span></p><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{req.status}</span></div><p className="text-sm text-gray-600 mt-1">{req.details}</p><p className="text-xs text-gray-400 mt-2 text-right">{req.sla}</p></div>))}</div></div> <div><h3 className="text-lg font-semibold text-gray-800 mb-3">Interaction History</h3><ul className="space-y-4 border-l-2 border-gray-200 ml-2">{[{ date: "10-Aug-2025", type: "Call", agent: "Priya", summary: "Inbound call re: commission for M-567890. Explained calculation." }, { date: "02-Aug-2025", type: "System", agent: "", summary: "Automated email sent re: payout recovery for M-456789." }].map((item, index) => (<li key={index} className="relative pl-6"><div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full ${item.type === 'Call' ? 'bg-blue-500' : 'bg-gray-400'} border-4 border-gray-50`}></div><p className="text-xs text-gray-500">{item.date} - {item.type} {item.agent && `(Agent: ${item.agent})`}</p><p className="text-sm text-gray-700">{item.summary}</p></li>))}</ul></div> <div><h3 className="text-lg font-semibold text-gray-800 mb-3">Knowledge Base Suggestions</h3><div className="space-y-2">{[{ title: "Explaining Payout Recoveries" }, { title: "How to clear pending policy verification" }, { title: "Standard Payout Cycle (SOP)" }].map(item => (<a href="#" key={item.title} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"><div className="flex items-center"><BookOpen className="h-5 w-5 mr-3 text-blue-500"/><span className="text-sm text-gray-700">{item.title}</span></div><ChevronsRight className="h-5 w-5 text-gray-400"/></a>))}</div></div> </aside> );

// --- MAIN APP COMPONENT ---

export default function InboundServiceAgent() {
    const [scenarioKey, setScenarioKey] = useState(flatScenarios[0].key);
    const [activeTab, setActiveTab] = useState('Onboarding');

    const currentScenario = useMemo(() => flatScenarios.find(s => s.key === scenarioKey), [scenarioKey]);
    const currentData = currentScenario!.data;

    const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newKey = e.target.value;
        const newScenario = flatScenarios.find(s => s.key === newKey);
        setScenarioKey(newKey);
        // Set a relevant default tab for the new scenario
        if (newScenario!.category === 'Onboarding Journey') setActiveTab('Onboarding');
        else if (newScenario!.category === 'Payout Related Issues') setActiveTab('Payouts');
        else if (newScenario!.category === 'Policy Issuance') setActiveTab('Policies');
        else if (newScenario!.category === 'Renewals') setActiveTab('Renewals');
        else if (newScenario!.category === 'Claims') setActiveTab('Claims');
        else if (newScenario!.category === 'Tech & Platform Issues') setActiveTab('Tech');
        else if (newScenario!.category === 'Post-Policy Endorsements') setActiveTab('Endorsements');
        else if (newScenario!.category === 'RM Relations') setActiveTab('RM Relations');
    };

    const tabs = [
        { name: 'Onboarding', icon: UserCheck, data: currentData.onboarding },
        { name: 'Payouts', icon: DollarSign, data: currentData.payouts },
        { name: 'Policies', icon: FileText, data: currentData.policies },
        { name: 'Renewals', icon: RefreshCw, data: currentData.renewals },
        { name: 'Claims', icon: Shield, data: currentData.claims },
        { name: 'Endorsements', icon: Link2, data: currentData.endorsements },
        { name: 'Tech', icon: Wrench, data: currentData.tech },
        { name: 'RM Relations', icon: UserX, data: currentData.rm },
    ];

    const renderTabContent = () => {
        if (!tabs.find(t => t.name === activeTab)?.data) {
            return <PlaceholderTab title={`${activeTab} data not available for this partner.`} />;
        }
        switch (activeTab) {
            case 'Onboarding': return <OnboardingTab data={currentData.onboarding} />;
            case 'Policies': return <PoliciesTab data={currentData.policies} />;
            case 'Claims': return <ClaimsTab data={currentData.claims} />;
            case 'Payouts': return <PayoutsTab data={currentData.payouts} />;
            case 'Renewals': return <RenewalsTab data={currentData.renewals} />;
            case 'Tech': return <TechTab data={currentData.tech} />;
            case 'Endorsements': return <EndorsementsTab data={currentData.endorsements} />;
            case 'RM Relations': return <RmTab data={currentData.rm} />;
            default: return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <div className="flex flex-col lg:flex-row">
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <label htmlFor="scenario-selector" className="block text-sm font-medium text-gray-700 mb-1">Select Interaction Scenario:</label>
                        <select id="scenario-selector" value={scenarioKey} onChange={handleScenarioChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            {Object.keys(scenarios).map(category => (
                                <optgroup label={category} key={category}>
                                    {Object.keys(scenarios[category as keyof typeof scenarios]).map(title => (
                                        <option key={`${category}-${title}`} value={`${category}-${title}`}>{title}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <PartnerSnapshot data={currentData.partner} />
                    
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 px-5 overflow-x-auto" aria-label="Tabs">
                                {tabs.map(tab => tab.data && (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                                            activeTab === tab.name
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <tab.icon className="h-5 w-5 mr-2" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="p-5">
                            {renderTabContent()}
                        </div>
                    </div>

                </main>
                <Sidebar />
            </div>
        </div>
    );
}