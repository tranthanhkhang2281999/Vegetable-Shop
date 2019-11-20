import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/category.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
