import {
  Box,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  CircularProgress,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { workflowService } from '../services/workflow.service';

interface ProcessNode {
  id: string;
  text: string;
}

interface WorkflowData {
  _id?: string;
  name: string;
  description: string;
  nodes: ProcessNode[];
  randomId: number;
}

const ProcessBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [zoom, setZoom] = useState(100);
  const [nodes, setNodes] = useState<ProcessNode[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newNodeText, setNewNodeText] = useState('');
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadWorkflow(id);
    }
  }, [id]);

  const loadWorkflow = async (workflowId: string) => {
    setIsLoading(true);
    try {
      const workflow = await workflowService.getById(workflowId);
      setName(workflow.name);
      setDescription(workflow.description);
      setNodes(workflow.nodes);
    } catch (err) {
      setError('Failed to load workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your workflow');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      const workflowData: WorkflowData = {
        name: name.trim(),
        description: description.trim(),
        nodes, 
        randomId: Math.random()*100
      };

      if (id) {
        await workflowService.update(id, workflowData);
      } else {
        await workflowService.create(workflowData);
      }

      setSuccessMessage('Workflow saved successfully');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNode = () => {
    if (newNodeText.trim()) {
      const newNode: ProcessNode = {
        id: Date.now().toString(),
        text: newNodeText.trim()
      };
      setNodes([...nodes, newNode]);
      setNewNodeText('');
      setDialogOpen(false);
    }
  };

  const handleEditNode = () => {
    if (selectedNode && newNodeText.trim()) {
      setNodes(nodes.map(node =>
        node.id === selectedNode.id
          ? { ...node, text: newNodeText.trim() }
          : node
      ));
      setNewNodeText('');
      setSelectedNode(null);
      setDialogOpen(false);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter(node => node.id !== selectedNode.id));
      setSelectedNode(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh',
      width: '1440px',
      backgroundColor: '#FAF4F0',
      overflow: 'auto'
    }}>
      <Box sx={{ p: 3, maxWidth: 1440, margin: '0 auto', backgroundColor: "rgba(248, 242, 231, 1)", height: '100vh', position: 'relative' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ color: '#1B4B66', fontWeight: 500 }}>
              {id ? 'Edit Workflow' : 'Create New Workflow'}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleResetZoom} size="small">
              <RestartAltIcon />
            </IconButton>
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomInIcon />
            </IconButton>
            <Button
              variant="contained"
              onClick={() => setSaveDialogOpen(true)}
              startIcon={<SaveIcon />}
              sx={{
                ml: 2,
                backgroundColor: '#1B4B66',
                '&:hover': { backgroundColor: '#143952' },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: 'rgba(248, 242, 231, 1)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 'calc(100vh - 100px)',
            borderRadius: 2,
            p: 4
          }}
        >
          {/* Workflow Area */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${zoom / 100})`,
              transition: 'transform 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 800
            }}
          >
            {/* Start Node */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#8DB572',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 20,
                  backgroundColor: '#666',
                },
              }}
            >
              <Typography>Start</Typography>
            </Box>

            {/* Plus Icon */}
            <IconButton
              onClick={() => {
                setSelectedNode(null);
                setNewNodeText('');
                setDialogOpen(true);
              }}
              sx={{
                color: '#1B4B66',
                my: 2,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(27, 75, 102, 0.1)',
                },
              }}
            >
              <AddCircleIcon sx={{ fontSize: 32 }} />
            </IconButton>

            {/* Process Nodes */}
            {nodes.map((node, index) => (
              <Box key={node.id} sx={{ position: 'relative', width: '100%', textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    padding: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'inline-block',
                    minWidth: 200,
                    position: 'relative',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      transform: `scale(${zoom / 100}) translateY(-2px)`,
                    },
                    '&:before, &:after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 2,
                      height: 20,
                      backgroundColor: '#666',
                    },
                    '&:before': {
                      top: -20,
                    },
                    '&:after': {
                      bottom: -20,
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1 
                  }}>
                    <Typography sx={{ 
                      fontWeight: 500,
                      color: '#1B4B66',
                      flex: 1,
                      textAlign: 'left'
                    }}>
                      <span style={{ marginRight: '8px' }}>{index + 1}.</span>
                      {node.text}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => {
                          setSelectedNode(node);
                          setNewNodeText(node.text);
                          setDialogOpen(true);
                        }}
                        sx={{ color: '#1B4B66' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedNode(node);
                          setDeleteDialogOpen(true);
                        }}
                        sx={{ color: '#E94F37' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Add another plus icon after each node */}
                <IconButton
                  onClick={() => {
                    setSelectedNode(null);
                    setNewNodeText('');
                    setDialogOpen(true);
                  }}
                  sx={{
                    color: '#1B4B66',
                    position: 'absolute',
                    left: '50%',
                    transform: `translateX(-50%) scale(${zoom / 100})`,
                    transformOrigin: 'center',
                    bottom: -40,
                    opacity: 0.7,
                    '&:hover': {
                      backgroundColor: 'rgba(27, 75, 102, 0.1)',
                      opacity: 1,
                    },
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Box>
            ))}

            {/* End Node */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#E94F37',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: nodes.length ? 6 : 2,
                position: 'relative',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 20,
                  backgroundColor: '#666',
                },
              }}
            >
              <Typography>End</Typography>
            </Box>
          </Box>
        </Box>

        {/* Add/Edit Node Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedNode ? 'Edit Node' : 'Add Node'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Node Text"
              fullWidth
              value={newNodeText}
              onChange={(e) => setNewNodeText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              onClick={selectedNode ? handleEditNode : handleAddNode}
              variant="contained"
              sx={{
                backgroundColor: '#1B4B66',
                '&:hover': { backgroundColor: '#143952' },
              }}
            >
              {selectedNode ? 'Save Changes' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Node</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this node?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNode}
              sx={{ color: '#E94F37' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Save Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Save Workflow</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Workflow Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isSaving}
              sx={{
                backgroundColor: '#1B4B66',
                '&:hover': { backgroundColor: '#143952' },
              }}
            >
              {isSaving ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProcessBuilder;
