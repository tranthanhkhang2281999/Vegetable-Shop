import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { ProductService } from 'shared/services/product.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsCollection: AngularFirestoreCollection<Product>;
  products$: Observable<Product[]>;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;

  productsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService) {
  }

  async ngOnInit() {
    this.cart$ = await this.cartService.getCart();
    this.populateProducts();
  }

  private populateProducts() {
    this.products$ = this.productService.getAll();

    this.productsSubscription = this.products$
      .pipe(
        switchMap(products => {
          this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get('category');

        this.applyFilter();
      });
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
      this.products.filter(p => p.category === this.category) :
      this.products;
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
}
