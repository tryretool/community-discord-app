import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const SUBMIT_COMMAND = {
  name: 'submit',
  description: 'Submit a URL',
  options: [{
    type: 3,
    name: 'url',
    description: 'Provide a URL for your Community topic',
    required: true
  }],
  type: 1,
  integration_types: [0],
  contexts: [0, 1, 2],
};

const QUEUE_COMMAND = {
  name: 'queue',
  description: 'See the current queue',
  type: 1,
  integration_types: [0],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [SUBMIT_COMMAND, QUEUE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
