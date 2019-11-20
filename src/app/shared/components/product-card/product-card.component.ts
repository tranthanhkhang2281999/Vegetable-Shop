import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCart } from '../../../models/shopping-cart';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) {
  }

  ngOnInit() {
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

}
