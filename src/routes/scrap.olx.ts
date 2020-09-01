import {Router} from 'express';
import ScrapController from '../controllers/ScrapController';

const scrap = Router();

const scrapController = new ScrapController();

scrap.post('/scrap-olx', scrapController.create);

export default scrap;