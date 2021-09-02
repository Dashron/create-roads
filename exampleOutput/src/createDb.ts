import { API, APIConfig } from './api/api';
import config from './config';
import * as path from 'path';

let test = new API(config(path.join(__dirname, '../config'), 'api', 'dev') as APIConfig);
test.createDBTables();