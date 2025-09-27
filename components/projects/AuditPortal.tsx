
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown, Filter, Sparkles, FileText, FileSpreadsheet, XCircle, Search } from 'lucide-react';
import { generateJsonFromPrompt } from '../../services/geminiService';

declare global {
    interface Window {
        XLSX: any;
        jsPDF: any;
    }
}

// Define the audit structure and parameters from the document
const AUDIT_STRUCTURE = {
  'A': { name: 'Quote Quality', weight: 0.20, parameters: [{ name: 'Premium Calculation Accuracy', criticality: 'High' }, { name: 'Application of Insurer UW Guidelines', criticality: 'High' }, { name: 'Mandatory Details Captured', criticality: 'High' }, { name: 'Clarity in Terms & Conditions', criticality: 'High' }, { name: 'Coverage Requested vs Quoted', criticality: 'High' }] },
  'B': { name: 'Policy Data Entry Quality', weight: 0.20, parameters: [{ name: 'Insured Details Accuracy', criticality: 'High' }, { name: 'Sum Insured Accuracy', criticality: 'High' }, { name: 'Premium Accuracy', criticality: 'High' }, { name: 'Coverage & Occupancy Accuracy', criticality: 'High' }, { name: 'No Duplicate/Missing Values', criticality: 'High' }] },
  'C': { name: 'System Updation', weight: 0.10, parameters: [{ name: 'Premium and related information', criticality: 'Medium' }, { name: 'Approvals & Documents Uploaded', criticality: 'Medium' }, { name: 'Status Updated Correctly', criticality: 'Medium' }, { name: 'Timely updation', criticality: 'Medium' }] },
  'D': { name: 'Coverage Alignment', weight: 0.20, parameters: [{ name: 'Coverage Asked vs Provided', criticality: 'High' }, { name: 'Deviation Documented', criticality: 'High' }, { name: 'Insurer Approvals', criticality: 'High' }, { name: 'Endorsements Aligned with UW', criticality: 'High' }] },
  'E': { name: 'Process & Compliance', weight: 0.20, parameters: [{ name: 'KYC/AML Checks', criticality: 'Critical' }, { name: 'Mandate Procurement & Upload', criticality: 'Critical' }, { name: 'Revenue & Deal Updation', criticality: 'Critical' }, { name: 'Reports Updation', criticality: 'Critical' }] },
  'F': { name: 'Communication', weight: 0.10, parameters: [{ name: 'Called to Partner', criticality: 'Medium' }, { name: 'Professional Language', criticality: 'Medium' }, { name: 'Response Timeliness', criticality: 'Medium' }, { name: 'OTE Creation post discussion', criticality: 'Medium' }] },
};

const PIE_COLORS = { 'Critical (<60%)': '#ef4444', 'Medium (60-74%)': '#f59e0b', 'High (>=75%)': '#22c55e' };

// Main App component
const AuditPortal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState('audit'); // 'audit', 'history', 'analytics'
  const [caseData, setCaseData] = useState<any | null>(null);
  const [uploadedCases, setUploadedCases] = useState<any[]>([]);
  const [auditorName, setAuditorName] = useState('Anjali Sharma');
  const [scores, setScores] = useState<any>({});
  const [isCommunicationNA, setIsCommunicationNA] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [auditedCaseMap, setAuditedCaseMap] = useState<any>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [geminiInsights, setGeminiInsights] = useState<any | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterEbType, setFilterEbType] = useState('');
  const [filterAssignedTo, setFilterAssignedTo] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [selectedAssignedTo, setSelectedAssignedTo] = useState('');
  const [analyticsData, setAnalyticsData] = useState({ sectionAverages: [], scoreDistribution: [], auditorPerformance: [], monthlyAudits: [] });

  const getEffectiveWeights = useMemo(() => {
    if (isCommunicationNA) {
      const remainingWeight = 1.0 - AUDIT_STRUCTURE['F'].weight;
      const otherSectionsTotalWeight = Object.values(AUDIT_STRUCTURE).filter(s => s.name !== 'Communication').reduce((sum, s) => sum + s.weight, 0);
      const effectiveWeights: { [key: string]: number } = {};
      for (const key in AUDIT_STRUCTURE) {
        if (key === 'F') {
          effectiveWeights[key] = 0;
        } else {
          effectiveWeights[key] = (AUDIT_STRUCTURE[key as keyof typeof AUDIT_STRUCTURE].weight / otherSectionsTotalWeight) * remainingWeight;
        }
      }
      return effectiveWeights;
    } else {
      const weights: { [key: string]: number } = {};
      for (const key in AUDIT_STRUCTURE) {
        weights[key] = AUDIT_STRUCTURE[key as keyof typeof AUDIT_STRUCTURE].weight;
      }
      return weights;
    }
  }, [isCommunicationNA]);

  const uniqueAssignedTos = useMemo(() => [...new Set(history.map(c => c.assignedTo))].filter(Boolean).sort(), [history]);

  const filteredHistory = useMemo(() => {
    let audits = history;
    if (selectedAssignedTo) {
      audits = audits.filter(audit => audit.assignedTo === selectedAssignedTo);
    }
    if (historySearchTerm) {
      const lowercasedTerm = historySearchTerm.toLowerCase();
      audits = audits.filter(audit => audit.oteNo?.toLowerCase().includes(lowercasedTerm) || audit.customerName?.toLowerCase().includes(lowercasedTerm));
    }
    return audits;
  }, [history, selectedAssignedTo, historySearchTerm]);

  const calculateAnalytics = useCallback((audits: any[]) => {
    if (audits.length === 0) {
      setAnalyticsData({ sectionAverages: [], scoreDistribution: [], auditorPerformance: [], monthlyAudits: [] });
      return;
    }

    const sectionTotals: { [key: string]: number } = {};
    const sectionCounts: { [key: string]: number } = {};
    const monthlyData: { [key: string]: { count: number; totalScore: number } } = {};
    const auditorTotals: { [key: string]: number } = {};
    const auditorCounts: { [key: string]: number } = {};

    audits.forEach(audit => {
      const weights = audit.isCommunicationNA ? getEffectiveWeights : Object.fromEntries(Object.entries(AUDIT_STRUCTURE).map(([key, val]) => [key, val.weight]));

      if (audit.scores) {
        for (const sectionKey in AUDIT_STRUCTURE) {
          if ((weights[sectionKey] || 0) > 0) {
            const sectionParams = AUDIT_STRUCTURE[sectionKey as keyof typeof AUDIT_STRUCTURE].parameters;
            const scoredParams = sectionParams.filter(p => audit.scores[sectionKey]?.[p.name] != null);
            if (scoredParams.length > 0) {
              const sectionTotal = scoredParams.reduce((sum, param) => sum + ((audit.scores[sectionKey][param.name] / 5) * 100), 0);
              const sectionAverage = sectionTotal / scoredParams.length;
              sectionTotals[sectionKey] = (sectionTotals[sectionKey] || 0) + sectionAverage;
              sectionCounts[sectionKey] = (sectionCounts[sectionKey] || 0) + 1;
            }
          }
        }
      }

      if (audit.timestamp) {
        const date = new Date(audit.timestamp);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;
        if (!monthlyData[monthYear]) monthlyData[monthYear] = { count: 0, totalScore: 0 };
        monthlyData[monthYear].count++;
        monthlyData[monthYear].totalScore += audit.grandTotal || 0;
      }

      const auditor = audit.auditor || 'Unknown';
      if (!auditorTotals[auditor]) {
        auditorTotals[auditor] = 0;
        auditorCounts[auditor] = 0;
      }
      auditorTotals[auditor] += audit.grandTotal || 0;
      auditorCounts[auditor]++;
    });

    const sectionAverages = Object.keys(AUDIT_STRUCTURE).map(key => ({
      name: AUDIT_STRUCTURE[key as keyof typeof AUDIT_STRUCTURE].name,
      average: sectionCounts[key] > 0 ? sectionTotals[key] / sectionCounts[key] : 0,
    }));

    const monthlyAudits = Object.keys(monthlyData).map(key => ({ name: key, count: monthlyData[key].count, averageScore: monthlyData[key].count > 0 ? monthlyData[key].totalScore / monthlyData[key].count : 0 })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    const scoreRanges = { 'Critical (<60%)': 0, 'Medium (60-74%)': 0, 'High (>=75%)': 0 };
    audits.forEach(audit => {
      if (audit.grandTotal >= 75) scoreRanges['High (>=75%)']++;
      else if (audit.grandTotal >= 60) scoreRanges['Medium (60-74%)']++;
      else scoreRanges['Critical (<60%)']++;
    });
    const scoreDistribution = Object.keys(scoreRanges).map(name => ({ name, value: scoreRanges[name as keyof typeof scoreRanges] }));
    const auditorPerformance = Object.keys(auditorTotals).map(name => ({ name, averageScore: auditorCounts[name] > 0 ? auditorTotals[name] / auditorCounts[name] : 0 }));
    setAnalyticsData({ sectionAverages, scoreDistribution, auditorPerformance, monthlyAudits });
  }, [getEffectiveWeights]);

    useEffect(() => {
        calculateAnalytics(history);
    }, [history, calculateAnalytics]);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length <= 1) { setUploadedCases([]); setLoading(false); return; }

      const headers = lines[0].split(',').map(h => h.trim());
      const newCases = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const caseObj: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          if (header.includes('S.No')) caseObj.serialNo = values[index];
          if (header.includes('OTE Date')) caseObj.oteDate = values[index];
          if (header.includes('OTE No.')) caseObj.oteNo = values[index];
          if (header.includes('Customer Name')) caseObj.customerName = values[index];
          if (header.includes('Product')) caseObj.product = values[index];
          if (header.includes('EB/NON EB/VPM')) caseObj.ebType = values[index];
          if (header.includes('Assigned to')) caseObj.assignedTo = values[index];
          if (header.includes('Auditor')) caseObj.auditorName = values[index];
        });
        return caseObj;
      });
      setUploadedCases(newCases);
      setLoading(false);
    };
    reader.onerror = () => { setError('Failed to read the file.'); setLoading(false); };
    reader.readAsText(file);
  };

  const handleCaseSelection = (caseDetails: any) => {
    setCaseData(caseDetails);
    setScores({});
    setIsCommunicationNA(false);
    setGeminiInsights(null);
    setError(null);
    setAuditorName(caseDetails.auditorName || 'Anjali Sharma');
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredCases = useMemo(() => uploadedCases.filter(c =>
    (!filterProduct || c.product === filterProduct) &&
    (!filterEbType || c.ebType === filterEbType) &&
    (!filterAssignedTo || c.assignedTo === filterAssignedTo)
  ), [uploadedCases, filterProduct, filterEbType, filterAssignedTo]);

  const sortedCases = useMemo(() => [...filteredCases].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey] || '';
    const bValue = b[sortKey] || '';
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }), [filteredCases, sortKey, sortDirection]);

  const uniqueProducts = useMemo(() => [...new Set(uploadedCases.map(c => c.product))].filter(Boolean), [uploadedCases]);
  const uniqueEbTypes = useMemo(() => [...new Set(uploadedCases.map(c => c.ebType))].filter(Boolean), [uploadedCases]);
  const uniqueAssignedTosFromUpload = useMemo(() => [...new Set(uploadedCases.map(c => c.assignedTo))].filter(Boolean), [uploadedCases]);

  const handleScoreChange = (sectionId: string, parameterName: string, value: string) => {
    setScores(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [parameterName]: value === '' ? null : parseFloat(value) }
    }));
  };

  const calculateSectionTotal = useCallback((sectionId: string) => {
    const sectionData = AUDIT_STRUCTURE[sectionId as keyof typeof AUDIT_STRUCTURE];
    if (!sectionData) return 0;
    const sectionScores = scores[sectionId] || {};
    const scoredParameters = sectionData.parameters.filter(p => sectionScores[p.name] != null);
    if (scoredParameters.length === 0) return 0;
    const totalScore = scoredParameters.reduce((sum, p) => sum + (sectionScores[p.name] / 5) * 100, 0);
    return totalScore / scoredParameters.length;
  }, [scores]);

  const calculateWeightedScore = useCallback((sectionId: string) => {
    const effectiveWeights = getEffectiveWeights;
    const sectionTotal = calculateSectionTotal(sectionId);
    return sectionTotal * (effectiveWeights[sectionId] || 0);
  }, [calculateSectionTotal, getEffectiveWeights]);

  const grandTotal = useMemo(() => {
    let total = 0;
    for (const sectionId in AUDIT_STRUCTURE) {
      total += calculateWeightedScore(sectionId);
    }
    return total;
  }, [calculateWeightedScore]);


  const getColorAndSmiley = (total: number) => {
    if (total >= 75) return { color: 'green-500', smiley: '😊' };
    if (total >= 60) return { color: 'amber-500', smiley: '😐' };
    return { color: 'red-500', smiley: '😞' };
  };

  const { color: totalColor, smiley: totalSmiley } = getColorAndSmiley(grandTotal);

  const handleSaveAudit = async () => {
    if (!auditorName || !caseData) { setError('Auditor name and case data are required.'); return; }
    setIsSaving(true);
    setError(null);
    try {
      const newAuditDoc = {
        id: `audit-${Date.now()}`,
        ...caseData,
        auditor: auditorName,
        scores,
        grandTotal,
        isCommunicationNA,
        timestamp: new Date().toISOString(),
      };
      
      const updatedHistory = [newAuditDoc, ...history];
      setHistory(updatedHistory);
      const newMap = { ...auditedCaseMap, [caseData.oteNo]: true };
      setAuditedCaseMap(newMap);
      
      setShowSuccessModal(true);
      setCaseData(null);
      setScores({});
    } catch (e: any) {
      console.error("Error saving document: ", e);
      setError(`Failed to save audit data. Error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const generateAuditInsights = async () => {
    if (!caseData || Object.keys(scores).length === 0) {
      setError('Please complete the audit before generating insights.'); return;
    }
    setIsGeneratingInsights(true);
    setGeminiInsights(null);
    setError(null);
    const prompt = `Act as a senior audit manager. Analyze the following audit report and generate a professional, concise JSON response with a 'summary' paragraph and an array of 'recommendations'. Focus on actionable feedback for the auditor.
    Case: ${caseData.oteNo}, Customer: ${caseData.customerName}, Auditor: ${auditorName}, Final Score: ${grandTotal.toFixed(2)}%
    Section Weights: ${Object.entries(getEffectiveWeights).map(([k, w]) => `${AUDIT_STRUCTURE[k as keyof typeof AUDIT_STRUCTURE].name}: ${w*100}%`).join(', ')}
    Scores: ${Object.entries(scores).map(([secKey, secScores]) => {
      const secName = AUDIT_STRUCTURE[secKey as keyof typeof AUDIT_STRUCTURE].name;
      const secAvg = calculateSectionTotal(secKey).toFixed(2);
      const params = Object.entries(secScores).map(([p, s]) => `${p}: ${s}/5`).join(', ');
      return `- ${secName} (Avg: ${secAvg}%): ${params}`;
    }).join('\n')}`;

    try {
        const insights = await generateJsonFromPrompt(prompt);
        if(insights) {
            setGeminiInsights(insights);
        } else {
            throw new Error('No content returned from API.');
        }
    } catch (e: any) {
      console.error('Gemini API call failed:', e);
      setError(`Failed to generate insights. Error: ${e.message}`);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleDownloadExcel = useCallback(() => {
    if (typeof window.XLSX === 'undefined') {
      setError("Report generation library is not loaded. Please check your internet connection and try again.");
      return;
    }
    if (!selectedAssignedTo || filteredHistory.length === 0) {
      setError("Select an employee with audits to download."); return;
    }
    const data = filteredHistory.map(audit => ({
      'OTE Date': audit.oteDate, 'OTE No.': audit.oteNo, 'Customer Name': audit.customerName,
      'Product': audit.product, 'Auditor': audit.auditor, 'Assigned To': audit.assignedTo,
      'Grand Total Score (%)': audit.grandTotal.toFixed(2),
      'Audit Date': audit.timestamp ? new Date(audit.timestamp).toLocaleDateString() : 'N/A',
      'Communication N/A': audit.isCommunicationNA ? 'Yes' : 'No',
    }));
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Audit Report");
    window.XLSX.writeFile(wb, `${selectedAssignedTo}_Audit_Report.xlsx`);
  }, [selectedAssignedTo, filteredHistory]);

  const handleDownloadPdf = useCallback(() => {
    if (typeof window.jsPDF === 'undefined' || typeof window.jsPDF.autoTable === 'undefined') {
       setError("Report generation library is not loaded. Please check your internet connection and try again.");
       return;
    }
    if (!selectedAssignedTo || filteredHistory.length === 0) {
      setError("Select an employee with audits to download."); return;
    }
    const doc = new window.jsPDF();
    doc.setFontSize(18); doc.text(`Audit Report for ${selectedAssignedTo}`, 10, 20);
    doc.setFontSize(12); doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 30);
    const headers = [['OTE Date', 'OTE No.', 'Customer', 'Product', 'Score (%)', 'Comm. N/A']];
    const data = filteredHistory.map(a => [a.oteDate, a.oteNo, a.customerName, a.product, a.grandTotal.toFixed(2), a.isCommunicationNA ? 'Yes' : 'No']);
    doc.autoTable({ head: headers, body: data, startY: 40, theme: 'grid' });
    doc.save(`${selectedAssignedTo}_Audit_Report.pdf`);
  }, [selectedAssignedTo, filteredHistory]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6"><div className="text-xl text-gray-700">Loading...</div></div>;

  return (
      <div className="bg-gray-50 font-sans min-h-screen p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-6 sm:p-8 space-y-8">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Audit Portal</h1>
            <nav className="flex space-x-2 mt-4 sm:mt-0">
              {['audit', 'history', 'analytics'].map(v => (
                <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-xl font-semibold transition duration-300 capitalize ${view === v ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{v}</button>
              ))}
            </nav>
          </header>

          {error && (
            <div className="flex items-center justify-between p-4 bg-red-100 text-red-700 rounded-xl shadow-inner border border-red-200">
              <div className="flex items-center"><XCircle className="h-5 w-5 mr-2" /><span className="font-medium">{error}</span></div>
              <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 transition-colors duration-200">Dismiss</button>
            </div>
          )}

          {view === 'audit' && (
            <>
              {!caseData ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-700">Upload Audit Data</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <label htmlFor="file-upload" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-purple-300 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100 transition duration-300">
                      <span className="text-purple-600 font-medium">Click to upload CSV file</span>
                      <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                    </label>
                    <div>
                        <label htmlFor="auditor-name" className="text-sm font-medium text-gray-700 mb-1 block">Auditor Name</label>
                        <input id="auditor-name" type="text" placeholder="Enter Auditor Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500" value={auditorName} onChange={(e) => setAuditorName(e.target.value)} required />
                    </div>
                  </div>
                  {uploadedCases.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-700">Filter and Select a Case</h3>
                      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gray-100 shadow-inner">
                        <Filter className="text-gray-500" />
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500" value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
                            <option value="">All Products</option>
                            {uniqueProducts.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500" value={filterEbType} onChange={(e) => setFilterEbType(e.target.value)}>
                            <option value="">All Types</option>
                            {uniqueEbTypes.map(eb => <option key={eb} value={eb}>{eb}</option>)}
                          </select>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500" value={filterAssignedTo} onChange={(e) => setFilterAssignedTo(e.target.value)}>
                            <option value="">All Assignees</option>
                            {uniqueAssignedTosFromUpload.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-6 gap-4 bg-purple-600 text-white p-4 rounded-xl shadow-inner text-sm font-semibold min-w-[700px]">
                          {['oteDate', 'oteNo', 'customerName', 'product', 'assignedTo'].map(key => (
                            <span key={key} className="cursor-pointer flex items-center capitalize" onClick={() => handleSort(key)}>{key.replace(/([A-Z])/g, ' $1').trim()}{sortKey === key && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}</span>
                          ))}
                          <span>Status</span>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
                          {sortedCases.length > 0 ? (
                            sortedCases.map((c, index) => (
                              <div key={index} className={`grid grid-cols-6 gap-4 p-4 rounded-xl shadow-sm text-sm cursor-pointer transition duration-200 min-w-[700px] ${auditedCaseMap[c.oteNo] ? 'bg-gray-200 text-gray-500' : 'bg-white hover:bg-gray-100'}`} onClick={() => !auditedCaseMap[c.oteNo] && handleCaseSelection(c)}>
                                <span className="truncate">{c.oteDate}</span> <span className="truncate">{c.oteNo}</span> <span className="truncate">{c.customerName}</span>
                                <span className="truncate">{c.product}</span> <span className="truncate">{c.assignedTo}</span> <span>{auditedCaseMap[c.oteNo] ? 'Audited' : 'Pending'}</span>
                              </div>
                            ))
                          ) : <div className="text-center text-gray-500 p-8 border border-dashed rounded-xl">No cases match filters.</div>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="p-6 bg-purple-50 border border-purple-200 rounded-2xl shadow-inner">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">Case Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">
                      <p><strong>OTE Date:</strong> {caseData.oteDate}</p> <p><strong>OTE No.:</strong> {caseData.oteNo}</p>
                      <p><strong>Customer:</strong> {caseData.customerName}</p> <p><strong>Product:</strong> {caseData.product}</p>
                      <p className="col-span-1"><strong>Assigned To:</strong> {caseData.assignedTo}</p>
                      <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Auditor Name</label>
                        <input type="text" value={auditorName} onChange={(e) => setAuditorName(e.target.value)} placeholder="Enter auditor name" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"/>
                      </div>
                    </div>
                  </div>

                  {Object.entries(AUDIT_STRUCTURE).map(([sectionId, { name, parameters }]) => (
                    <div key={sectionId} className="p-6 bg-gray-100 rounded-2xl shadow-inner">
                      <h3 className="text-xl font-bold text-gray-700 mb-2">{name}</h3>
                      {sectionId === 'F' && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4"><input type="checkbox" id="comm-na" checked={isCommunicationNA} onChange={(e) => setIsCommunicationNA(e.target.checked)} /><label htmlFor="comm-na">Mark as Not Applicable (N/A)</label></div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {parameters.map(({ name: paramName }) => (
                          <div key={paramName} className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">{paramName}</label>
                            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300 disabled:bg-gray-200" value={scores[sectionId]?.[paramName] ?? ''} onChange={(e) => handleScoreChange(sectionId, paramName, e.target.value)} disabled={isCommunicationNA && sectionId === 'F'}>
                              <option value="" disabled>Select Score</option>
                              {[0, 1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="p-6 rounded-2xl border-4 border-dashed border-purple-200 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">Grand Total Score: <span className={`text-${totalColor}`}>{grandTotal.toFixed(2)}% {totalSmiley}</span></h3>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button onClick={handleSaveAudit} className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition duration-300 shadow-lg disabled:opacity-50" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Audit'}
                    </button>
                    <button onClick={generateAuditInsights} className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50" disabled={isGeneratingInsights}><Sparkles size={20} />{isGeneratingInsights ? 'Generating...' : 'Generate AI Insights'}</button>
                    <button onClick={() => setCaseData(null)} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition duration-300">Cancel</button>
                  </div>

                  {geminiInsights && (
                    <div className="mt-8 p-6 bg-white border border-gray-300 rounded-2xl shadow-xl"><h4 className="text-xl font-bold text-gray-800 mb-4">Gemini AI Insights</h4><div className="space-y-4"><h5 className="font-semibold text-gray-700">Summary:</h5><p className="text-gray-600">{geminiInsights.summary}</p><h5 className="font-semibold text-gray-700">Recommendations:</h5><ul className="list-disc list-inside text-gray-600">{geminiInsights.recommendations.map((rec: string, index: number) => <li key={index}>{rec}</li>)}</ul></div></div>
                  )}
                </div>
              )}
            </>
          )}

          {view === 'history' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-700">Audit History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Report for:</span>
                  <select className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500" value={selectedAssignedTo} onChange={(e) => setSelectedAssignedTo(e.target.value)}>
                    <option value="">Select Employee</option>
                    {uniqueAssignedTos.map(auditor => <option key={auditor} value={auditor}>{auditor}</option>)}
                  </select>
                  <button onClick={handleDownloadExcel} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50" disabled={!selectedAssignedTo}><FileSpreadsheet size={16} /> Excel</button>
                  <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition duration-300 disabled:opacity-50" disabled={!selectedAssignedTo}><FileText size={16} /> PDF</button>
                </div>
                 <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" placeholder="Search by OTE No. or Customer..." value={historySearchTerm} onChange={(e) => setHistorySearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-500"/>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 bg-purple-600 text-white p-4 rounded-xl shadow-inner text-sm font-semibold min-w-[600px]">
                  <span>Date</span> <span>OTE No.</span> <span>Customer Name</span> <span>Auditor</span> <span>Score</span>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map(audit => (
                      <div key={audit.id} className="grid grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-sm text-sm min-w-[600px]">
                        <span className="truncate">{audit.timestamp ? new Date(audit.timestamp).toLocaleDateString() : 'N/A'}</span>
                        <span className="truncate">{audit.oteNo}</span> <span className="truncate">{audit.customerName}</span> <span className="truncate">{audit.auditor}</span>
                        <span className={`font-semibold text-${getColorAndSmiley(audit.grandTotal).color}`}>{audit.grandTotal.toFixed(2)}%</span>
                      </div>
                    ))
                  ) : <div className="text-center text-gray-500 p-8 border border-dashed rounded-xl">No audit history found.</div>}
                </div>
              </div>
            </div>
          )}

          {view === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-700">Audit Analytics</h2>
              {history.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 bg-white rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Score Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={analyticsData.scoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                          {analyticsData.scoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                   <div className="p-6 bg-white rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Auditor Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.auditorPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" /> <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        <Bar dataKey="averageScore" fill="#82ca9d" name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-lg lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Average Scores by Section</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.sectionAverages} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        <Bar dataKey="average" fill="#8884d8" name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : <div className="text-center text-gray-500 p-8 border border-dashed rounded-xl">No audit data to generate analytics.</div>}
            </div>
          )}
        </div>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
              <p className="text-xl font-bold text-gray-800">Audit Saved!</p>
              <p className="mt-2 text-gray-600">Your audit data has been successfully saved.</p>
              <button onClick={() => setShowSuccessModal(false)} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">OK</button>
            </div>
          </div>
        )}
      </div>
  );
};

export default AuditPortal;
