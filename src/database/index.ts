import path from 'path';
import { Sequelize, DataTypes } from "sequelize";

import { Product } from "./models";

class DB {
  public db: any = {};
  public sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: path.resolve(__dirname, 'data/scrap.db')    
    });

    this.initModels();
  }

  private initModels() {
    Product.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        title: DataTypes.STRING,
        link: DataTypes.STRING,
        date: DataTypes.STRING,
        description: DataTypes.STRING,
        value: DataTypes.INTEGER,
      },
      {
        sequelize: this.sequelize,
        tableName: "Product",
      }
    );
  }

  public connect(): any {
    return (
      this.sequelize
        .authenticate()
        .then(() => {
          console.info("Connection to DB successful");
          return this.sequelize.sync();
        })
        .catch((error: any) =>
          console.error(`Error create connection: ' ${error}`)
        )
    );
  }
}

const dbInstance = new DB();

export default dbInstance;
export const db = { ...dbInstance.sequelize.models };
export const sequelize = dbInstance.sequelize;
