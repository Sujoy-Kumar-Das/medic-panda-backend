import { OrderStatus } from './order.interface';

export const allowedOrderStatusTransitions: Record<OrderStatus, OrderStatus[]> =
  {
    [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.CANCELED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELED]: [],
    [OrderStatus.RETURNED]: [],
    [OrderStatus.PENDING]: [],
  };
