const express = require('express');
const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/companyController');
const { protect, isSuperAdmin, isCompanyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/companies
// @desc    Create a new company
// @access  Private/SuperAdmin
router.post('/', protect, isSuperAdmin, createCompany);

// @route   GET /api/companies
// @desc    Get all companies
// @access  Private/SuperAdmin
router.get('/', protect, isSuperAdmin, getCompanies);

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Private/SuperAdmin or Private/Company
router.get('/:id', protect, getCompanyById);

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private/SuperAdmin or Private/Company
router.put('/:id', protect, isCompanyAdmin, updateCompany);

// @route   DELETE /api/companies/:id
// @desc    Delete company
// @access  Private/SuperAdmin
router.delete('/:id', protect, isSuperAdmin, deleteCompany);

module.exports = router; 