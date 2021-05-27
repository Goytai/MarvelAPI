import {config} from 'dotenv'

switch (process.env.NODE_ENV?.trim()) {
    case 'development':
      config({path: '.env.development'})
      break;
    case 'test':
      config({path: '.env.test'})
      break;
    case 'production':
      config({path: '.env.production'})
      break;
    default:
      config({path: '.env.development'})
  }
