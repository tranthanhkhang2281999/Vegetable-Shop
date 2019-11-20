import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from 'shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afs: AngularFirestore) { }

  create(product) {
    return this.afs.collection('products').add(product);
  }

  get(productID) {
    return this.afs.collection('products').doc<Product>(productID);
  }

  getAll() {
    return this.afs.collection<Product>('products').snapshotChanges()
      .pipe(
        map(productList => productList.map(p => {
          const data = p.payload.doc.data();
          const id = p.payload.doc.id;

          return { id, ...data } as Product;
        })));
  }

  update(productID, product) {
    return this.afs.collection('products').doc(productID).update(product);
  }

  delete(productID) {
    return this.afs.collection('products').doc(productID).delete();
  }
}
