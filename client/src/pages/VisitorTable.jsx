import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Paper, Avatar, Typography, Box, TextField,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,

} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export default function VisitorTable() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [users , setUsers] = useState([]);
  const [status , setStatus] = useState("");
  const [userRole, setUserRole] = useState("");

  // Modal States
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [editVisitorData, setEditVisitorData] = useState({});
 

  const fetchVisitors = async (startDateParam, endDateParam) => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/getVisitorByDate';
      const params = new URLSearchParams();
        
      if (startDateParam) params.append('startDate', startDateParam);
      if (endDateParam) params.append('endDate', endDateParam);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url);
      const visitors = res.data.allVisitors;
      const formattedData = visitors.map((visitor) => ({
        id: visitor._id,
        ...visitor,
        personToMeetName: visitor.personToMeet?.name || 'N/A',
      }));
      setVisitors(formattedData);

      const URole = localStorage.getItem("role");
      setUserRole(URole);
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    } finally {
      setLoading(false);
    }
  };


 const fetchUsers =  async () =>{
    const res = await axios.get("http://localhost:5000/api/getAllUsers");
    console.log(res.data);
    setUsers(res.data);
 }


  useEffect(() => {
    fetchVisitors(startDate, endDate);
    fetchUsers();
  }, []);

  const handleFilter = () => {
    fetchVisitors(startDate, endDate);
  };

  const handleShowAll = () => {
    setStartDate('');
    setEndDate('');
    fetchVisitors();
  };

  const handleExportCSV = () => {
    if (visitors.length === 0) {
      alert('No data to export');
      return;
    }
    const exportData = visitors.map(({ 
      name, email, phoneNo, typeOfVisitor, purpose,
      personToMeetName, checkInTime, checkOutTime 
    }) => ({
      Name: name,
      Email: email,
      PhoneNumber: phoneNo,
      VisitorType: typeOfVisitor,
      Purpose: purpose,
      PersonToMeet: personToMeetName,
      CheckInTime: checkInTime ? new Date(checkInTime).toLocaleString() : 'N/A',
      CheckOutTime: checkOutTime ? new Date(checkOutTime).toLocaleString() : 'In Progress',
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'visitor_records.csv');
  };

  const handleView = (visitor) => {
    setSelectedVisitor(visitor);
    setViewModalOpen(true);
  };

  const handleEdit = (visitor) => {
    setSelectedVisitor(visitor);
    setEditVisitorData(visitor);
    setEditModalOpen(true);
  };

  const handleDelete = async(ids) => {
    // Replace with actual API delete logic
    try {
      console.log("Delete visitor with ID:", ids);
    const res = await axios.delete(`http://localhost:5000/api/deleteVisitor/${ids}`);
    fetchVisitors(startDate, endDate);
    } catch (error) {
      console.log(error);
    }
    
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditVisitorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async() => {
    console.log('Updated data to save:', editVisitorData);
    const res = await axios.patch("http://localhost:5000/api/editVisitor",editVisitorData);
    fetchVisitors(startDate, endDate);
    setEditModalOpen(false);

  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch("http://localhost:5000/api/updateStatus", { status: newStatus, id });
      fetchVisitors(startDate, endDate);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };
  

  // const columns = [
  //   { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
  //   { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
  //   {
  //     field: 'photo',
  //     headerName: 'Photo',
  //     flex: 0.5,
  //     minWidth: 80,
  //     renderCell: (params) => <Avatar alt="Visitor Photo" src={params.value} />,
  //     sortable: false,
  //     filterable: false,
  //   },
  //   { field: 'phoneNo', headerName: 'Phone Number', flex: 1, minWidth: 130 },
  //   { field: 'typeOfVisitor', headerName: 'Visitor Type', flex: 1, minWidth: 120 },
  //   { field: 'purpose', headerName: 'Purpose', flex: 1.2, minWidth: 150 },
  //   { field: 'personToMeetName', headerName: 'Person to Meet', flex: 1, minWidth: 150 },
  //   {
  //     field: 'checkInTime',
  //     headerName: 'Check-In Time',
  //     flex: 1,
  //     minWidth: 200,
  //     valueGetter: (value , row) =>{
  //       if(!row.checkInTime)return " ";
  //       return new Date(row?.checkInTime).toLocaleString();
  //   }
  //   },
  //   {
  //     field: 'checkOutTime',
  //     headerName: 'Check-Out Time',
  //     flex: 1,
  //     minWidth: 200,
  //     valueGetter: (value , row) =>{
  //       if(!row.checkOutTime)return "In Progress";
  //       return new Date(row?.checkOutTime).toLocaleString();
  //   }
  //   },

  //   { field: 'status', headerName: 'Status', flex: 1, minWidth: 150 },

  //   {
  //     field: 'actions',
  //     headerName: 'Actions',
  //     flex: 1,
  //     minWidth: 240,
  //     sortable: false,
  //     filterable: false,
  //     renderCell: (params) => (
  //       <Box sx={{ display: 'flex', gap: 1 }}>
  //         <Button variant="outlined" color="primary" size="small" onClick={() => handleView(params.row)}>View</Button>
  //         {/* <Button variant="outlined" color="success" size="small" onClick={() => handleEdit(params.row)}>Edit</Button> */}
  //         <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(params.row.id)}>Delete</Button>

  //          <Grid item xs={14}>
  //               <FormControl
  //                 fullWidth
  //                 required
  //                 variant="filled"
  //                 sx={{
                    
  //                   backgroundColor: '#f9f9f9',
  //                   borderRadius: 1,
  //                 }}
  //               >
  //                 <InputLabel id="status-label">Status</InputLabel>
  //                 <Select
  //                   labelId="status-label"
  //                   id="status"
  //                   name="status"
  //                   // value={formData.purpose}
  //                   // onChange={handleChange}
  //                   label="status"
  //                 >
  //                   <MenuItem value="Approved">Approve</MenuItem>
  //                   <MenuItem value="Rejected">Reject</MenuItem>
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //       </Box>
  //     ),
  //   },
  // ];

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
    {
      field: 'photo',
      headerName: 'Photo',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => <Avatar alt="Visitor" src={params.value} />,
      sortable: false,
      filterable: false,
    },
    { field: 'phoneNo', headerName: 'Phone', flex: 1, minWidth: 130 },
    { field: 'typeOfVisitor', headerName: 'Type', flex: 1, minWidth: 120 },
    { field: 'purpose', headerName: 'Purpose', flex: 1.2, minWidth: 150 },
    { field: 'personToMeetName', headerName: 'Person to Meet', flex: 1, minWidth: 150 },
    {
      field: 'checkInTime',
      headerName: 'Check-In',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) =>
        row?.checkInTime ? new Date(row.checkInTime).toLocaleString() : '',
    },
    {
      field: 'checkOutTime',
      headerName: 'Check-Out',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) =>
        row?.checkOutTime ? new Date(row.checkOutTime).toLocaleString() : 'In Progress',
    },
  ];
  
  // Conditionally add status column for Admins
  if (userRole === 'Admin') {
    columns.push({
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.value || 'Pending'}
          displayEmpty
          onChange={(e) => handleUpdateStatus(params.row.id, e.target.value)}
          variant="outlined"
          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      ),
    });
  }

  if (userRole !== 'Admin') {
    columns.push( {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 180,
     
    },);
  }
  
  // Always add the actions column
  columns.push({
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    minWidth: 200,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" onClick={() => handleView(params.row)}>View</Button>
        {/* <Button variant="outlined" size="small" color="success" onClick={() => handleEdit(params.row)}>Edit</Button> */}
        <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
      </Box>
    ),
  });
  
  


  return (
    <Paper sx={{ height: 700, width: '100%', overflow: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>Visitor Records</Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" color="primary" onClick={handleFilter}>Apply Filter</Button>
        <Button variant="outlined" color="secondary" onClick={handleShowAll}>Show All Records</Button>
        <Button variant="outlined" onClick={handleExportCSV}>Export data</Button>
      </Box>

      <DataGrid
        rows={visitors}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
      />

      {/* View Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Visitor Details</DialogTitle>
  <DialogContent dividers>
    {selectedVisitor && (
      <Box display="flex" flexDirection="column" gap={2} mt={1}>
        <Typography variant="body1"><strong>Name:</strong> {selectedVisitor.name}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {selectedVisitor.email}</Typography>
        <Typography variant="body1"><strong>Phone:</strong> {selectedVisitor.phoneNo}</Typography>
        <Typography variant="body1"><strong>Type:</strong> {selectedVisitor.typeOfVisitor}</Typography>
        <Typography variant="body1"><strong>Purpose:</strong> {selectedVisitor.purpose}</Typography>
        <Typography variant="body1"><strong>Person to Meet:</strong> {selectedVisitor.personToMeetName}</Typography>
        <Typography variant="body1">
          <strong>Check-In:</strong> {new Date(selectedVisitor.checkInTime).toLocaleString()}
        </Typography>
        <Typography variant="body1">
          <strong>Check-Out:</strong>{' '}
          {selectedVisitor.checkOutTime
            ? new Date(selectedVisitor.checkOutTime).toLocaleString()
            : <em style={{ color: 'orange' }}>In Progress</em>}
        </Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setViewModalOpen(false)} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>


      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Visitor</DialogTitle>
        <DialogContent dividers>
          {editVisitorData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" name="name" value={editVisitorData.name || ''} onChange={handleEditChange} />
              <TextField label="Email" name="email" value={editVisitorData.email || ''} onChange={handleEditChange} />
              <TextField label="Phone Number" name="phoneNo" value={editVisitorData.phoneNo || ''} onChange={handleEditChange} />
              <TextField label="Visitor Type" name="typeOfVisitor" value={editVisitorData.typeOfVisitor || ''} onChange={handleEditChange} />
              <TextField label="Purpose" name="purpose" value={editVisitorData.purpose || ''} onChange={handleEditChange} />
              <TextField label="Person to Meet" name="personToMeetName" value={editVisitorData.personToMeetName || ''} onChange={handleEditChange} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
