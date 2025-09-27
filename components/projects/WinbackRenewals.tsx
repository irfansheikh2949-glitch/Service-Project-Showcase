
// NOTE: This component uses Font Awesome classes (e.g., 'fas fa-users'). 
// Ensure Font Awesome is loaded, for example, via a CDN link in your main HTML file.
import React, { useState, useRef, useEffect } from 'react';

// --- Mock Data ---
const initialLeadsData = [
    // Existing Leads
    { id: 1, agent: 'Rohan Sharma', name: 'Priya Singh', phone: '+91 98765 43210', vehicle: 'Maruti Swift', regNo: 'DL1C AB1234', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-08-12', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 12500, sourceType: 'new', status: 'WIP' },
    { id: 2, agent: 'Anjali Mehta', name: 'Amit Kumar', phone: '+91 99887 76655', vehicle: 'Hyundai i20', regNo: 'MH12 PQ7890', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-09-05', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 9800, sourceType: 'abandoned', status: 'Follow-up' },
    { id: 3, agent: 'Rohan Sharma', name: 'Sunita Devi', phone: '+91 87654 12345', vehicle: 'Honda City', regNo: 'UP32 XY9876', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-08-20', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'KYC Done', 'Payment', 'Issued'], ape: 15200, sourceType: 'new', status: 'Converted', newPolicy: { number: 'POL2025XYZ789', startDate: '2025-08-21', endDate: '2026-08-20' } },
    { id: 4, agent: 'Anjali Mehta', name: 'Rajesh Gupta', phone: '+91 91234 56789', vehicle: 'Kia Seltos', regNo: 'HR26 ZK5544', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-10-15', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 18000, sourceType: 'new', status: 'Converted' },
    { id: 5, agent: 'Rohan Sharma', name: 'Vikas Mehra', phone: '+91 88776 11223', vehicle: 'Tata Nexon', regNo: 'DL5C BA4321', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Go Digit', policyEndDate: '2025-08-15', creationDate: '2025-08-06', progress: ['Quote'], ape: 11500, sourceType: 'abandoned', status: 'Closed' },
    { id: 6, agent: 'Anjali Mehta', name: 'Pooja Verma', phone: '+91 77665 54433', vehicle: 'Toyota Fortuner', regNo: 'PB10 AB1122', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-08-25', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'Payment'], ape: 25000, sourceType: 'new', status: 'WIP' },
    { id: 7, agent: 'Rohan Sharma', name: 'Kavita Reddy', phone: '+91 98765 11111', vehicle: 'MG Hector', regNo: 'KA05 MN4567', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-08-30', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done', 'Payment Failed'], ape: 19500, sourceType: 'new', status: 'Tech Issue' },
    { id: 8, agent: 'Rohan Sharma', name: 'Sandeep Singh', phone: '+91 95555 12345', vehicle: 'Mahindra XUV700', regNo: 'CH01 CD7890', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-09-10', creationDate: '2025-08-07', progress: ['Quote', 'Proposal'], ape: 22000, sourceType: 'new', status: 'Follow-up' },
    { id: 9, agent: 'Anjali Mehta', name: 'Neha Sharma', phone: '+91 98888 54321', vehicle: 'Hyundai Creta', regNo: 'RJ14 EF1234', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-08-11', creationDate: '2025-08-08', progress: ['Quote'], ape: 14000, sourceType: 'new', status: 'WIP' },
    { id: 10, agent: 'Rohan Sharma', name: 'Arun Patel', phone: '+91 97777 98765', vehicle: 'Volkswagen Virtus', regNo: 'GJ01 KL5678', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'Go Digit', policyEndDate: '2025-11-01', creationDate: '2025-08-06', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 16500, sourceType: 'abandoned', status: 'WIP' },
    { id: 11, agent: 'Anjali Mehta', name: 'Deepika Iyer', phone: '+91 96666 11223', vehicle: 'Skoda Slavia', regNo: 'TN07 PQ9876', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-08-14', creationDate: '2025-08-05', progress: ['Quote', 'Proposal', 'Payment Failed'], ape: 17000, sourceType: 'new', status: 'Tech Issue' },
    { id: 12, agent: 'Rohan Sharma', name: 'Mahesh Babu', phone: '+91 95555 67890', vehicle: 'Tata Harrier', regNo: 'AP28 DH5432', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Tata AIG', policyEndDate: '2025-08-09', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 21000, sourceType: 'new', status: 'WIP' },
    { id: 13, agent: 'Anjali Mehta', name: 'Zoya Khan', phone: '+91 94444 12345', vehicle: 'Jeep Compass', regNo: 'DL3C AA1122', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-12-25', creationDate: '2025-08-07', progress: ['Quote'], ape: 23500, sourceType: 'new', status: 'Closed' },
    { id: 14, agent: 'Rohan Sharma', name: 'Harish Kumar', phone: '+91 93333 98765', vehicle: 'Renault Kiger', regNo: 'WB02 AC5678', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-09-20', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 11000, sourceType: 'abandoned', status: 'Follow-up' },
    { id: 15, agent: 'Anjali Mehta', name: 'Ishita Singh', phone: '+91 92222 11223', vehicle: 'Nissan Magnite', regNo: 'MH14 GH1234', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-10-30', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 10500, sourceType: 'new', status: 'Converted' },
    { id: 16, agent: 'Rohan Sharma', name: 'Gaurav Sharma', phone: '+91 91111 22222', vehicle: 'Maruti Baleno', regNo: 'DL1A BC2345', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-08-18', creationDate: '2025-08-08', progress: ['Quote'], ape: 8500, sourceType: 'new', status: 'WIP' },
    { id: 17, agent: 'Anjali Mehta', name: 'Fatima Sheikh', phone: '+91 92222 33333', vehicle: 'Honda Amaze', regNo: 'MH02 DE3456', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-09-12', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 9200, sourceType: 'new', status: 'Follow-up' },
    { id: 18, agent: 'Rohan Sharma', name: 'Vikram Rathore', phone: '+91 93333 44444', vehicle: 'Mahindra Thar', regNo: 'RJ14 FG4567', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-10-01', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'KYC Done', 'Payment', 'Issued'], ape: 28000, sourceType: 'new', status: 'Converted' },
    { id: 19, agent: 'Anjali Mehta', name: 'Riya Sen', phone: '+91 94444 55555', vehicle: 'Kia Sonet', regNo: 'KA03 GH5678', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-08-28', creationDate: '2025-08-08', progress: ['Quote'], ape: 13500, sourceType: 'abandoned', status: 'Closed' },
    { id: 20, agent: 'Rohan Sharma', name: 'Suresh Menon', phone: '+91 95555 66666', vehicle: 'Tata Punch', regNo: 'KL07 IJ6789', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-11-15', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment Failed'], ape: 10200, sourceType: 'new', status: 'Tech Issue' },
    { id: 21, agent: 'Anjali Mehta', name: 'Ananya Das', phone: '+91 96666 77777', vehicle: 'Maruti Wagon R', regNo: 'OR02 KL7890', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-08-13', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 7800, sourceType: 'new', status: 'WIP' },
    { id: 22, agent: 'Rohan Sharma', name: 'Balaji Venkat', phone: '+91 97777 88888', vehicle: 'Hyundai Venue', regNo: 'TN22 MN8901', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-09-22', creationDate: '2025-08-06', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 11800, sourceType: 'new', status: 'Follow-up' },
    { id: 23, agent: 'Anjali Mehta', name: 'Christina George', phone: '+91 98888 99999', vehicle: 'Ford Ecosport', regNo: 'DL08 OP9012', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-10-10', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 14800, sourceType: 'new', status: 'Converted' },
    { id: 24, agent: 'Rohan Sharma', name: 'Imran Ali', phone: '+91 99999 00000', vehicle: 'Renault Triber', regNo: 'UP16 QR0123', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-08-21', creationDate: '2025-08-07', progress: ['Quote'], ape: 9500, sourceType: 'abandoned', status: 'Closed' },
    { id: 25, agent: 'Anjali Mehta', name: 'Jaspreet Kaur', phone: '+91 91234 12345', vehicle: 'MG Astor', regNo: 'PB11 ST1234', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-11-20', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 18500, sourceType: 'new', status: 'WIP' },
    { id: 26, agent: 'Rohan Sharma', name: 'Nikhil Trivedi', phone: '+91 92345 23456', vehicle: 'Skoda Kushaq', regNo: 'GJ03 UV2345', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-08-19', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 19000, sourceType: 'new', status: 'Follow-up' },
    { id: 27, agent: 'Anjali Mehta', name: 'Parul Joshi', phone: '+91 93456 34567', vehicle: 'Tata Tiago', regNo: 'MH12 WX3456', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-09-30', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment Failed'], ape: 8800, sourceType: 'new', status: 'Tech Issue' },
    { id: 28, agent: 'Rohan Sharma', name: 'Rohit Verma', phone: '+91 94567 45678', vehicle: 'Maruti Celerio', regNo: 'HR26 YZ4567', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-10-05', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 7200, sourceType: 'new', status: 'Converted' },
    { id: 29, agent: 'Anjali Mehta', name: 'Shalini Gupta', phone: '+91 95678 56789', vehicle: 'Hyundai Grand i10', regNo: 'DL10 AB5678', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-08-29', creationDate: '2025-08-06', progress: ['Quote'], ape: 9000, sourceType: 'abandoned', status: 'Closed' },
    { id: 30, agent: 'Rohan Sharma', name: 'Tanmay Bhatt', phone: '+91 96789 67890', vehicle: 'Toyota Glanza', regNo: 'KA05 BC6789', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-12-01', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 11200, sourceType: 'new', status: 'WIP' },
    { id: 31, agent: 'Anjali Mehta', name: 'Urvashi Raut', phone: '+91 97890 78901', vehicle: 'Honda Jazz', regNo: 'MH04 CD7890', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-08-16', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 10800, sourceType: 'new', status: 'Follow-up' },
    { id: 32, agent: 'Rohan Sharma', name: 'Vivek Oberoi', phone: '+91 98901 89012', vehicle: 'Mahindra Scorpio', regNo: 'UP14 DE8901', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-09-18', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 26000, sourceType: 'new', status: 'Converted' },
    { id: 33, agent: 'Anjali Mehta', name: 'Yusuf Pathan', phone: '+91 99012 90123', vehicle: 'Tata Safari', regNo: 'GJ05 EF9012', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-10-25', creationDate: '2025-08-08', progress: ['Quote'], ape: 24000, sourceType: 'abandoned', status: 'Closed' },
    { id: 34, agent: 'Rohan Sharma', name: 'Zara Begum', phone: '+91 90123 01234', vehicle: 'Maruti S-Presso', regNo: 'DL12 FG0123', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-11-05', creationDate: '2025-08-06', progress: ['Quote', 'Proposal'], ape: 6800, sourceType: 'new', status: 'WIP' },
    { id: 35, agent: 'Anjali Mehta', name: 'Ankit Tiwari', phone: '+91 91234 11111', vehicle: 'Hyundai Aura', regNo: 'MH01 GH1111', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-08-22', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 9900, sourceType: 'new', status: 'Follow-up' },
    { id: 36, agent: 'Rohan Sharma', name: 'Bhavna Singh', phone: '+91 92345 22222', vehicle: 'Kia Carens', regNo: 'RJ14 IJ2222', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-09-28', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment Failed'], ape: 20500, sourceType: 'new', status: 'Tech Issue' },
    { id: 37, agent: 'Anjali Mehta', name: 'Chetan Bhagat', phone: '+91 93456 33333', vehicle: 'Volkswagen Taigun', regNo: 'KA04 KL3333', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-10-18', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 19800, sourceType: 'new', status: 'Converted' },
    { id: 38, agent: 'Rohan Sharma', name: 'Divya Khosla', phone: '+91 94567 44444', vehicle: 'Maruti Ertiga', regNo: 'TN20 MN4444', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-08-26', creationDate: '2025-08-05', progress: ['Quote'], ape: 13000, sourceType: 'abandoned', status: 'Closed' },
    { id: 39, agent: 'Anjali Mehta', name: 'Esha Gupta', phone: '+91 95678 55555', vehicle: 'Mahindra Bolero', regNo: 'UP15 OP5555', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-11-10', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 12800, sourceType: 'new', status: 'WIP' },
    { id: 40, agent: 'Rohan Sharma', name: 'Farhan Akhtar', phone: '+91 96789 66666', vehicle: 'Toyota Innova', regNo: 'DL09 QR6666', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-08-17', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 27000, sourceType: 'new', status: 'Follow-up' },
    { id: 41, agent: 'Anjali Mehta', name: 'Gita Kapoor', phone: '+91 97890 77777', vehicle: 'Maruti Alto', regNo: 'MH12 ST7777', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-09-25', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 6500, sourceType: 'new', status: 'Converted' },
    { id: 42, agent: 'Rohan Sharma', name: 'Harman Baweja', phone: '+91 98901 88888', vehicle: 'Honda WR-V', regNo: 'HR26 UV8888', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-10-22', creationDate: '2025-08-08', progress: ['Quote'], ape: 12200, sourceType: 'abandoned', status: 'Closed' },
    { id: 43, agent: 'Anjali Mehta', name: 'Irfan Khan', phone: '+91 99012 99999', vehicle: 'Ford Figo', regNo: 'DL11 WX9999', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-11-18', creationDate: '2025-08-06', progress: ['Quote', 'Proposal'], ape: 8900, sourceType: 'new', status: 'WIP' },
    { id: 44, agent: 'Rohan Sharma', name: 'Juhi Chawla', phone: '+91 90123 10101', vehicle: 'Hyundai Santro', regNo: 'KA01 YZ1010', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-08-23', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 8200, sourceType: 'new', status: 'Follow-up' },
    { id: 45, agent: 'Anjali Mehta', name: 'Karan Johar', phone: '+91 91234 21212', vehicle: 'Mercedes-Benz C-Class', regNo: 'MH02 AB2121', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'HDFC Ergo', policyEndDate: '2025-09-15', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment Failed'], ape: 75000, sourceType: 'new', status: 'Tech Issue' },
    { id: 46, agent: 'Rohan Sharma', name: 'Lara Dutta', phone: '+91 92345 32323', vehicle: 'BMW X1', regNo: 'DL13 CD3232', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Royal Sundaram', policyEndDate: '2025-10-28', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 68000, sourceType: 'new', status: 'Converted' },
    { id: 47, agent: 'Anjali Mehta', name: 'Manoj Bajpayee', phone: '+91 93456 43434', vehicle: 'Toyota Camry', regNo: 'UP16 EF4343', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Tata AIG', policyEndDate: '2025-08-31', creationDate: '2025-08-05', progress: ['Quote'], ape: 45000, sourceType: 'abandoned', status: 'Closed' },
    { id: 48, agent: 'Rohan Sharma', name: 'Nargis Fakhri', phone: '+91 94567 54545', vehicle: 'Audi A4', regNo: 'MH14 GH5454', partnerName: 'Coverfox', partnerCode: 'CF4321', prevInsurer: 'ICICI Lombard', policyEndDate: '2025-11-25', creationDate: '2025-08-08', progress: ['Quote', 'Proposal'], ape: 82000, sourceType: 'new', status: 'WIP' },
    { id: 49, agent: 'Anjali Mehta', name: 'Om Puri', phone: '+91 95678 65656', vehicle: 'Honda CR-V', regNo: 'DL01 IJ6565', partnerName: 'PolicyBazaar', partnerCode: 'PB5678', prevInsurer: 'Go Digit', policyEndDate: '2025-08-14', creationDate: '2025-08-08', progress: ['Quote', 'Proposal', 'KYC Done'], ape: 32000, sourceType: 'new', status: 'Follow-up' },
    { id: 50, agent: 'Rohan Sharma', name: 'Preity Zinta', phone: '+91 96789 76767', vehicle: 'Lexus ES', regNo: 'KA03 KL7676', partnerName: 'Acko', partnerCode: 'AK1122', prevInsurer: 'Bajaj Allianz', policyEndDate: '2025-09-08', creationDate: '2025-08-07', progress: ['Quote', 'Proposal', 'Payment', 'Issued'], ape: 95000, sourceType: 'new', status: 'Converted' },
];

const mockCallLogs = [
    { id: 1, timestamp: '2025-08-08T09:15:23Z', customerName: 'Priya Singh', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '02:45' },
    { id: 2, timestamp: '2025-08-08T09:18:05Z', customerName: 'Amit Kumar', partnerName: 'Acko', callType: 'outbound', duration: '05:12' },
    { id: 3, timestamp: '2025-08-08T09:25:40Z', customerName: 'Unknown', partnerName: 'N/A', callType: 'inbound', duration: '01:30' },
    { id: 4, timestamp: '2025-08-07T15:30:11Z', customerName: 'Vikas Mehra', partnerName: 'Acko', callType: 'abandoned', duration: '00:08' },
    { id: 5, timestamp: '2025-08-08T09:40:15Z', customerName: 'Neha Sharma', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '03:10' },
    { id: 6, timestamp: '2025-08-08T09:45:02Z', customerName: 'Sandeep Singh', partnerName: 'Acko', callType: 'inbound', duration: '04:55' },
    { id: 7, timestamp: '2025-08-07T11:05:30Z', customerName: 'Arun Patel', partnerName: 'Coverfox', callType: 'outbound', duration: '01:15' },
    { id: 8, timestamp: '2025-08-06T14:00:00Z', customerName: 'Deepika Iyer', partnerName: 'Acko', callType: 'outbound', duration: '06:40' },
    { id: 9, timestamp: '2025-08-08T09:51:00Z', customerName: 'Kavita Reddy', partnerName: 'Coverfox', callType: 'outbound', duration: '07:20' },
    { id: 10, timestamp: '2025-08-08T10:05:00Z', customerName: 'Mahesh Babu', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '02:18' },
    { id: 11, timestamp: '2025-08-07T16:00:10Z', customerName: 'Zoya Khan', partnerName: 'Coverfox', callType: 'outbound', duration: '00:55' },
    { id: 12, timestamp: '2025-08-08T10:12:45Z', customerName: 'Harish Kumar', partnerName: 'Acko', callType: 'abandoned', duration: '00:12' },
    { id: 13, timestamp: '2025-08-07T18:30:00Z', customerName: 'Ishita Singh', partnerName: 'PolicyBazaar', callType: 'inbound', duration: '09:30' },
    { id: 14, timestamp: '2025-08-08T10:20:00Z', customerName: 'Gaurav Sharma', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '01:50' },
    { id: 15, timestamp: '2025-08-08T10:25:10Z', customerName: 'Fatima Sheikh', partnerName: 'Acko', callType: 'outbound', duration: '04:20' },
    { id: 16, timestamp: '2025-08-07T10:00:00Z', customerName: 'Vikram Rathore', partnerName: 'Coverfox', callType: 'inbound', duration: '11:05' },
    { id: 17, timestamp: '2025-08-08T10:30:00Z', customerName: 'Riya Sen', partnerName: 'PolicyBazaar', callType: 'abandoned', duration: '00:05' },
    { id: 18, timestamp: '2025-08-07T14:30:00Z', customerName: 'Suresh Menon', partnerName: 'Acko', callType: 'outbound', duration: '03:45' },
    { id: 19, timestamp: '2025-08-08T10:35:00Z', customerName: 'Ananya Das', partnerName: 'Coverfox', callType: 'outbound', duration: '02:30' },
    { id: 20, timestamp: '2025-08-06T16:00:00Z', customerName: 'Balaji Venkat', partnerName: 'PolicyBazaar', callType: 'inbound', duration: '06:15' },
    { id: 21, timestamp: '2025-08-08T10:40:00Z', customerName: 'Christina George', partnerName: 'Acko', callType: 'outbound', duration: '08:00' },
    { id: 22, timestamp: '2025-08-07T17:00:00Z', customerName: 'Imran Ali', partnerName: 'Coverfox', callType: 'abandoned', duration: '00:10' },
    { id: 23, timestamp: '2025-08-08T10:45:00Z', customerName: 'Jaspreet Kaur', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '01:40' },
    { id: 24, timestamp: '2025-08-08T10:50:00Z', customerName: 'Nikhil Trivedi', partnerName: 'Acko', callType: 'outbound', duration: '05:50' },
    { id: 25, timestamp: '2025-08-07T18:00:00Z', customerName: 'Parul Joshi', partnerName: 'Coverfox', callType: 'inbound', duration: '04:05' },
    { id: 26, timestamp: '2025-08-08T10:55:00Z', customerName: 'Rohit Verma', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '09:10' },
    { id: 27, timestamp: '2025-08-06T10:00:00Z', customerName: 'Shalini Gupta', partnerName: 'Acko', callType: 'abandoned', duration: '00:15' },
    { id: 28, timestamp: '2025-08-08T11:00:00Z', customerName: 'Tanmay Bhatt', partnerName: 'Coverfox', callType: 'outbound', duration: '02:00' },
    { id: 29, timestamp: '2025-08-08T11:05:00Z', customerName: 'Urvashi Raut', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '03:30' },
    { id: 30, timestamp: '2025-08-07T12:00:00Z', customerName: 'Vivek Oberoi', partnerName: 'Acko', callType: 'inbound', duration: '10:20' },
    { id: 31, timestamp: '2025-08-08T11:10:00Z', customerName: 'Yusuf Pathan', partnerName: 'Coverfox', callType: 'abandoned', duration: '00:07' },
    { id: 32, timestamp: '2025-08-06T11:00:00Z', customerName: 'Zara Begum', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '01:25' },
    { id: 33, timestamp: '2025-08-08T11:15:00Z', customerName: 'Ankit Tiwari', partnerName: 'Acko', callType: 'outbound', duration: '04:50' },
    { id: 34, timestamp: '2025-08-07T13:00:00Z', customerName: 'Bhavna Singh', partnerName: 'Coverfox', callType: 'inbound', duration: '03:15' },
    { id: 35, timestamp: '2025-08-08T11:20:00Z', customerName: 'Chetan Bhagat', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '12:00' },
    { id: 36, timestamp: '2025-08-05T15:00:00Z', customerName: 'Divya Khosla', partnerName: 'Acko', callType: 'abandoned', duration: '00:11' },
    { id: 37, timestamp: '2025-08-08T11:25:00Z', customerName: 'Esha Gupta', partnerName: 'Coverfox', callType: 'outbound', duration: '02:40' },
    { id: 38, timestamp: '2025-08-08T11:30:00Z', customerName: 'Farhan Akhtar', partnerName: 'PolicyBazaar', callType: 'outbound', duration: '06:00' },
    { id: 39, timestamp: '2025-08-07T14:00:00Z', customerName: 'Gita Kapoor', partnerName: 'Acko', callType: 'inbound', duration: '08:30' },
    { id: 40, timestamp: '2025-08-08T11:35:00Z', customerName: 'Harman Baweja', partnerName: 'Coverfox', callType: 'abandoned', duration: '00:09' },
];

const mockChatHistory = {
    1: [ { sender: 'agent', text: 'Hello Priya, this is Rohan from PBP Renewals regarding your car insurance.', time: '10:15 AM' }, { sender: 'customer', text: 'Hi Rohan, yes I remember. Can you send me the quote again?', time: '10:16 AM' } ],
    2: [ { sender: 'customer', text: 'I tried to make the payment but it failed.', time: 'Yesterday' }, { sender: 'agent', text: 'Hi Amit, apologies for the inconvenience. Let me check and get back to you.', time: 'Yesterday' } ],
};

const progressSteps = ['Quote', 'Proposal', 'KYC Done', 'Payment', 'Issued'];

// --- Helper Icon Components ---
const Icon = ({ name, className }: {name: string, className?: string}) => <i className={`fas fa-${name} ${className}`}></i>;

// --- Reusable Components ---
const KpiCard = ({ title, value, icon, color }: {title: string, value: string | number, icon: string, color: string}) => ( <div className="bg-white p-4 rounded-lg shadow-sm flex items-center"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}><Icon name={icon} className="text-white text-xl" /></div><div className="ml-4"><p className="text-gray-500 text-sm font-medium">{title}</p><p className="text-2xl font-bold">{value}</p></div></div> );
const Filters = ({ filters, onFilterChange }: {filters: any, onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => ( <div className="bg-white p-4 rounded-lg shadow-sm mb-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"><div><label htmlFor="creationDate" className="text-sm font-medium text-gray-600">Lead Creation Date</label><input type="date" id="creationDate" name="creationDate" value={filters.creationDate} onChange={onFilterChange} className="w-full p-2 border rounded-lg mt-1" /></div><div><label htmlFor="expiryDate" className="text-sm font-medium text-gray-600">Policy Expiry Date</label><input type="date" id="expiryDate" name="expiryDate" value={filters.expiryDate} onChange={onFilterChange} className="w-full p-2 border rounded-lg mt-1" /></div><div><label htmlFor="partnerSearch" className="text-sm font-medium text-gray-600">Partner (Name/Code)</label><input type="text" id="partnerSearch" name="partnerSearch" value={filters.partnerSearch} onChange={onFilterChange} placeholder="e.g., PolicyBazaar or PB5678" className="w-full p-2 border rounded-lg mt-1" /></div><div><label className="text-sm font-medium text-gray-600">APE Range</label><div className="flex items-center space-x-2 mt-1"><input type="number" name="apeMin" value={filters.apeMin} onChange={onFilterChange} placeholder="Min" className="w-1/2 p-2 border rounded-lg" /><input type="number" name="apeMax" value={filters.apeMax} onChange={onFilterChange} placeholder="Max" className="w-1/2 p-2 border rounded-lg" /></div></div></div></div> );
const LeadListItem = ({ lead, onStartCall }: {lead: any, onStartCall: (lead: any) => void}) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyLink = () => { const paymentLink = `https://pay.pb.com/renew?lead=${lead.id}&partner=${lead.partnerCode}`; const textArea = document.createElement("textarea"); textArea.value = paymentLink; document.body.appendChild(textArea); textArea.select(); try { document.execCommand('copy'); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } catch (err) { console.error('Failed to copy: ', err); } document.body.removeChild(textArea); };
    const isExpiringSoon = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        const expiryDate = new Date(lead.policyEndDate);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    };
    const getStatusColor = () => { if (lead.status === 'Converted') return 'bg-green-500'; if (isExpiringSoon()) return 'bg-red-500'; if (lead.status === 'Follow-up') return 'bg-yellow-500'; if (lead.status === 'Closed') return 'bg-gray-400'; if (lead.status === 'Tech Issue') return 'bg-orange-500'; return 'bg-blue-500'; };
    const showPaymentLink = lead.progress.includes('Proposal') && !lead.progress.includes('Payment') && lead.status !== 'Converted' && lead.status !== 'Closed';

    return (
        <div className={`bg-white rounded-lg shadow-sm flex items-center p-3 mb-2 transition-all hover:shadow-md ${lead.status === 'Closed' || lead.status === 'Converted' ? 'opacity-70' : ''}`}>
            <div className={`w-2 h-16 rounded-full ${getStatusColor()}`}></div>
            <div className="flex-1 min-w-0 px-4">
                <p className="font-bold text-base truncate">{lead.name} <span className="text-sm font-normal text-gray-500">({lead.phone})</span></p>
                <p className="text-sm text-gray-600">{lead.vehicle} ({lead.regNo})</p>
            </div>
            <div className="w-48 hidden md:block px-4">
                <p className="font-medium text-gray-800">{lead.partnerName}</p>
                <p className="text-sm text-gray-500">Prev: {lead.prevInsurer}</p>
            </div>
            <div className="w-40 text-right px-4">
                <p className={`font-semibold ${isExpiringSoon() ? 'text-red-600' : ''}`}>{new Date(lead.policyEndDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-lg font-bold text-green-600">₹{lead.ape.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex-1 hidden lg:block px-4">
                 <div className="flex items-center text-xs w-full">{progressSteps.map((step, index) => { const isCompleted = lead.progress.includes(step); const lastCompletedStep = lead.progress[lead.progress.length - 1]; const isCurrent = lastCompletedStep === step && lead.status !== 'Converted'; let stepClass = 'bg-gray-200 text-gray-600'; if (isCompleted) stepClass = 'bg-green-500 text-white'; if (isCurrent) stepClass = 'bg-blue-500 text-white'; if(lead.progress.includes('Payment Failed') && step === 'Payment') stepClass = 'bg-red-500 text-white'; return (<div key={step} className={`flex-auto text-center px-1 py-1 ${stepClass} ${index === 0 ? 'rounded-l-md' : ''} ${index === progressSteps.length - 1 ? 'rounded-r-md' : ''}`}>{step}</div>); })}</div>
            </div>
            <div className="flex flex-col space-y-2 items-end w-40 px-4">
                {lead.status !== 'Converted' && lead.status !== 'Closed' ? (<button onClick={() => onStartCall(lead)} className="w-full flex-shrink-0 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-blue-700 font-bold text-sm flex items-center justify-center"><Icon name={lead.sourceType === 'abandoned' ? 'redo-alt' : 'phone-alt'} className="mr-2"/>{lead.status === 'Follow-up' ? 'Callback' : 'Call'}</button>) : (<button className={`w-full font-bold py-2 px-3 rounded-lg cursor-not-allowed text-sm flex items-center justify-center ${lead.status === 'Converted' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}><Icon name={lead.status === 'Converted' ? 'check-circle' : 'times-circle'} className="mr-2"/>{lead.status}</button>)}
                {showPaymentLink && (<button onClick={handleCopyLink} className={`w-full font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-sm ${isCopied ? 'bg-green-600 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}><Icon name={isCopied ? 'check' : 'link'} className="mr-2" />{isCopied ? 'Link Copied!' : 'Copy Link'}</button>)}
            </div>
        </div>
    );
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: {totalItems: number, itemsPerPage: number, currentPage: number, onPageChange: (page: number) => void}) => {
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    if (pageCount <= 1) return null;
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    return (
        <div className="mt-6 flex justify-center items-center space-x-2">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            {pages.map(page => (<button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white shadow-sm hover:bg-gray-100'}`}>{page}</button>))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} className="px-3 py-1 rounded-md bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
    );
};

// --- View Components ---
const AgentDashboard = ({ leads, onStartCall, filters, onFilterChange, activeBucket, setActiveBucket, currentPage, onPageChange }: {leads: any[], onStartCall: (lead: any) => void, filters: any, onFilterChange: any, activeBucket: string, setActiveBucket: (bucket: string) => void, currentPage: number, onPageChange: (page: number) => void}) => {
    const kpiData = { total: leads.length, converted: leads.filter(l => l.status === 'Converted').length, followUp: leads.filter(l => l.status === 'Follow-up').length, techIssues: leads.filter(l => l.status === 'Tech Issue').length };
    const buckets = { active: leads.filter(l => l.status === 'WIP'), followUp: leads.filter(l => l.status === 'Follow-up'), techIssues: leads.filter(l => l.status === 'Tech Issue'), done: leads.filter(l => l.status === 'Converted'), closed: leads.filter(l => l.status === 'Closed') };
    
    const leadsInBucket = buckets[activeBucket as keyof typeof buckets];
    const itemsPerPage = 10;
    const paginatedLeads = leadsInBucket.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return ( <> <header className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Agent Lead Dashboard</h2></header> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><KpiCard title="Filtered Leads" value={kpiData.total} icon="users" color="bg-blue-500" /><KpiCard title="Converted" value={kpiData.converted} icon="check" color="bg-green-500" /><KpiCard title="Follow-up" value={kpiData.followUp} icon="history" color="bg-yellow-500" /><KpiCard title="Tech Issues" value={kpiData.techIssues} icon="cogs" color="bg-orange-500" /></div> <Filters filters={filters} onFilterChange={onFilterChange} /> <div className="mb-6"><div className="border-b border-gray-200"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => { setActiveBucket('active'); onPageChange(1); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeBucket === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Active Leads <span className="bg-blue-100 text-blue-600 ml-2 px-2 py-0.5 rounded-full">{buckets.active.length}</span></button><button onClick={() => { setActiveBucket('followUp'); onPageChange(1); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeBucket === 'followUp' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Follow-up <span className="bg-yellow-100 text-yellow-600 ml-2 px-2 py-0.5 rounded-full">{buckets.followUp.length}</span></button><button onClick={() => { setActiveBucket('techIssues'); onPageChange(1); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeBucket === 'techIssues' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Tech Issues <span className="bg-orange-100 text-orange-600 ml-2 px-2 py-0.5 rounded-full">{buckets.techIssues.length}</span></button><button onClick={() => { setActiveBucket('done'); onPageChange(1); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeBucket === 'done' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Done Cases <span className="bg-green-100 text-green-600 ml-2 px-2 py-0.5 rounded-full">{buckets.done.length}</span></button><button onClick={() => { setActiveBucket('closed'); onPageChange(1); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeBucket === 'closed' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Closed <span className="bg-red-100 text-red-600 ml-2 px-2 py-0.5 rounded-full">{buckets.closed.length}</span></button></nav></div></div> 
    <div>
        <div className="hidden lg:flex items-center px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50 rounded-t-lg">
            <div className="w-2 mr-4"></div>
            <div className="flex-1 min-w-0">Customer</div>
            <div className="w-48 px-4">Partner</div>
            <div className="w-40 text-right px-4">Expiry / APE</div>
            <div className="flex-1 px-4">Progress</div>
            <div className="w-40 text-right px-4">Actions</div>
        </div>
        {paginatedLeads.length > 0 ? ( paginatedLeads.map(lead => <LeadListItem key={lead.id} lead={lead} onStartCall={onStartCall} />) ) : ( <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm"><p className="text-gray-500">No leads match the current filters in this bucket.</p></div> )}
        <Pagination totalItems={leadsInBucket.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={onPageChange} />
    </div>
    </> );
};

const CallLogsView = ({ logs, leads, onStartCall, filters, onFilterChange, currentPage, onPageChange }: {logs: any[], leads: any[], onStartCall: (lead: any) => void, filters: any, onFilterChange: any, currentPage: number, onPageChange: (page: number) => void}) => {
    const filteredLogs = logs.filter(log => {
        if (filters.callDate && new Date(log.timestamp).toISOString().slice(0, 10) !== filters.callDate) return false;
        if (filters.partnerSearch && !log.partnerName.toLowerCase().includes(filters.partnerSearch.toLowerCase())) return false;
        if (filters.callType !== 'all' && log.callType !== filters.callType) return false;
        return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const itemsPerPage = 10;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const CallTypeFlag = ({ type }: {type: string}) => { const styles = { inbound: { icon: 'arrow-down', color: 'blue' }, outbound: { icon: 'arrow-up', color: 'green' }, abandoned: { icon: 'phone-slash', color: 'red' } }; const { icon, color } = styles[type as keyof typeof styles] || { icon: 'question', color: 'gray' }; return ( <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}><Icon name={icon} className={`mr-1.5 text-${color}-600`} />{type.charAt(0).toUpperCase() + type.slice(1)}</span> ); };
    const handleCallback = (log: any) => { const correspondingLead = leads.find(lead => lead.name === log.customerName); if (correspondingLead) { onStartCall(correspondingLead); } else { alert("Lead details not found for this log entry."); } };

    return (
        <>
            <header className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Call Logs</h2></header>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div><label htmlFor="callDate" className="text-sm font-medium text-gray-600">Call Date</label><input type="date" id="callDate" name="callDate" value={filters.callDate} onChange={onFilterChange} className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label htmlFor="partnerSearch" className="text-sm font-medium text-gray-600">Partner</label><input type="text" id="partnerSearch" name="partnerSearch" value={filters.partnerSearch} onChange={onFilterChange} placeholder="e.g., Acko" className="w-full p-2 border rounded-lg mt-1" /></div>
                    <div><label htmlFor="callType" className="text-sm font-medium text-gray-600">Call Type</label><select id="callType" name="callType" value={filters.callType} onChange={onFilterChange} className="w-full p-2 border rounded-lg mt-1"><option value="all">All</option><option value="inbound">Inbound</option><option value="outbound">Outbound</option><option value="abandoned">Abandoned</option></select></div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer & Partner</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Type</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{paginatedLogs.map(log => (<tr key={log.id}><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.timestamp).toLocaleString('en-IN')}</td><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{log.customerName}</div><div className="text-sm text-gray-500">{log.partnerName}</div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CallTypeFlag type={log.callType} /></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.duration}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button onClick={() => handleCallback(log)} disabled={log.customerName === 'Unknown'} className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed">Call Back</button></td></tr>))}</tbody></table></div></div>
            <Pagination totalItems={filteredLogs.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={onPageChange} />
        </>
    );
};

const ManagerAnalyticsView = ({ leads }: {leads: any[]}) => {
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l => l.status === 'Converted');
    const totalConverted = convertedLeads.length;
    const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : 0;
    const totalApe = convertedLeads.reduce((sum, l) => sum + l.ape, 0);
    const funnelData = { 'Quote': leads.length, 'Proposal': leads.filter(l => l.progress.includes('Proposal')).length, 'Payment': leads.filter(l => l.progress.includes('Payment')).length, 'Issued': totalConverted };
    const maxFunnel = funnelData['Quote'];
    const agentPerformance = leads.reduce((acc, lead) => { if (!acc[lead.agent]) { acc[lead.agent] = { name: lead.agent, conversions: 0, ape: 0 }; } if (lead.status === 'Converted') { acc[lead.agent].conversions++; acc[lead.agent].ape += lead.ape; } return acc; }, {} as any);
    const leaderboard = Object.values(agentPerformance).sort((a: any, b: any) => b.conversions - a.conversions || b.ape - a.ape);

    return (
        <>
            <header className="mb-6"><h2 className="text-2xl font-bold">Manager Analytics</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KpiCard title="Total Leads" value={totalLeads} icon="users" color="bg-blue-500" />
                <KpiCard title="Policies Converted" value={totalConverted} icon="file-signature" color="bg-green-500"/>
                <KpiCard title="Conversion Rate" value={`${conversionRate}%`} icon="percentage" color="bg-yellow-500"/>
                <KpiCard title="Total Premium (APE)" value={`₹${totalApe.toLocaleString('en-IN')}`} icon="rupee-sign" color="bg-indigo-500"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Lead Funnel</h3>
                    <div className="space-y-4">
                        {Object.entries(funnelData).map(([stage, count]) => (
                            <div key={stage}>
                                <div className="flex justify-between text-sm mb-1"><span>{stage}</span><span>{count}</span></div>
                                <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(count / maxFunnel) * 100}%` }}></div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Agent Leaderboard</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Agent</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total APE</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaderboard.map((agent: any) => (
                                <tr key={agent.name}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{agent.conversions}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{agent.ape.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const ActiveCallView = ({ activeCall, callDuration, onEndCall }: {activeCall: any, callDuration: string, onEndCall: () => void}) => {
    const [messages, setMessages] = useState(mockChatHistory[activeCall.id as keyof typeof mockChatHistory] || []);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        const newMsg = { sender: 'agent', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');

        // Simulate customer reply
        setTimeout(() => {
            const reply = { sender: 'customer', text: 'Okay, thank you for the information.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, reply]);
        }, 2500);
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div><h2 className="text-3xl font-bold text-blue-600">Active Call</h2><p className="text-gray-500">Connecting with {activeCall.name}...</p></div>
                <div className="text-right"><p className="text-lg font-semibold">Call Duration</p><p className="text-4xl font-bold text-green-600">{callDuration}</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details & Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Customer & Policy Details</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-gray-700">
                            <p><strong>Name:</strong> {activeCall.name}</p>
                            <p><strong>Contact:</strong> {activeCall.phone}</p>
                            <p><strong>Vehicle:</strong> {activeCall.vehicle} ({activeCall.regNo})</p>
                            <p><strong>Previous Insurer:</strong> {activeCall.prevInsurer}</p>
                            <p className="font-bold text-red-600"><strong>Policy Expires:</strong> {new Date(activeCall.policyEndDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Call Controls</h3>
                        <div className="flex items-center space-x-4">
                            <button className="w-20 h-20 bg-gray-200 rounded-full flex flex-col items-center justify-center hover:bg-gray-300 transition"><Icon name="microphone-slash" className="text-2xl" /><span className="text-xs mt-1">Mute</span></button>
                            <button className="w-20 h-20 bg-gray-200 rounded-full flex flex-col items-center justify-center hover:bg-gray-300 transition"><Icon name="pause" className="text-2xl" /><span className="text-xs mt-1">Hold</span></button>
                        </div>
                        <div className="mt-8"><button onClick={onEndCall} className="w-full bg-red-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-red-700 transition-colors flex items-center justify-center"><Icon name="phone-slash" className="mr-3" /> End Call</button></div>
                    </div>
                </div>
                {/* Right Column: WhatsApp Chat */}
                <div className="lg:col-span-1 bg-gray-100 rounded-lg flex flex-col h-[600px]">
                    <div className="bg-green-600 text-white p-3 rounded-t-lg flex items-center">
                        <i className="fab fa-whatsapp text-2xl mr-3"></i>
                        <h3 className="font-bold">WhatsApp with {activeCall.name}</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-xl ${msg.sender === 'agent' ? 'bg-green-200' : 'bg-white'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-xs text-gray-500 text-right mt-1">{msg.time}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-2 border-t bg-white rounded-b-lg">
                        <div className="flex items-center">
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="button" className="p-3 border-t border-b hover:bg-gray-100"><Icon name="paperclip" /></button>
                            <button type="submit" className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700"><Icon name="paper-plane" /></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const DispositionModal = ({ show, onClose, lead, onSave }: {show: boolean, onClose: () => void, lead: any, onSave: (id: number, status: string) => void}) => { 
    const [disposition, setDisposition] = useState(lead?.status || 'WIP');
    if (!show) return null; 
    const handleSave = () => { onSave(lead.id, disposition); };
    return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg"><h3 className="text-xl font-bold mb-6">Log Call Disposition for {lead.name}</h3><div className="space-y-4"><div><label className="font-medium" htmlFor="disposition-select">New Status</label><select id="disposition-select" value={disposition} onChange={(e) => setDisposition(e.target.value)} className="w-full p-2 border rounded-lg mt-1"><option value="WIP">WIP</option><option value="Follow-up">Follow-up</option><option value="Tech Issue">Tech Issue</option><option value="Converted">Converted</option><option value="Closed">Closed</option></select></div><div><label className="font-medium">Notes</label><textarea rows={3} className="w-full p-2 border rounded-lg mt-1" placeholder="Add notes..."></textarea></div></div><div className="mt-8 flex justify-end space-x-4"><button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Cancel</button><button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Save Disposition</button></div></div></div> ); 
};

const RaiseTicketModal = ({ show, onClose }: {show: boolean, onClose: () => void}) => {
    if (!show) return null;
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Ticket has been raised successfully!');
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-6">Raise a Ticket</h3>
                <div className="space-y-4">
                    <div>
                        <label className="font-medium" htmlFor="issue-type">Issue Type</label>
                        <select id="issue-type" className="w-full p-2 border rounded-lg mt-1">
                            <option>Select an issue...</option>
                            <option>Payment deducted, policy not generated</option>
                            <option>Offline quote required</option>
                            <option>Policy copy required</option>
                            <option>KYC issue while policy issuance</option>
                            <option>Vehicle details not found</option>
                            <option>Online Quote not found</option>
                            <option>Special insurer quote not available</option>
                            <option>Other Technical Issue</option>
                        </select>
                    </div>
                    <div>
                        <label className="font-medium" htmlFor="lead-id">Lead ID (Optional)</label>
                        <input type="text" id="lead-id" placeholder="Enter Lead ID if applicable" className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div>
                        <label className="font-medium" htmlFor="issue-details">Details</label>
                        <textarea id="issue-details" rows={4} className="w-full p-2 border rounded-lg mt-1" placeholder="Please provide a detailed description of the issue..."></textarea>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Submit Ticket</button>
                </div>
            </form>
        </div>
    );
};

// --- Main App Component ---
export default function WinbackRenewals() {
    const [leads, setLeads] = useState(initialLeadsData);
    const [currentView, setCurrentView] = useState('dashboard');
    const [returnView, setReturnView] = useState('dashboard');
    const [activeCall, setActiveCall] = useState<any | null>(null);
    const [dispositionLead, setDispositionLead] = useState<any | null>(null);
    const [showDispositionModal, setShowDispositionModal] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const callTimer = useRef<any>(null);
    const [callDuration, setCallDuration] = useState('00:00');
    const [activeBucket, setActiveBucket] = useState('active');
    const [filters, setFilters] = useState({ creationDate: '', expiryDate: '', partnerSearch: '', apeMin: '', apeMax: '', callDate: '', callType: 'all' });
    const [leadsCurrentPage, setLeadsCurrentPage] = useState(1);
    const [logsCurrentPage, setLogsCurrentPage] = useState(1);

    const handleFilterChange = (e: React.ChangeEvent<any>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setLeadsCurrentPage(1);
        setLogsCurrentPage(1);
    };

    const filteredLeads = leads.filter(lead => {
        if (filters.creationDate && lead.creationDate !== filters.creationDate) return false;
        if (filters.expiryDate && lead.policyEndDate !== filters.expiryDate) return false;
        if (filters.partnerSearch) {
            const searchTerm = filters.partnerSearch.toLowerCase();
            if (!lead.partnerName.toLowerCase().includes(searchTerm) && !(lead.partnerCode && lead.partnerCode.toLowerCase().includes(searchTerm))) return false;
        }
        if (filters.apeMin && lead.ape < parseInt(filters.apeMin)) return false;
        if (filters.apeMax && lead.ape > parseInt(filters.apeMax)) return false;
        return true;
    });

    const handleStartCall = (lead: any) => { if (!lead) return; setReturnView(currentView); setActiveCall(lead); let seconds = 0; if (callTimer.current) clearInterval(callTimer.current); callTimer.current = setInterval(() => { seconds++; const mins = Math.floor(seconds / 60).toString().padStart(2, '0'); const secs = (seconds % 60).toString().padStart(2, '0'); setCallDuration(`${mins}:${secs}`); }, 1000); setCurrentView('agentCall'); };
    const handleEndCall = () => { clearInterval(callTimer.current); callTimer.current = null; setCallDuration('00:00'); setDispositionLead(activeCall); setActiveCall(null); setShowDispositionModal(true); };
    
    const handleSaveDisposition = (leadId: number, newStatus: string) => {
        setLeads(currentLeads => currentLeads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
        setShowDispositionModal(false);
        setDispositionLead(null);
        setCurrentView(returnView);
    };
    
    const closeDisposition = () => { setShowDispositionModal(false); setDispositionLead(null); setCurrentView(returnView); };

    return (
        <div className="bg-slate-100 text-slate-800 font-sans">
            <div className="flex flex-col">
                <header className="bg-white shadow-md z-10">
                    <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-blue-600">PBP Renewals</h1>
                            <nav className="flex items-center space-x-8 ml-10">
                                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }} className={`flex items-center px-3 py-2 rounded-lg font-semibold transition-colors ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><Icon name="tachometer-alt" className="w-5 h-5 mr-2" /> Agent Dashboard</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('callLogs'); }} className={`flex items-center px-3 py-2 rounded-lg font-semibold transition-colors ${currentView === 'callLogs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><Icon name="history" className="w-5 h-5 mr-2" /> Call Logs</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('analytics'); }} className={`flex items-center px-3 py-2 rounded-lg font-semibold transition-colors ${currentView === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}><Icon name="chart-line" className="w-5 h-5 mr-2" /> Manager Analytics</a>
                            </nav>
                        </div>
                        <button onClick={() => setShowTicketModal(true)} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center">
                            <Icon name="flag" className="mr-2" /> Raise Ticket
                        </button>
                    </div>
                </header>
                
                <main className="flex-1 p-6 bg-slate-100">
                    {currentView === 'dashboard' && <AgentDashboard leads={filteredLeads} onStartCall={handleStartCall} filters={filters} onFilterChange={handleFilterChange} activeBucket={activeBucket} setActiveBucket={setActiveBucket} currentPage={leadsCurrentPage} onPageChange={setLeadsCurrentPage} />}
                    {currentView === 'callLogs' && <CallLogsView logs={mockCallLogs} leads={leads} onStartCall={handleStartCall} filters={filters} onFilterChange={handleFilterChange} currentPage={logsCurrentPage} onPageChange={setLogsCurrentPage} />}
                    {currentView === 'analytics' && <ManagerAnalyticsView leads={leads} />}
                    {currentView === 'agentCall' && activeCall && <ActiveCallView activeCall={activeCall} callDuration={callDuration} onEndCall={handleEndCall} />}
                </main>
            </div>
            
            <DispositionModal show={showDispositionModal} onClose={closeDisposition} onSave={handleSaveDisposition} lead={dispositionLead} />
            <RaiseTicketModal show={showTicketModal} onClose={() => setShowTicketModal(false)} />
        </div>
    );
}
