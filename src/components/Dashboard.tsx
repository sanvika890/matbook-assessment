import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Chip,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LogoutIcon from '@mui/icons-material/Logout';
import { workflowService } from '../services/workflow.service';
import { signout } from '../services/auth.service';

interface Workflow {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status?: 'Passed' | 'Failed' | 'In Progress' | 'Not Started';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const data = await workflowService.getAll();
      // Add dummy status for demonstration
      const workflowsWithStatus = data.map(w => ({
        ...w,
        status: ['Passed', 'Failed', 'In Progress', 'Not Started'][Math.floor(Math.random() * 4)] as Workflow['status']
      }));
      setWorkflows(workflowsWithStatus);
      setError('');
    } catch (err) {
      setError('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowService.delete(id);
        await fetchWorkflows();
      } catch (err) {
        setError('Failed to delete workflow');
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'Passed':
        return '#8DB572';
      case 'Failed':
        return '#E94F37';
      case 'In Progress':
        return '#1B4B66';
      default:
        return '#666666';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '1440px',
      backgroundColor: '#FDFBF6',
      overflow: 'auto'
    }}>
      <Box sx={{ 
        p: 3, 
        maxWidth: 1440, 
        margin: '0 auto', 
        backgroundColor: "#FDFBF6",
        minHeight: '100vh'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <div style={{display:"flex", alignItems:"center"}}>
            <IconButton
              onClick={toggleMenu}
              sx={{
                color: '#1B4B66',
                transition: 'transform 0.3s ease',
                transform: menuOpen ? 'rotate(90deg)' : 'none',
                marginRight:"10px"
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" sx={{ color: '#1B4B66', fontWeight: 500 }}>
              Workflow Builder
            </Typography>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/process/new')}
              sx={{
                backgroundColor: '#1B4B66',
                '&:hover': { backgroundColor: '#143952' },
              }}
            >
              Create New Process
            </Button>
          </Box>
        </Box>

        <div style={{display:"flex", justifyContent:"flex-start"}}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, width:"25%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
            {error}
          </Typography>
        ) : filteredWorkflows.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 4, color: '#666' }}>
            {searchTerm ? 'No workflows found matching your search.' : 'No workflows created yet.'}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E7E7E7' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500, color: '#1B4B66' }} align='left'>Name</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1B4B66' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1B4B66' }}>Last Modified</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#1B4B66' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkflows.map((workflow) => (
                  <>
                    <TableRow 
                      key={workflow._id}
                      sx={{ 
                        '& > *': { borderBottom: 'unset' },
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(27, 75, 102, 0.04)' }
                      }}
                      onClick={() => handleRowClick(workflow._id)}
                    >
                      
                      <TableCell>{workflow.name}</TableCell>
                      <TableCell>{workflow.description}</TableCell>
                      <TableCell>
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              /* Execute action */
                            }}
                            sx={{
                              color: '#1B4B66',
                              backgroundColor: 'white',
                              border: '1px solid #E7E7E7',
                              borderRadius: '4px',
                              textTransform: 'none',
                              minWidth: '80px',
                              padding: '4px 12px',
                              '&:hover': {
                                backgroundColor: '#F6F6F6',
                                border: '1px solid #E7E7E7'
                              }
                            }}
                          >
                            Execute
                          </Button>
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/process/${workflow._id}`);
                            }}
                            sx={{
                              color: '#1B4B66',
                              backgroundColor: 'white',
                              border: '1px solid #E7E7E7',
                              borderRadius: '4px',
                              textTransform: 'none',
                              minWidth: '60px',
                              padding: '4px 12px',
                              '&:hover': {
                                backgroundColor: '#F6F6F6',
                                border: '1px solid #E7E7E7'
                              }
                            }}
                          >
                            Edit
                          </Button>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(workflow._id);
                            }}
                            sx={{
                              color: '#E94F37',
                              backgroundColor: 'white',
                              border: '1px solid #E7E7E7',
                              borderRadius: '4px',
                              padding: '4px',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#F6F6F6',
                                border: '1px solid #E7E7E7'
                              }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                          <IconButton
                          size="small"
                          sx={{
                            transition: 'transform 0.3s ease',
                            transform: expandedRow === workflow._id ? 'rotate(180deg)' : 'none'
                          }}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                        </Box>
                      </TableCell>
                     
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRow === workflow._id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ color: '#1B4B66' }}>
                              Status
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Chip
                                label={workflow.status}
                                sx={{
                                  backgroundColor: getStatusColor(workflow.status),
                                  color: 'white',
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Last executed: Not available
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            width: 250,
            backgroundColor: '#FDFBF6',
            borderLeft: '1px solid #E7E7E7'
          }
        }}
      >
        <List>
          <ListItem>
            <ListItemText 
              primary={
                <Typography variant="h6" sx={{ color: '#1B4B66', fontWeight: 500 }}>
                  Menu
                </Typography>
              } 
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleSignout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#E94F37' }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography sx={{ color: '#E94F37' }}>
                  Sign Out
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Dashboard;
