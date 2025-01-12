const { Company } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private/SuperAdmin
exports.createCompany = asyncHandler(async (req, res) => {
  const { name, SIREN, SIRET, code_postal, code_NAF, chiffre_d_affaires, EBIT, latitude, longitude, pdm } = req.body;

  const companyExists = await Company.findOne({ name });
  if (companyExists) {
    res.status(400);
    throw new Error('Company already exists');
  }

  const company = await Company.create({
    name,
    SIREN,
    SIRET,
    code_postal,
    code_NAF,
    chiffre_d_affaires,
    EBIT,
    latitude,
    longitude,
    pdm
  });

  if (company) {
    res.status(201).json(company);
  } else {
    res.status(400);
    throw new Error('Invalid company data');
  }
});

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/SuperAdmin
exports.getCompanies = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['name', 'SIREN', 'SIRET', 'code_postal', 'code_NAF'] : [];
  
  // SuperAdmins can see all companies, so no additional filtering is needed
  const query = {};
  
  // Get paginated results
  const results = await paginateResults(Company, query, {
    page,
    limit,
    search,
    searchFields,
    sort: { name: 1 } // Sort alphabetically by name
  });
  
  // Rename data to companies to match desired response format
  const { data: companies, ...rest } = results;
  
  res.json({ companies, ...rest });
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private/SuperAdmin or Private/Company
exports.getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  
  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/SuperAdmin or Private/Company
exports.updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  
  if (company) {
    company.name = req.body.name || company.name;
    company.SIREN = req.body.SIREN || company.SIREN;
    company.SIRET = req.body.SIRET || company.SIRET;
    company.code_postal = req.body.code_postal || company.code_postal;
    company.code_NAF = req.body.code_NAF || company.code_NAF;
    company.chiffre_d_affaires = req.body.chiffre_d_affaires || company.chiffre_d_affaires;
    company.EBIT = req.body.EBIT || company.EBIT;
    company.latitude = req.body.latitude || company.latitude;
    company.longitude = req.body.longitude || company.longitude;
    company.pdm = req.body.pdm || company.pdm;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/SuperAdmin
exports.deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  
  if (company) {
    await company.deleteOne();
    res.json({ message: 'Company removed' });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
}); 