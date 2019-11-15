import { config } from './config/db-config';
import { createConnection } from 'typeorm';

export async function connect(): Promise<void> {
    await createConnection(config)
}