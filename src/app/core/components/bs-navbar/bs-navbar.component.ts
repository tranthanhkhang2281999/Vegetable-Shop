import { Observable } from 'rxjs';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { AuthService } from 'shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AppUser } from 'shared/models/app-user';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  appUser: AppUser;
  cart$: Observable<ShoppingCart>;

  constructor(private auth: AuthService, private cartService: ShoppingCartService) {
  }

  async ngOnInit() {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);

    // const cart = await this.cartService.getCart();
    // cart.collection('items').valueChanges().subscribe(items => {
    //   this.shoppingCartItemCount = 0;
    //   this.shoppingCartItemCount = items.reduce((sum, item) => sum += item.quantity, 0);
    // });

    this.cart$ = await this.cartService.getCart();
  }

  logout() {
    this.auth.logout();
  }
}
