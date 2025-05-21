import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import {
  Box, Button, Card, CardContent, FormControl, Grid, InputLabel,
  MenuItem, Select, TextField, Typography, Modal
} from '@mui/material';
import { downloadVisitorBadge } from '../components/DownloadVisitorBadge';

function VisitorForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", phoneNo: "", typeOfVisitor: "", personToMeet: "",
    checkInTime: "", checkOutTime: "", purpose: "", customPurpose: "", photo: null,
  });

  const [users, setUsers] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [visitorData, setVisitorData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [useCamera, setUseCamera] = useState(true);
  const [cameraStream, setCameraStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
      setCameraStream(stream);
    } catch (err) {
      console.log("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setStreaming(false);
      setCameraStream(null);
    }
  };

  const takeSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg");
    setPhotoPreview(dataURL);
    canvas.toBlob((blob) => {
      setFormData((prev) => ({ ...prev, photo: blob }));
    }, "image/jpeg");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    stopCamera(); // stop camera on submit

    const actualPurpose = formData.purpose === "Other" ? formData.customPurpose : formData.purpose;

    try {
      const data = new FormData();
      Object.entries({ ...formData, purpose: actualPurpose }).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await axios.post("http://localhost:5000/api/register", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // setVisitorData({ ...formData, purpose: actualPurpose });
      console.log(res.data.newRegistration);
      setVisitorData(res.data.newRegistration);
      setOpenModal(true);

      setFormData({
        name: "", email: "", phoneNo: "", typeOfVisitor: "", personToMeet: "",
        checkInTime: "", checkOutTime: "", purpose: "", customPurpose: "", photo: null,
      });
      setPhotoPreview(null);
    } catch (err) {
      alert("Registration failed");
    }
  };

  const FetchUser = async () => {
    const res = await axios.get("http://localhost:5000/api/getAllUsers");
    setUsers(res.data);
  };

  useEffect(() => {
    FetchUser();
    return stopCamera; // cleanup on unmount
  }, []);

  return (
    <>
      <Box maxWidth="sm" mx="auto" mt={5}>
        <Card sx={{ p: 3, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Visitor Registration
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}><TextField name="name" label="Name" fullWidth value={formData.name} onChange={handleChange} required /></Grid>
                <Grid item xs={12}><TextField name="email" label="Email" type="email" fullWidth value={formData.email} onChange={handleChange} required /></Grid>
                <Grid item xs={12}><TextField name="phoneNo" label="Phone Number" fullWidth value={formData.phoneNo} onChange={handleChange} required /></Grid>

                <Grid item xs={12}>
      <FormControl fullWidth required variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="visitor-type-label">Visitor Type</InputLabel>
        <Select
          labelId="visitor-type-label"
          id="typeOfVisitor"
          name="typeOfVisitor"
          value={formData.typeOfVisitor}
          onChange={handleChange}
          label="Visitor Type"
        >
          <MenuItem value="Client">Client</MenuItem>
          <MenuItem value="Vendor">Vendor</MenuItem>
          <MenuItem value="Interviewee">Interviewee</MenuItem>
          <MenuItem value="Guest">Guest</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </Grid>

                <Grid item xs={12}>
      <FormControl fullWidth required variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="person-to-meet-label">Person to Meet</InputLabel>
        <Select
          labelId="person-to-meet-label"
          id="personToMeet"
          name="personToMeet"
          value={formData.personToMeet}
          onChange={handleChange}
          label="Person to Meet"
        >
          {users.map((u) => (
            <MenuItem key={u._id} value={u._id}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" fontWeight={500}>
                  {u.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {u.role}
                </Typography>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

                <Grid item xs={12}>
                  <TextField name="checkInTime" label="Check-in Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} value={formData.checkInTime} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                  <TextField name="checkOutTime" label="Check-out Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} value={formData.checkOutTime} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
      <FormControl
        fullWidth
        required
        variant="outlined"
        sx={{
          mb: 2,
          backgroundColor: '#f9f9f9',
          borderRadius: 1,
        }}
      >
        <InputLabel id="purpose-label">Purpose of Visit</InputLabel>
        <Select
          labelId="purpose-label"
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          label="Purpose of Visit"
        >
          <MenuItem value="Business Meeting">Business Meeting</MenuItem>
          <MenuItem value="Project Discussion">Project Discussion</MenuItem>
          <MenuItem value="Interview">Interview</MenuItem>
          <MenuItem value="Delivery">Delivery</MenuItem>
          <MenuItem value="Maintenance Work">Maintenance Work</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </Grid>

                {formData.purpose === "Other" && (
                  <Grid item xs={12}>
                    <TextField label="Custom Purpose" name="customPurpose" fullWidth value={formData.customPurpose || ""} onChange={(e) => setFormData({ ...formData, customPurpose: e.target.value })} />
                  </Grid>
                )}

                {/* Toggle between Camera and Upload */}
                <Grid item xs={12}>
                  <Button variant={useCamera ? "contained" : "outlined"} onClick={() => setUseCamera(true)} sx={{ mr: 1 }}>
                    Use Camera
                  </Button>
                  <Button variant={!useCamera ? "contained" : "outlined"} onClick={() => { setUseCamera(false); stopCamera(); }}>
                    Upload Photo
                  </Button>
                </Grid>

                {useCamera ? (
                  <>
                    {streaming ? (
                      <Grid item xs={12}>
                        <Button variant="contained" color="success" onClick={takeSelfie} fullWidth>Take Selfie</Button>
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <Button variant="outlined" color="secondary" onClick={startCamera} fullWidth>Start Camera</Button>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: 8 }} />
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Button variant="outlined" component="label" fullWidth>
                      Upload Photo
                      <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                    </Button>
                  </Grid>
                )}

                {photoPreview && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Photo Preview:</Typography>
                    <Box mt={1}>
                      <img src={photoPreview} alt="Selfie" style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc' }} />
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Badge Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      width: 350,
      textAlign: 'center',
      '@media print': {
        width: '80%',
        height: 'auto',
        top: '10px',
        left: '10%',
        transform: 'none',
        boxShadow: 'none',
        borderRadius: 0,
        p: 2,
        bgcolor: '#fff',
      }
    }}
  >
    {visitorData && (
      <>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            borderBottom: '2px solid #000',
            pb: 1
          }}
        >
          Visitor Badge
        </Typography>

        <img
          src={visitorData.photo}
          alt="Selfie"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '8px',
            marginBottom: '16px',
            objectFit: 'cover',
            border: '2px solid #555'
          }}
        />

        <Box sx={{ textAlign: 'left', mb: 2 }}>
          <Typography><strong>Name:</strong> {visitorData.name}</Typography>
          <Typography><strong>Email:</strong> {visitorData.email}</Typography>
          <Typography><strong>Phone:</strong> {visitorData.phoneNo}</Typography>
          <Typography><strong>Visitor Type:</strong> {visitorData.typeOfVisitor}</Typography>
          <Typography><strong>Purpose:</strong> {visitorData.purpose}</Typography>
       <Typography>
  <strong>Check-In:</strong>{' '}
  {visitorData.checkInTime ? new Date(visitorData.checkInTime).toLocaleString() : 'N/A'}
</Typography>
<Typography>
  <strong>Check-In:</strong>{' '}
  {visitorData.checkOutTime ? new Date(visitorData.checkOutTime).toLocaleString() : 'N/A'}
</Typography>
        </Box>

        {/* Buttons hidden when printing */}
        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          sx={{
            '@media print': {
              display: 'none'
            }
          }}
        >
          <Button
            variant="contained"
            onClick={() => downloadVisitorBadge({ ...visitorData, photo: photoPreview })}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Box>
      </>
    )}
  </Box>
</Modal>


    </>
  );
}

export default VisitorForm;
