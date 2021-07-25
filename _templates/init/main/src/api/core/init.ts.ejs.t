---
to: src/api/core/init.ts
---
import APIProject from './apiProject';
import config as configModule from '../../config';
import { createLogger } from '../../logger';
const ENVIRONMENT = process.env.ROADS_ENV || 'default';
const configData = configModule(`${__dirname  }/../config`, ENVIRONMENT);
import * as activeRoutes from '../activeRoutes';

const api = new APIProject(configData.api, createLogger('apiInit'));
api.addRoadsUserEndpoints();
activeRoutes.registerInit(api);
api.setup();