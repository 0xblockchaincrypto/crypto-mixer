const express = require('express');
const router = express.Router();
const commitment = require('../controller/asp');

router.post('/add-commitment', commitment.addCommitment);


module.exports = router;