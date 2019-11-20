import { Product } from 'app/models/product';
import { ProductService } from './../../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { DataTableResource } from 'angular7-data-table';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  productsCollection: AngularFirestoreCollection<Product>;
  products$: Observable<Product[]>;
  products: Product[];
  subscription: Subscription;

  tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number;

  constructor(private productService: ProductService, private router: Router) {
    this.products$ = this.productService.getAll();

    this.subscription = this.products$.subscribe(products => {
      this.products = products;
      this.initializeTable(this.products);
    });
  }

  ngOnInit() {
  }

  // unsubscribe to avoid memory leak
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeTable(products: Product[]) {
    this.tableResource = new DataTableResource(products);
    this.tableResource.query({ offset: 0 }) //
      .then(items => this.items = items);
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  reloadItems(params) {
    if (!this.tableResource) { return; }

    this.tableResource.query(params)
      .then(items => this.items = items);
  }

  // searching
  filter(query: string) {
    const filteredProducts = query ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
    this.initializeTable(filteredProducts);
  }
}
