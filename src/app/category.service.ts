import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Category } from './models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afs: AngularFirestore) { }

  getAll() {
    return this.afs.collection<Category>('categories');
  }
}
