import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular7-data-table';
import { AppRoutingModule } from 'app/app-routing.module';

import { SharedModule } from './../shared/shared.module';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminAuthGuard } from './services/admin-auth-guard.service';

@NgModule({
  declarations: [
    ProductFormComponent,
    AdminProductsComponent,
    AdminOrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DataTableModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AdminAuthGuard
  ]
})
export class AdminModule { }
