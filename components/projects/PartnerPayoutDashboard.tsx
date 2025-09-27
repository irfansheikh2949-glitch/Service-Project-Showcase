import React, { useState, useMemo } from 'react';
import { Search, Calendar, AlertCircle, CheckCircle, CircleDollarSign, Clock, XCircle } from 'lucide-react';

// --- Mock Data ---
const mockPayouts = [
    {
        leadId: '8659647',
        verificationStatus: 'Verified',
        reasonForNotVerified: '',
        policyNumber: '265345187543',
        insurerName: 'ICICI Lombard',
        customerName: 'Vikas Kumar',
        product: 'Motor',
        planType: 'Comprehensive',
        bookingDate: '2023-10-15',
        paymentDate: '2023-10-16',
        vehicleNumber: 'HR26DQ5555',
        dealPercent: 15,
        dealOn: 'OD Premium',
        commissionAmount: 1200,
        rewardAmount: 300,
        totalPayout: 1500,
        status: 'Paid',
        commissionUtr: 'ICICR52023101612345678',
        rewardUtr: 'PAYTMR52023101698765432',
        payoutHoldReason: '',
    },
    {
        leadId: '8653479',
        verificationStatus: 'Pending for Verification',
        reasonForNotVerified: '',
        policyNumber: '278154682',
        insurerName: 'HDFC Ergo',
        customerName: 'Manish Sharma',
        product: 'Health',
        planType: 'Family Floater',
        bookingDate: '2023-10-14',
        paymentDate: '2023-10-15',
        vehicleNumber: 'N/A',
        dealPercent: 20,
        dealOn: 'Net Premium',
        commissionAmount: 2500,
        rewardAmount: 500,
        totalPayout: 3000,
        status: 'Pending',
        commissionUtr: '',
        rewardUtr: '',
        payoutHoldReason: '',
    },
    {
        leadId: '8642258',
        verificationStatus: 'Not Verified',
        reasonForNotVerified: 'Vehicle details mismatch from Vahaan',
        policyNumber: '8976543210',
        insurerName: 'Reliance General',
        customerName: 'Mukesh Singh',
        product: 'Motor',
        planType: 'TP',
        bookingDate: '2023-10-12',
        paymentDate: '2023-10-13',
        vehicleNumber: 'DL10CA1234',
        dealPercent: 10,
        dealOn: 'TP',
        commissionAmount: 500,
        rewardAmount: 100,
        totalPayout: 600,
        status: 'Hold',
        commissionUtr: '',
        rewardUtr: '',
        payoutHoldReason: 'KYC pending',
    },
    {
        leadId: '8612345',
        verificationStatus: 'Verified',
        reasonForNotVerified: '',
        policyNumber: '5432109876',
        insurerName: 'TATA AIA',
        customerName: 'Sachin Gupta',
        product: 'Life',
        planType: 'Term',
        bookingDate: '2023-10-11',
        paymentDate: '2023-10-12',
        vehicleNumber: 'N/A',
        dealPercent: 25,
        dealOn: 'Net Premium',
        commissionAmount: 10000,
        rewardAmount: 2000,
        totalPayout: 12000,
        status: 'Paid',
        commissionUtr: 'TATAR52023101211223344',
        rewardUtr: 'PAYTMR52023101255667788',
        payoutHoldReason: '',
    },
    {
        leadId: '8698765',
        verificationStatus: 'Verified',
        reasonForNotVerified: '',
        policyNumber: '1122334455',
        insurerName: 'Care Health',
        customerName: 'Anjali Verma',
        product: 'Health',
        planType: 'Comprehensive',
        bookingDate: '2023-10-10',
        paymentDate: '2023-10-11',
        vehicleNumber: 'N/A',
        dealPercent: 18,
        dealOn: 'Net Premium',
        commissionAmount: 3200,
        rewardAmount: 640,
        totalPayout: 3840,
        status: 'Pending',
        commissionUtr: '',
        rewardUtr: '',
        payoutHoldReason: '',
    },
    {
        leadId: '8600112',
        verificationStatus: 'Not Verified',
        reasonForNotVerified: 'PYP required',
        policyNumber: '9988776655',
        insurerName: 'Aditya Birla',
        customerName: 'Rohit Mehta',
        product: 'Term',
        planType: 'SAOD',
        bookingDate: '2023-10-09',
        paymentDate: '2023-10-10',
        vehicleNumber: 'N/A',
        dealPercent: 22,
        dealOn: 'Net + TP',
        commissionAmount: 5500,
        rewardAmount: 1100,
        totalPayout: 6600,
        status: 'Hold',
        commissionUtr: '',
        rewardUtr: '',
        payoutHoldReason: 'GST Updation',
    },
     {
        leadId: '8500113',
        verificationStatus: 'Hold',
        reasonForNotVerified: 'Invoice Pending',
        policyNumber: '7766554433',
        insurerName: 'LIC',
        customerName: 'Priya Jain',
        product: 'Life',
        planType: 'Endowment',
        bookingDate: '2023-10-08',
        paymentDate: '2023-10-09',
        vehicleNumber: 'N/A',
        dealPercent: 12,
        dealOn: 'Net Premium',
        commissionAmount: 4000,
        rewardAmount: 800,
        totalPayout: 4800,
        status: 'Hold',
        commissionUtr: '',
        rewardUtr: '',
        payoutHoldReason: 'Invoice Pending',
    }
];

const SummaryCard = ({ title, value, icon: Icon, color }: {title: string, value: string, icon: React.ElementType, color: string}) => {
    const colors: {[key: string]: string} = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-600',
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-xl shadow-lg p-5 flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-black bg-opacity-10`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
        </div>
    );
};


const StatusPill = ({ text, color }: {text: string, color: string}) => {
    const colors: {[key: string]: string} = {
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        red: 'bg-red-100 text-red-800',
        blue: 'bg-blue-100 text-blue-800',
        orange: 'bg-orange-100 text-orange-800',
        pink: 'bg-pink-100 text-pink-800',
        gray: 'bg-gray-100 text-gray-800'
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${colors[color] || colors.gray}`}>{text}</span>;
};

const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid': return <StatusPill text="Paid" color="green" />;
        case 'pending': return <StatusPill text="Pending" color="yellow" />;
        case 'hold': return <StatusPill text="Hold" color="red" />;
        default: return <StatusPill text={status} color="gray" />;
    }
};

const getVerificationStatusPill = (status: string) => {
     switch (status.toLowerCase()) {
        case 'verified': return <StatusPill text="Verified" color="blue" />;
        case 'pending for verification': return <StatusPill text="Pending" color="orange" />;
        case 'not verified': return <StatusPill text="Not Verified" color="pink" />;
        default: return <StatusPill text={status} color="gray" />;
    }
};

const OdpStatusCard = ({ enabled, reason }: {enabled: boolean, reason: string}) => {
    return (
        <div className={`p-4 rounded-lg flex items-start space-x-4 ${enabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            {enabled ? (
                 <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            ) : (
                <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
            )}
            <div>
                <h3 className={`text-lg font-semibold ${enabled ? 'text-green-800' : 'text-red-800'}`}>
                    ODP Status: {enabled ? 'Enabled' : 'Disabled'}
                </h3>
                {!enabled && reason && (
                    <p className="text-sm text-red-700 mt-1">
                        <span className="font-semibold">Reason:</span> {reason}
                    </p>
                )}
            </div>
        </div>
    );
};

export default function PartnerPayoutDashboard() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ from: '2023-10-01', to: '2023-10-31' });

    const odpStatus = {
        enabled: false,
        reason: "Payout on hold due to pending KYC verification. Please update your details to re-enable ODP.",
    };
    
    const summaryData = useMemo(() => {
        return mockPayouts.reduce((acc, payout) => {
            acc.total += payout.totalPayout;
            if (payout.status === 'Paid') acc.paid += payout.totalPayout;
            if (payout.status === 'Pending') acc.pending += payout.totalPayout;
            if (payout.status === 'Hold') acc.hold += payout.totalPayout;
            return acc;
        }, { total: 0, paid: 0, pending: 0, hold: 0 });
    }, []);

    const filteredPayouts = useMemo(() => {
        return mockPayouts
            .filter(payout => {
                if (activeTab === 'All') return true;
                return payout.status.toLowerCase() === activeTab.toLowerCase();
            })
            .filter(payout => {
                if (!searchQuery) return true;
                const searchLower = searchQuery.toLowerCase();
                return Object.values(payout).some(value =>
                    String(value).toLowerCase().includes(searchLower)
                );
            });
    }, [activeTab, searchQuery]);

    const TABS = ['All', 'Paid', 'Pending', 'Hold'];

    const tableHeaders = [
        'Lead ID', 'Verification Status', 'Reason for not verified', 'Policy Number', 'Insurer Name',
        'Customer Name', 'Product', 'Plan Type', 'Booking Date', 'Payment Date', 'Vehicle Number',
        'Deal %', 'Deal On', 'Commission Amount', 'Reward Amount', 'Total Payout', 'Status',
        'Commission UTR details', 'Reward UTR details', 'Payout Hold Reason'
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Partner Payout Dashboard</h1>
                    <p className="text-gray-500 mt-1">Detailed payout visibility for Inbound and VRM teams.</p>
                </header>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard
                        title="Total Payout"
                        value={`₹${summaryData.total.toLocaleString('en-IN')}`}
                        icon={CircleDollarSign}
                        color="blue"
                    />
                    <SummaryCard
                        title="Paid"
                        value={`₹${summaryData.paid.toLocaleString('en-IN')}`}
                        icon={CheckCircle}
                        color="green"
                    />
                    <SummaryCard
                        title="Pending"
                        value={`₹${summaryData.pending.toLocaleString('en-IN')}`}
                        icon={Clock}
                        color="yellow"
                    />
                    <SummaryCard
                        title="On Hold"
                        value={`₹${summaryData.hold.toLocaleString('en-IN')}`}
                        icon={XCircle}
                        color="red"
                    />
                </div>

                <div className="mb-6">
                    <OdpStatusCard enabled={odpStatus.enabled} reason={odpStatus.reason} />
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div className="relative w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Global Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        
                         <div className="relative w-full md:w-auto">
                            <input
                                type="date"
                                className="w-full md:w-64 bg-white cursor-pointer pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPayouts.length > 0 ? filteredPayouts.map((payout) => (
                                    <tr key={payout.leadId} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{payout.leadId}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{getVerificationStatusPill(payout.verificationStatus)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{payout.reasonForNotVerified}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.policyNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.insurerName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.customerName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.product}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.planType}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.bookingDate}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.paymentDate}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.vehicleNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.dealPercent}%</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.dealOn}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{payout.commissionAmount.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{payout.rewardAmount.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">₹{payout.totalPayout.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{getStatusPill(payout.status)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.commissionUtr}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payout.rewardUtr}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600">{payout.payoutHoldReason}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={tableHeaders.length} className="text-center py-10 text-gray-500">
                                            No payout data found for the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
