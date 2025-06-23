import cron from 'node-cron';
import { productModel } from '../modules/product/porduct.model';
import updateExpiredDiscounts from '../utils/updateExpiredDiscounts';

// Run every hour at minute 0 (e.g., 1:00, 2:00, etc.)
const productCronJob = cron.schedule(
  '0 * * * *',
  async () => await updateExpiredDiscounts(productModel),
);

const startProductCron = () => {
  productCronJob.start();
  console.log('Product discount cron job started');
  return productCronJob;
};

const stopProductCron = () => {
  productCronJob.stop();
  console.log('Product discount cron job stopped');
};

export { startProductCron, stopProductCron };
