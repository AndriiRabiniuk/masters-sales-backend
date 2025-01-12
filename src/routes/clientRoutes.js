const express = require('express');
const router = express.Router();
const { 
  createClient, 
  getClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of clients
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getClients);

/**
 * @swagger
 * /api/clients/search:
 *   get:
 *     summary: Search clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Unauthorized
 */
router.get('/search', protect, async (req, res, next) => {
  try {
    const { term, page, limit } = req.query;
    
    if (!term) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search term is required' 
      });
    }
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    const result = await clientService.searchClients(term, options);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 */
router.get('/:id', protect, getClientById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               SIREN:
 *                 type: string
 *               SIRET:
 *                 type: string
 *               nom:
 *                 type: string
 *               code_postal:
 *                 type: string
 *               code_NAF:
 *                 type: string
 *               chiffre_d_affaires:
 *                 type: number
 *               EBIT:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               pdm:
 *                 type: number
 *     responses:
 *       201:
 *         description: Client created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, authorize(['super_admin', 'admin', 'manager',"sales"]), createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SIREN:
 *                 type: string
 *               SIRET:
 *                 type: string
 *               nom:
 *                 type: string
 *               code_postal:
 *                 type: string
 *               code_NAF:
 *                 type: string
 *               chiffre_d_affaires:
 *                 type: number
 *               EBIT:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               pdm:
 *                 type: number
 *     responses:
 *       200:
 *         description: Client updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 */
router.put('/:id', protect, authorize(['super_admin', 'admin', 'manager',"sales"]), updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Client not found
 */
router.delete('/:id', protect, authorize(['super_admin', 'admin']), deleteClient);

module.exports = router; 