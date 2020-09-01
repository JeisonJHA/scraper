import { Model } from "sequelize";

export interface ProductAttributes {
  id: number;
  title: string;
  link: string;
  date: string;
  description: string;
  value: string;
}

class Product extends Model<ProductAttributes> {
}

export default Product;
