import axios from 'axios';
import config from '../config';
import AppError from '../errors/AppError';
import { ISSlPayload } from './ssl.interface';

export const sslInitPaymentService = async (payload: ISSlPayload) => {
  const {
    total,
    productId,
    userId,
    productName,
    country,
    phone,
    city,
    userEmail,
    userAddress,
    transactionId,
  } = payload;
  try {
    const paymentData = {
      store_id: config.ssl_store as string,
      store_passwd: config.ssl_password as string,
      total_amount: total.toString(),
      payment_method: 'sslcommerz',
      currency: 'BDT',
      tran_id: transactionId,
      success_url: config.ssl_success_url,
      fail_url: config.ssl_failed_url,
      cancel_url: config.ssl_cancel_url,
      emi_quota: '0',
      product_name: productName,
      product_category: 'topup',
      product_profile: productId,
      cus_email: userEmail,
      cus_add1: userAddress,
      cus_city: city,
      cus_country: country,
      cus_phone: phone as string,
      shipping_method: 'NO',
    };

    const res = await axios.post(config.ssl_url as string, paymentData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const paymentURL = res.data.GatewayPageURL;

    return paymentURL;
  } catch (error) {
    console.error('An error occurred during the payment process:', error);
    throw new AppError(404, 'Failed to payment.');
  }
};
