const express = require('express');
const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/companyController');
const { protect, isSuperAdmin, isCompanyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management endpoints
 */

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new company. Only accessible to Super Admins.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The company name
 *               SIREN:
 *                 type: string
 *                 description: SIREN identification number
 *               SIRET:
 *                 type: string
 *                 description: SIRET identification number
 *               code_postal:
 *                 type: string
 *                 description: Postal code
 *               code_NAF:
 *                 type: string
 *                 description: NAF code (business activity classification)
 *               chiffre_d_affaires:
 *                 type: number
 *                 description: Annual revenue
 *               EBIT:
 *                 type: number
 *                 description: Earnings Before Interest and Taxes
 *               latitude:
 *                 type: number
 *                 description: Geographic latitude
 *               longitude:
 *                 type: number
 *                 description: Geographic longitude
 *               pdm:
 *                 type: number
 *                 description: Market share (parts de marché)
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input data or company already exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Only Super Admins can create companies
 */
router.post('/', protect, isSuperAdmin, createCompany);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all companies. Only accessible to Super Admins.
 *     responses:
 *       200:
 *         description: A list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Only Super Admins can list all companies
 */
router.get('/', protect, isSuperAdmin, getCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The company ID
 *     description: Get a single company by ID. Super Admins can access any company. Users can only access their own company.
 *     responses:
 *       200:
 *         description: Successfully retrieved the company
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to access this company
 *       404:
 *         description: Company not found
 */
router.get('/:id', protect, getCompanyById);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The company name
 *               SIREN:
 *                 type: string
 *                 description: SIREN identification number
 *               SIRET:
 *                 type: string
 *                 description: SIRET identification number
 *               code_postal:
 *                 type: string
 *                 description: Postal code
 *               code_NAF:
 *                 type: string
 *                 description: NAF code (business activity classification)
 *               chiffre_d_affaires:
 *                 type: number
 *                 description: Annual revenue
 *               EBIT:
 *                 type: number
 *                 description: Earnings Before Interest and Taxes
 *               latitude:
 *                 type: number
 *                 description: Geographic latitude
 *               longitude:
 *                 type: number
 *                 description: Geographic longitude
 *               pdm:
 *                 type: number
 *                 description: Market share (parts de marché)
 *     description: Update a company. Super Admins can update any company. Company Admins can only update their own company.
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not authorized to update this company
 *       404:
 *         description: Company not found
 */
router.put('/:id', protect, isCompanyAdmin, updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The company ID
 *     description: Delete a company. Only accessible to Super Admins.
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Only Super Admins can delete companies
 *       404:
 *         description: Company not found
 */
router.delete('/:id', protect, isSuperAdmin, deleteCompany);

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The company ID
 *         name:
 *           type: string
 *           description: The company name
 *         SIREN:
 *           type: string
 *           description: SIREN identification number
 *         SIRET:
 *           type: string
 *           description: SIRET identification number
 *         code_postal:
 *           type: string
 *           description: Postal code
 *         code_NAF:
 *           type: string
 *           description: NAF code (business activity classification)
 *         chiffre_d_affaires:
 *           type: number
 *           description: Annual revenue
 *         EBIT:
 *           type: number
 *           description: Earnings Before Interest and Taxes
 *         latitude:
 *           type: number
 *           description: Geographic latitude
 *         longitude:
 *           type: number
 *           description: Geographic longitude
 *         pdm:
 *           type: number
 *           description: Market share (parts de marché)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the company was created
 */

module.exports = router; 