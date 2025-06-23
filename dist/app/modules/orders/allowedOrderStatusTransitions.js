"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedOrderStatusTransitions = void 0;
const order_interface_1 = require("./order.interface");
exports.allowedOrderStatusTransitions = {
    [order_interface_1.OrderStatus.PAID]: [order_interface_1.OrderStatus.PROCESSING, order_interface_1.OrderStatus.CANCELED],
    [order_interface_1.OrderStatus.PROCESSING]: [order_interface_1.OrderStatus.SHIPPED, order_interface_1.OrderStatus.CANCELED],
    [order_interface_1.OrderStatus.SHIPPED]: [order_interface_1.OrderStatus.DELIVERED, order_interface_1.OrderStatus.CANCELED],
    [order_interface_1.OrderStatus.DELIVERED]: [],
    [order_interface_1.OrderStatus.CANCELED]: [],
    [order_interface_1.OrderStatus.RETURNED]: [],
    [order_interface_1.OrderStatus.PENDING]: [],
};
