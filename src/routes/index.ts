import express from 'express';

import scrap from './scrap.olx';

const router = express.Router();

router.use(scrap);

export default router;