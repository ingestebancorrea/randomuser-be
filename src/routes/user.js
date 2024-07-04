/* 
    User Routes
    /api/user
*/
const { Router } = require('express');
const { getRandomUsers } = require('../controllers/users');

const router = Router();

// Obtener random_user
router.get('/', getRandomUsers);

module.exports = router;