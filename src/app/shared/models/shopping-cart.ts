import { ShoppingCartItem } from './shopping-cart-item';
import { Product } from './product';

export class ShoppingCart {
    items: ShoppingCartItem[] = [];

    constructor(private itemsMap: { [id: string]: ShoppingCartItem }) {
        this.itemsMap = itemsMap || {};

        for (const productId of Object.keys(itemsMap)) {
            const item = itemsMap[productId];
            this.items.push(new ShoppingCartItem({ id: productId, ...item }));
        }
    }

    getQuantity(product: Product) {
        const item = this.itemsMap[product.id];
        return item ? item.quantity : 0;
    }

    get totalPrice() {
        let total = 0;
        return total = this.items.reduce((sum, item) => sum += item.totalPrice, 0);
    }

    get totalItemsCount() {
        let total = 0;
        return total = this.items.reduce((sum, item) => sum += item.quantity, 0);
    }
}

