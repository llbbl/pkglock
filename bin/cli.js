#!/usr/bin/env node

import {program} from 'commander';
import path from 'path';
import fs from 'fs';
import winston from 'winston';


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({filename: 'pkg-lock.log'}),
    // new winston.transports.Console()
  ],
});


// call the switch command
program
  .version('0.0.1')
  .option('--local', 'Use local URL')
  .option('--remote', 'Use remote URL')
  .description('switch to an environment defined in pkg.config.js')
  .action(async (options) => {
    const cwd = process.cwd();
    const configPath = path.join(cwd, 'pkg.config.js');
    const packageLockPath = path.join(cwd, 'package-lock.json');


    try {
      const configPromise = await import(configPath);
      const config = configPromise.default;

      // escape the url in config.local for regex
      const escapedLocal = config.local.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const escapedRemote = config.remote.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      if (options.local) {
        logger.info(`Switching to Local URL: ${config.local}`);

        // Reading the content of the package-lock.json file
        fs.readFile(packageLockPath, 'utf-8', (err, data) => {
          if (err) {
            logger.error('Error reading the file:', err);
            return;
          }

          // check if remote URls exist in the file
          const doesRemoteExist = data.includes(config.remote);

          if (!doesRemoteExist) {
            logger.info('Remote URLs do not exist in package-lock.json');
            return;
          }

          // Replacing the remote URLs with the local URLs in the file content
          const modifiedData = data.replace(new RegExp(escapedRemote, 'g'), config.local);

          // Writing the modified content back to package-lock.json
          fs.writeFile(packageLockPath, modifiedData, (err) => {
            if (err) {
              logger.error('Error writing to the file:', err);
            } else {
              const dateTime = formatDate(new Date());
              logger.info(`URLs in package-lock.json have been updated on ${dateTime}`);
            }
          });
        });

      } else if (options.remote) {
        logger.info('Switching to Remote URL:' + config.remote);

        // Reading the content of the package-lock.json file
        fs.readFile(packageLockPath, 'utf-8', (err, data) => {
          if (err) {
            logger.error('Error reading the file:', err);
            return;
          }

          // check if remote URls exist in the file
          const doesLocalExist = data.includes(config.local);

          if (!doesLocalExist) {
            logger.info('Local URLs do not exist in package-lock.json');
            return;
          }

          // Replacing the local URLs with the remote URLs in the file content
          const modifiedData = data.replace(new RegExp(escapedLocal, 'g'), config.remote);

          // Writing the modified content back to package-lock.json
          fs.writeFile(packageLockPath, modifiedData, (err) => {
            if (err) {
              logger.error('Error writing to the file:', err);
            } else {
              const dateTime = formatDate(new Date());
              logger.info(`URLs in package-lock.json have been updated on ${dateTime}`);
            }
          });
        });

      } else {
        logger.info('Specify --local or --remote to choose a NPM Registry you want to switch to');
      }
    } catch (error) {
      logger.error('An error occurred:', error.message);
    }
  });

function formatDate(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23', // Use a 24-hour clock
    timeZoneName: 'short' // Include timezone information
  };

  return date.toLocaleDateString('en-US', options);
}


program.parse(process.argv);
