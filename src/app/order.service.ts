import { map } from 'rxjs/operators';
import { ShoppingCartService } from './shopping-cart.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from './models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private afs: AngularFirestore, private cartService: ShoppingCartService) { }

  async placeOrder(order) {
    // const result = await this.afs.collection('orders').add({ ...order });
    // this.cartService.clearCart();


    const [result, ] = await Promise.all([
      this.afs.collection('orders').add({ ...order }),
      this.cartService.clearCart()]);

    return result;
  }

  getOrder() {
    return this.afs.collection('orders').snapshotChanges()
      .pipe(
        map(orderList => orderList.map(order => {
          const data = order.payload.doc.data() as Order;
          const date = new Date(data.datePlaced).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          return { ...data, datePlaced: date };
        }))
      );
  }

  getOrdersByUser(userId: string) {
    return this.afs.collection('orders', ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(orderList => orderList.map(order => {
          const data = order.payload.doc.data() as Order;
          const date = new Date(data.datePlaced).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          return { ...data, datePlaced: date };
        }))
      );
  }
}
