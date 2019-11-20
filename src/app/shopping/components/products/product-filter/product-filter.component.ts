import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryService } from 'shared/services/category.service';
import { Category } from 'shared/models/category';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  categoriesCollection: AngularFirestoreCollection<Category>;
  categories$: Observable<Category[]>;
  @Input('category') category;

  constructor(categoryService: CategoryService) {
    this.categoriesCollection = categoryService.getAll();
    this.categories$ = this.categoriesCollection.snapshotChanges()
      .pipe(
        map(category => category.map(cat => {
          const data = cat.payload.doc.data() as Category;
          const id = cat.payload.doc.id;

          return { id, ...data };
        }))
      );
  }

  ngOnInit() {
  }

}
