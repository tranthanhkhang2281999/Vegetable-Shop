import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { ShoppingCart } from '../../models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  constructor(private afs: AngularFirestore) { }

  async getCart() {
    const cartId = await this.getOrCreateCartId();

    return this.afs.collection('shopping-carts').doc(cartId).collection('items')
      .snapshotChanges()
      .pipe(
        map(dataList => {
          const shoppingCartItems = {};

          dataList.map(data => {
            const tempId = data.payload.doc.id as string;
            const tempData = data.payload.doc.data();
            const shoppingCartItem = {
              ...tempData
            } as ShoppingCartItem;
            shoppingCartItems[tempId] = shoppingCartItem;
          });
          return new ShoppingCart(shoppingCartItems);
        })
      );
  }

  addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    const cartRef = await this.getCartRef();
    const listId = [];
    cartRef.collection('items').snapshotChanges()
      .pipe(
        take(1),
        map(items => items.map(i => listId.push(i.payload.doc.id)
        ))
      )
      .subscribe(async () => {
        const listItemRef: AngularFirestoreDocument[] = await Promise.all(listId.map(id => this.getItemRef(id)));
        listItemRef.forEach(itemRef => itemRef.delete());
      });
  }

  private async updateItem(product: Product, change: number) {
    const item: AngularFirestoreDocument = await this.getItemRef(product.id);

    item.valueChanges().pipe(take(1)).subscribe((i = {}) => {
      const tempQuantity = (i.quantity || 0) + change;
      if (tempQuantity === 0) {
        item.delete();
      } else {
        item.set({
          title: product.title,
          imageUrl: product.imageUrl,
          category: product.category,
          price: product.price,
          quantity: tempQuantity
        }, { merge: true });
      }
    });
  }

  private create() {
    return this.afs.collection('shopping-carts').add({
      dateCreated: new Date().getTime()
    });
  }

  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');

    if (cartId) { return cartId; }

    const result = await this.create();
    localStorage.setItem('cartId', result.id);
    return result.id;
  }

  private async getCartRef() {
    const cartId = await this.getOrCreateCartId();
    return this.afs.collection('shopping-carts').doc(cartId);
  }

  private async getItemRef(productId: string) {
    const cartId = await this.getOrCreateCartId();
    return this.afs.collection('shopping-carts').doc(cartId).collection('items').doc(productId);
  }

}
