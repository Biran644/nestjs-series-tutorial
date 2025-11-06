import { ConsoleLogger, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('en-CA', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Toronto',
    }).format(new Date())}\t${entry}\n`;

    try {
      const filename = path.join(process.cwd(), 'logs', 'myapp.log');

      // Ensure the logs directory exists
      await fs.mkdir(path.dirname(filename), { recursive: true });

      // Append to file (creates file if it doesn't exist)
      await fs.appendFile(filename, formattedEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }
}
