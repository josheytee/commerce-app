// @WebSocketGateway()
// export class TrackingGateway {
//     @WebSocketServer()
//     server: Server;

//     sendUpdate(orderId: number, data: any) {
//         this.server.to(`order-${orderId}`).emit('tracking', data);
//     }
// }