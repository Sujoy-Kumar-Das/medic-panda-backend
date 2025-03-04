import { OrderStatus } from './order.interface';

export const allowedOrderStatusTransitions: Record<OrderStatus, OrderStatus[]> =
  {
    [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
    [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
    [OrderStatus.CANCELED]: [],
    [OrderStatus.RETURNED]: [],
  };
