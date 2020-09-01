import {db} from '../database';
import { ProductAttributes } from "../database/models/Product";

export class ProductCreateServer {
  public async execute(products: ProductAttributes[]) {
    for await (const product of products) {
      if (product && db.Product.findByPk(product.id)) return;

      await db.Product.create(product);      
    }
  }
}