import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const config: MysqlConnectionOptions = {
    type: "mysql",
    port: process.env.DB1_PORT ? parseInt(process.env.DB1_PORT) : 3306,
    host: process.env.DB1_HOST || 'localhost',
    username: process.env.DB1_USERNAME,
    password: process.env.DB1_PASSWORD,
    database: process.env.DB1_NAME,
    synchronize: false,
    logging: false,
    timezone: 'Z',
    entities: ['dist/data_module/entities/*.js'],
    migrations: ['dist/data_module/migrations/*.js'],
    cli: {
        migrationsDir: 'src/data_module/migrations'
    },
    extra : { connectionLimit: 10 }
}