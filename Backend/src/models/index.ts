import {DataTypes, Sequelize} from 'sequelize';
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
dotenv.config();

class SequelizeService {
	private static instance: SequelizeService;
	private readonly sequelize: any;
	private isAuthenticated: boolean = false;

	private db: any = {};
	private basename = path.basename(__filename);

	constructor() {
		const username = process.env.DB_USERNAME;
		const password = process.env.DB_PASSWORD;
		const host = process.env.DB_HOST;
		const port = process.env.DB_PORT;
		const database = process.env.DB_DATABASE;

        const connectionString: string = `postgres://${username}:${password}@${host}:${port}/${database}`;
		// const connectionString: string = process.env.pg_connection_string + '';
		this.sequelize = new Sequelize(connectionString, {
			dialect:'postgres',
			pool: {
				max: process.env?.max ? +process.env.max : 2,
				min: process.env?.min ? +process.env.min : 0,
				idle: process.env?.idle ? +process.env.idle : 1000,
				acquire: process.env?.acquire ? +process.env.acquire : 2000,
				evict: process.env.evict ? +process.env.evict : 12000
			},
			ssl: true,
			omitNull: false,
			logging: false,
		});
		this.loadModels();
	}

	async connect() {
		if (!this.isAuthenticated) {
			// await this.sequelize.authenticate();
			await this.sequelize.sync();
			// await this.sequelize.sync({alter: true});

			this.isAuthenticated = true;
            console.log("Models are synchronized with the database");
            
		} else {
			// restart connection pool to ensure connections are not re-used across invocations
			this.sequelize.connectionManager.initPools();

			// restore `getConnection()` if it has been overwritten by `close()`
			if (this.sequelize.connectionManager.hasOwnProperty("getConnection")) {
				delete this.sequelize.connectionManager.getConnection;
			}
		}
	}

	async disconnect() {
		await this.sequelize.connectionManager.close();
	};

	getSequelize(): any {
		return this.sequelize;
	}

	isConnected(): boolean {
		return this.isAuthenticated;
	}

	getDB(): any {
		return this.db;
	}

	loadModels() {
		fs.readdirSync(__dirname)
			.filter((file: string) => {
				return (file.indexOf('.') !== 0) && (file !== this.basename)
					&& ((file.slice(-9) === '.model.js') || (file.slice(-9) === '.model.ts'));
			})
			.forEach((file: any) => {
				const model = require(path.join(__dirname, file))(this.sequelize, DataTypes);
				this.db[model.name] = model;
			});

		Object.keys(this.db).forEach(modelName => {
			if (this.db[modelName].associate) {
				this.db[modelName].associate(this.db);
			}
		});
	}

	// re-use the sequelize instance across invocations to improve performance
	static getInstance(): SequelizeService {
		if (!SequelizeService.instance) {
			SequelizeService.instance = new SequelizeService();
		}
		return SequelizeService.instance;
	}
}

const sequelizeService: SequelizeService = SequelizeService.getInstance();
const db = sequelizeService.getDB();
db.sequelize = sequelizeService;
export default db;
