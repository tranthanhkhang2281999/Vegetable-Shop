import { switchMap } from 'rxjs/operators';
import { OrderService } from './../order.service';
import { AuthService } from './../auth.service';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  orders$: Observable<any[]>;

  constructor(private authService: AuthService, private orderService: OrderService) {
    this.orders$ = this.authService.user$.pipe(
      switchMap(u => this.orderService.getOrdersByUser(u.uid))
    );
  }
}
