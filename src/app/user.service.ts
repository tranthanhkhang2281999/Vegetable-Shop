import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AppUser } from './models/app-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afs: AngularFirestore) { }

  save(user: firebase.User) {
    this.afs.collection('user').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    }, { merge: true });
  }

  get(uid: string) {
    return this.afs.collection('user').doc<AppUser>(uid).valueChanges();
  }
}
