'user strict';
const DB = require('./db');

class Product{
	
	constructor(app){
		this.db = DB;
	}

	// Get All Products
	async getProducts(userId, toUserId){
		try {
			return await this.db.query(
				`SELECT * FROM product ORDER BY id ASC`
			);
		} catch (error) {
			console.warn(error);
			return null;
		}
	}

	// Add Product
	async addProducts(params){

		let insert_statement = "INSERT INTO `product` (`product_name`, `product_description`, `sku`, `serial_number`, `purchase_price`, `selling_price`, `quantity`, `reordered_stock_amount`, `expiration_date`, `product_image`) VALUES ( ? )";  
  		let values = [  
			params['product_name'],params['product_description'],params['sku'],params['serial_number'],params['purchase_price'],
			params['selling_price'],params['quantity'],params['reordered_stock_amount'],params['expiration_date'],params['product_image']
		];  
			
		console.log("insert_statement: "+insert_statement);
		console.log("values: "+values);
		try {
			return await this.db.query(insert_statement, [values]);
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
module.exports = new Product();