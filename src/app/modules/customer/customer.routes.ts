import express from 'express';
import { customerServiceController } from './customer.controller';
const router = express.Router();

router.post('/user', customerServiceController.createCustomerController);

export const customerServiceRouter = router;
