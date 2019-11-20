import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { ProductService } from 'shared/services/product.service';
import { CategoryService } from 'shared/services/category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from 'shared/models/category';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categoriesCollection: AngularFirestoreCollection<Category>;
  categories$: Observable<Category[]>;
  product = {};
  id;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService) {
    this.categoriesCollection = categoryService.getAll();
    this.categories$ = this.categoriesCollection.snapshotChanges()
      .pipe(
        map(productList => productList.map(p => {
          const data = p.payload.doc.data() as Category;
          const id = p.payload.doc.id;
          return { id, ...data };
        }))
      );

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService
        .get(this.id).valueChanges()
        .pipe(
          take(1)
        )
        .subscribe(p => this.product = p);
    }
  }

  ngOnInit() {
  }

  save(product) {
    if (this.id) {
      this.productService.update(this.id, product);
    } else {
      this.productService.create(product);
    }
    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) { return; }

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }
}
