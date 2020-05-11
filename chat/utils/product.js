'user strict';
const DB = require('./db');

class Product{
	
	constructor(app){
		this.db = DB;
	}

	async getUsers(userId, toUserId){
		try {
			return await this.db.query(
				`SELECT * FROM users ORDER BY id ASC`
			);
		} catch (error) {
			console.warn(error);
			return null;
		}
	}
}
module.exports = new Product();