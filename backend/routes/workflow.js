import express from 'express';
import Workflow from '../models/workflow.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new workflow
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, nodes, randomId } = req.body;
    const workflow = new Workflow({
      name,
      description,
      nodes,
      userId: req.user._id,
      lastEditedBy: req.user._id,
      randomId
    });
    await workflow.save();
    res.status(201).json(workflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all workflows for a user
router.get('/', auth, async (req, res) => {
  try {
    const workflows = await Workflow.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('lastEditedBy', 'name email');
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific workflow
router.get('/:id', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('lastEditedBy', 'name email');
    
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a workflow
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, nodes } = req.body;
    const workflow = await Workflow.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        name, 
        description, 
        nodes,
        lastEditedBy: req.user._id,
        updatedAt: Date.now(),
        randomId
      },
      { new: true }
    ).populate('lastEditedBy', 'name email');

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a workflow
router.delete('/:id', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
