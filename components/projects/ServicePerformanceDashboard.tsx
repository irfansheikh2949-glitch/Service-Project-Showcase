import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- MOCK DATA GENERATION ---
const generateRandomInt = (base: number, range: number) => Math.floor(base + Math.random() * range);
const generateRandomFloat = (base: number, range: number, decimals = 1) => (base + Math.random() * range).toFixed(decimals);
const generateCurrency = (base: number, range: number) => `₹${generateRandomInt(base, range).toLocaleString('en-IN')}`;
const generateTime = (base: number, range: number, unit: string) => `${generateRandomFloat(base, range)} ${unit}`;

const generateVrmKpis = () => ({
    output: [ { name: "Total Partners Assigned", value: `${generateRandomInt(950, 100)}` }, { name: "Target vs Achievement (MTD %)", value: `${generateRandomInt(90, 35)}%` }, { name: "Active Partners Today", value: `${generateRandomInt(15, 20)}` }, { name: "Active Partner Activation", value: `${generateRandomInt(20, 15)}` }, { name: "Inactive Partner Reactivation", value: `${generateRandomInt(8, 10)}` }, { name: "MTD Business (GWP)", value: generateCurrency(500000, 250000) }, { name: "New Leads Generated (Inactive)", value: `${generateRandomInt(15, 10)}` }, ],
    quality: [ { name: "Top 20 Partner Contribution", value: `${generateRandomFloat(30, 15)}%` }, { name: "Active Partner Engagement Rate", value: `${generateRandomFloat(80, 15)}%` }, { name: "Inactive Partner Calls (>3 attempts)", value: `${generateRandomInt(25, 20)}` }, { name: "Active Partners Not Called", value: `${generateRandomInt(50, 50)}` }, { name: "Call Quality Score", value: `${generateRandomFloat(4.1, 0.8)}/5` }, { name: "Partner Feedback (CSAT)", value: `${generateRandomFloat(4.3, 0.6)}/5` }, ],
    efficiency: [ { name: "Unique Partners Connected (MTD)", value: `${generateRandomInt(350, 100)}` }, { name: "Unique Partners Connected (FTD)", value: `${generateRandomInt(20, 15)}` }, { name: "Connectivity Rate", value: `${generateRandomFloat(75, 20)}%` }, { name: "Avg. Talk Time (Active)", value: `${generateRandomInt(180, 120)}s` }, { name: "Avg. Response Time (Queries)", value: generateTime(1, 3, 'hrs')}, { name: "Call-to-Conversion Ratio", value: `${generateRandomFloat(5, 4)}%` }, ],
});

const generateOnboardingKpis = () => ({
    output: [ { name: "Tasks Closed (MTD)", value: `${generateRandomInt(40, 20)}` }, { name: "Open Task Backlog", value: `${generateRandomInt(10, 15)}` }, { name: "Onboarded Partners Activated", value: `${generateRandomInt(15, 10)}` }, ],
    quality: [ { name: "Onboarding Conversion Rate", value: `${generateRandomFloat(90, 8)}%` }, { name: "Document Discrepancy Rate", value: `${generateRandomFloat(5, 5)}%` }, { name: "Rework Rate", value: `${generateRandomFloat(3, 4)}%` }, ],
    efficiency: [ { name: "Avg. Onboarding TAT", value: generateTime(2, 2, 'days') }, { name: "Avg. Talk Time", value: `${generateRandomInt(300, 120)}s` }, { name: "Unique Call Attempts (MTD)", value: `${generateRandomInt(200, 100)}` }, { name: "Task Aging (Oldest)", value: `${generateRandomInt(5, 4)} days` }, ],
});

const generateTicketingKpis = (type: string) => ({
    output: [ { name: "Tickets Assigned (MTD)", value: `${generateRandomInt(300, 50)}` }, { name: "Tickets Closed (MTD)", value: `${generateRandomInt(280, 50)}` }, { name: "Ticket Resolved (MTD)", value: `${generateRandomInt(275, 50)}` }, ],
    quality: [ { name: `Resolution within TAT %`, value: `${generateRandomFloat(92, 7)}%` }, { name: "Reopen Rate %", value: `${generateRandomFloat(2, 3)}%` }, { name: `Response within 15 min %`, value: `${generateRandomFloat(95, 5)}%` }, ],
    efficiency: [ { name: "Avg. Resolution Time", value: generateTime(18, 12, 'hrs') }, { name: "Pendency (Partner %)", value: `${generateRandomFloat(30, 10)}%`}, { name: "Pendency (Insurer %)", value: `${generateRandomFloat(40, 10)}%`}, ],
});

const mockData = {
    missionControl: {
        overallMetrics: [ { title: "Total GWP (MTD)", value: "₹9,12,60,000", trend: "+8.1%" }, { title: "Partner CSAT", value: "4.6 / 5", trend: "-0.1" }, { title: "Policy Issuance TAT", value: "2.1 Days", trend: "+0.2 Days" }, { title: "Renewal Rate (MTD)", value: "88.4%", trend: "+2.1%" }, ],
        teamHealth: [ { id: 'vrm_motor', name: "VRM Motor", status: "green", manager: "Priya Sharma", achievement: "112%" }, { id: 'vrm_health', name: "VRM Health", status: "green", manager: "Ankit Jain", achievement: "105%" }, { id: 'onboarding', name: "Partner Onboarding", status: "green", manager: "Neha Gupta", achievement: "99% SLA" }, { id: 'endorsement', name: "Endorsement", status: "amber", manager: "Rajesh Kumar", achievement: "93% TAT" }, { id: 'quotation', name: "Quotation Team", status: "red", manager: "Meera Desai", achievement: "88% TAT" }, { id: 'payout_tickets', name: "Payout Tickets", status: "green", manager: "Arun Verma", achievement: "97% TAT" }, { id: 'inbound_service', name: "Inbound Service Desk", status: "amber", manager: "Sanjay Mehta", achievement: "92% FCR" }, ],
    },
    vrm_motor: { teamName: "VRM Motor", filter: { label: "Team Lead", key: "teamLead", options: ["Priya Sharma", "Rohan Mehta"] }, members: Array.from({ length: 15 }).map((_, i) => ({ id: 100 + i, name: `Motor VRM ${i + 1}`, teamLead: i < 8 ? "Priya Sharma" : "Rohan Mehta", kpis: generateVrmKpis() })) },
    vrm_health: { teamName: "VRM Health", filter: { label: "Team Lead", key: "teamLead", options: ["Ankit Jain", "Sunita Reddy"] }, members: Array.from({ length: 16 }).map((_, i) => ({ id: 200 + i, name: `Health VRM ${i + 1}`, teamLead: i < 8 ? "Ankit Jain" : "Sunita Reddy", kpis: generateVrmKpis() })) },
    onboarding: { teamName: "Partner Onboarding", filter: { label: "Team Lead", key: "teamLead", options: ["Amit Kumar", "Sneha Patel"] }, members: Array.from({ length: 12 }).map((_, i) => ({ id: 300 + i, name: `Onboarding Exec ${i + 1}`, teamLead: i < 6 ? "Amit Kumar" : "Sneha Patel", kpis: generateOnboardingKpis() })) },
    endorsement: { teamName: "Endorsement Team", filter: { label: "Team Lead", key: "teamLead", options: ["Anjali Rao", "Suresh Menon"] }, members: Array.from({ length: 18 }).map((_, i) => ({ id: 400 + i, name: `Endorsement Spec. ${i + 1}`, teamLead: i < 9 ? "Anjali Rao" : "Suresh Menon", kpis: generateTicketingKpis('Endorsement') })) },
    quotation: { teamName: "Quotation Team", filter: { label: "Team Lead", key: "teamLead", options: ["Vikram Singh", "Pooja Jain"] }, members: Array.from({ length: 10 }).map((_, i) => ({ id: 500 + i, name: `Quotation Spec. ${i + 1}`, teamLead: i < 5 ? "Vikram Singh" : "Pooja Jain", kpis: generateTicketingKpis('Quotation') })) },
    payout_tickets: { teamName: "Payout Tickets", filter: { label: "Team Lead", key: "teamLead", options: ["Gaurav Sharma", "Divya Mehta"] }, members: Array.from({ length: 8 }).map((_, i) => ({ id: 600 + i, name: `Payout Spec. ${i + 1}`, teamLead: i < 4 ? "Gaurav Sharma" : "Divya Mehta", kpis: generateTicketingKpis('Payout') })) },
    inbound_service: { teamName: "Inbound Service Desk", filter: { label: "Team Lead", key: "teamLead", options: ["Kavita Singh", "Manish Paul", "Fatima Khan"] }, members: Array.from({ length: 25 }).map((_, i) => ({ id: 700 + i, name: `Service Desk Agent ${i + 1}`, teamLead: i < 9 ? "Kavita Singh" : i < 17 ? "Manish Paul" : "Fatima Khan", kpis: { output: [ { name: "Interactions Handled", value: `${generateRandomInt(500, 200)}` }, { name: "Tickets Created", value: `${generateRandomInt(50, 30)}` } ], quality: [ { name: "First Contact Resolution (FCR)", value: `${generateRandomFloat(85, 10)}%` }, { name: "Partner CSAT", value: `${generateRandomFloat(4.5, 0.4)}/5` } ], efficiency: [ { name: "Avg. Handle Time (AHT)", value: `${generateRandomInt(240, 120)}s` }, { name: "Escalation Rate", value: `${generateRandomFloat(8, 5)}%` } ] } })) },
};

// --- SVG ICONS ---
const Icon = ({ name, className }: { name: string, className: string }) => {
    const icons: { [key: string]: JSX.Element } = {
        dashboard: <path d="M10.75 4.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0V4.75zM5.25 10a.75.75 0 00-1.5 0v9.25a.75.75 0 001.5 0V10zM16.25 7a.75.75 0 00-1.5 0v12.25a.75.75 0 001.5 0V7z" />,
        users: <path d="M18 18.75h-12A2.25 2.25 0 013.75 16.5V6a2.25 2.25 0 012.25-2.25h12A2.25 2.25 0 0120.25 6v10.5A2.25 2.25 0 0118 18.75z" />,
        search: <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
        bell: <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
        xMark: <path d="M6 18L18 6M6 6l12 12" />,
        chevronDown: <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />,
        lightbulb: <path d="M12 18a.75.75 0 01-.75-.75V15.75a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75zM12 3.75A6.75 6.75 0 005.25 10.5c0 2.654 1.615 4.91 3.863 5.865a.75.75 0 00.774 0c2.248-.955 3.863-3.211 3.863-5.865A6.75 6.75 0 0012 3.75z" />,
        chart: <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-2.083m3.75 2.083V2.25m0 11.25c-1.026 0-2.047.162-3 .473" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>{icons[name] || icons.users}</svg>;
};

const Header = () => ( <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 sticky top-0 z-30"> <div className="flex items-center justify-between h-16"> <div className="flex items-center space-x-4"> <svg className="h-8 w-auto text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" /></svg> <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Performance Hub</h1> </div> <div className="flex items-center space-x-2 sm:space-x-4"> <div className="text-sm text-gray-500"> Last Updated: Sep 24, 2025, 11:51 AM </div> <button className="p-2 rounded-full hover:bg-gray-100 relative"><Icon name="bell" className="h-6 w-6 text-gray-500" /><span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span></button> <img className="h-9 w-9 rounded-full" src={`https://placehold.co/100x100/E2E8F0/4A5568?text=M`} alt="Manager Profile" /> </div> </div> </header> );
const NavigationBar = ({ activeView, onNavClick, teamNames }: { activeView: string, onNavClick: (view: string) => void, teamNames: any[] }) => ( <nav className="bg-white shadow-sm sticky top-16 z-30"><div className="px-4 sm:px-6 lg:px-8"><div className="flex space-x-2 sm:space-x-4 overflow-x-auto -mb-px h-12">{teamNames.map(team => (<button key={team.id} onClick={() => onNavClick(team.id)} className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${activeView === team.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Icon name={team.icon} className="h-5 w-5 mr-2" />{team.name}</button>))}</div></div></nav> );
const KPICard = ({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: string }) => ( <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-gray-500 truncate">{title}</p><p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p></div><div className="bg-blue-100 rounded-md p-2"><Icon name={icon} className="h-6 w-6 text-blue-600" /></div></div><p className={`text-sm mt-2 flex items-center ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</p></div> );
const MissionControlView = ({ data, onTeamClick }: { data: any, onTeamClick: (teamId: string) => void }) => {
    const getStatusColor = (status: string) => ({ green: 'bg-green-100 text-green-800', amber: 'bg-yellow-100 text-yellow-800', red: 'bg-red-100 text-red-800' }[status] || 'bg-gray-100 text-gray-800');
    return ( <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in"> <div><h2 className="text-2xl font-bold text-gray-800">Mission Control</h2><p className="text-gray-500 mt-1">High-level overview of the entire business operation.</p></div> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {data.overallMetrics.map((m: any) => <KPICard key={m.title} {...m} icon="chart" />)} </div> <div><h3 className="text-xl font-semibold text-gray-800 mb-4">Team Health Snapshot</h3><div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary KPI</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{data.teamHealth.map((team: any) => (<tr key={team.id} onClick={() => onTeamClick(team.id)} className="hover:bg-gray-50 cursor-pointer"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.manager}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{team.achievement}</td><td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(team.status)}`}>{team.status}</span></td></tr>))}</tbody></table></div></div> </div> );
};

const TeamPerformanceView = ({ teamData, onViewMember }: { teamData: any, onViewMember: (member: any, teamName: string) => void }) => {
    if (!teamData || !teamData.members || teamData.members.length === 0) return <div className="p-8 text-center text-gray-500 animate-fade-in">Data for this module is being prepared. Please check back later.</div>;
    
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filterConfig = teamData.filter;

    const filteredMembers = useMemo(() => {
        if (!filterConfig || selectedFilter === 'All') {
            return teamData.members;
        }
        return teamData.members.filter((member: any) => member[filterConfig.key] === selectedFilter);
    }, [selectedFilter, teamData]);
    
    const kpiHeaders = Object.keys(teamData.members[0].kpis);
    const categoryColors: {[key: string]: string} = { output: 'bg-blue-50', quality: 'bg-green-50', efficiency: 'bg-yellow-50' };

    return ( <div className="p-4 sm:p-6 lg:p-8 animate-fade-in"> <div className="flex flex-wrap justify-between items-center mb-6 gap-4"> <div><h2 className="text-2xl font-bold text-gray-800">{teamData.teamName}</h2><p className="text-gray-500 mt-1">Detailed performance metrics for each team member.</p></div> {filterConfig && ( <div className="relative"> <label htmlFor="team-filter" className="text-sm font-medium text-gray-500 mr-2">{filterConfig.label}:</label> <select id="team-filter" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"> <option value="All">All {filterConfig.label}s</option> {filterConfig.options.map((option: string) => ( <option key={option} value={option}>{option}</option> ))} </select> <Icon name="chevronDown" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /> </div> )} </div> <div className="overflow-x-auto shadow-sm border border-gray-200 sm:rounded-lg"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10" rowSpan={2}>Team Member</th>{kpiHeaders.map(category => (<th key={category} colSpan={teamData.members[0].kpis[category].length} className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l ${categoryColors[category]}`}>{category}</th>))}</tr><tr>{kpiHeaders.flatMap(category => teamData.members[0].kpis[category].map((kpi: any) => (<th key={kpi.name} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l ${categoryColors[category]}`} style={{minWidth: '160px'}}>{kpi.name}</th>)))}</tr></thead><tbody className="bg-white divide-y divide-gray-200">{filteredMembers.map((member: any) => (<tr key={member.id} className="hover:bg-gray-50"><td className="sticky left-0 bg-white hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer z-10" onClick={() => onViewMember(member, teamData.teamName)}>{member.name}</td>{kpiHeaders.flatMap(category => member.kpis[category].map((kpi: any) => (<td key={kpi.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-l">{kpi.value}</td>)))}</tr>))}</tbody></table></div> </div> );
};

const IndividualPerformanceModal = ({ member, teamName, onClose }: { member: any, teamName: string, onClose: () => void }) => {
    if (!member) return null;
    return ( <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"><div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"><div className="flex items-center justify-between p-4 border-b"><div><h3 className="text-xl font-bold text-gray-800">{member.name}</h3><p className="text-sm text-gray-500">{teamName}</p></div><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><Icon name="xMark" className="h-6 w-6 text-gray-500" /></button></div><div className="overflow-y-auto p-6 space-y-6"><div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-4 text-sm flex items-start space-x-3"><Icon name="lightbulb" className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" /><div><p className="font-semibold mb-1">Coaching Suggestion:</p><p>{`While ${member.name}'s MTD Business at ${member.kpis.output[5].value} is strong, the 'Active Partners Not Called' count is high at ${member.kpis.quality[3].value}. Suggest focusing on broadening partner outreach to ensure the entire portfolio is engaged, which could further boost GWP.`}</p></div></div><div><h4 className="font-semibold text-gray-700 mb-4">All Performance Parameters</h4><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">{Object.entries(member.kpis).map(([category, kpis]) => (<div key={category}><h5 className="text-sm font-semibold text-gray-500 uppercase mb-3 pb-1 border-b">{category}</h5><ul className="space-y-2">{(kpis as any[]).map((kpi: any) => (<li key={kpi.name} className="flex justify-between items-baseline text-sm"><span className="text-gray-600">{kpi.name}</span><span className={`font-medium text-gray-800`}>{kpi.value}</span></li>))}</ul></div>))}</div></div></div></div></div> );
};

export default function ServicePerformanceDashboard() {
  const [currentView, setCurrentView] = useState('missionControl');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTeamName, setSelectedTeamName] = useState('');
  
  const teamNavItems = useMemo(() => [
      { id: 'missionControl', name: 'Mission Control', icon: 'dashboard' },
      ...Object.keys(mockData).filter(key => key !== 'missionControl').map(key => ({ id: key, name: (mockData[key as keyof typeof mockData] as any).teamName, icon: 'users' }))
  ], []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <NavigationBar activeView={currentView} onNavClick={setCurrentView} teamNames={teamNavItems} />
      <main>
        {currentView === 'missionControl' && <MissionControlView data={mockData.missionControl} onTeamClick={setCurrentView} />}
        {currentView !== 'missionControl' && mockData[currentView as keyof typeof mockData] && <TeamPerformanceView teamData={mockData[currentView as keyof typeof mockData]} onViewMember={(m: any, t: string) => { setSelectedMember(m); setSelectedTeamName(t); }} />}
      </main>
      <IndividualPerformanceModal member={selectedMember} teamName={selectedTeamName} onClose={() => setSelectedMember(null)} />
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
