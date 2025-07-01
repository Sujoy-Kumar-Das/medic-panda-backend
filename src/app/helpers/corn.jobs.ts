import cron, { ScheduledTask } from 'node-cron';
import config from '../config';
import { productModel } from '../modules/product/porduct.model';
import { updateRatingsForFetchedProducts } from '../utils/update-rating';
import { updateExpiredDiscountsBulk } from '../utils/updateExpiredDiscounts';

const jobs: ScheduledTask[] = [];
const isTestEnvironment = config.node_env === 'development';

const startCronJobs = () => {
  // Discount Update Job
  const discountSchedule = isTestEnvironment ? '* * * * *' : '*/15 * * * *';
  const discountCronJob = cron.schedule(discountSchedule, async () => {
    console.log(
      `[${new Date().toISOString()}] Running discount expiration check...`,
    );
    try {
      await updateExpiredDiscountsBulk(productModel);
    } catch (error) {
      console.error('Discount cron job failed:', error);
    }
  });

  // Rating Update Job
  const ratingSchedule = isTestEnvironment ? '* * * * *' : '0 0 * * *';
  const ratingCronJob = cron.schedule(ratingSchedule, async () => {
    console.log(`[${new Date().toISOString()}] Running rating update job...`);
    try {
      await updateRatingsForFetchedProducts();
    } catch (error) {
      console.error('Rating cron job failed:', error);
    }
  });

  jobs.push(discountCronJob, ratingCronJob);
  console.log('Cron jobs started with schedules:', {
    discount: discountSchedule,
    rating: ratingSchedule,
  });
};

const stopAllCronJobs = () => {
  jobs.forEach((job) => job.stop());
  console.log('All cron jobs stopped');
};

export { startCronJobs, stopAllCronJobs };
