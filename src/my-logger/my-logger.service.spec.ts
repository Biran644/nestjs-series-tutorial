import { Test, TestingModule } from '@nestjs/testing';
import { MyLoggerService } from './my-logger.service';
import * as fs from 'fs';

// Mock the fs module
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    appendFile: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('MyLoggerService', () => {
  let service: MyLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyLoggerService],
    }).compile();

    service = module.get<MyLoggerService>(MyLoggerService);

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend ConsoleLogger', () => {
    expect(service).toHaveProperty('log');
    expect(service).toHaveProperty('error');
    expect(service).toHaveProperty('logToFile');
  });

  it('should log to file when log method is called', async () => {
    const logSpy = jest
      .spyOn(service, 'logToFile')
      .mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(service, 'log');

    service.log('test message', 'TestContext');

    expect(logSpy).toHaveBeenCalledWith('TestContext\ttest message');
  });

  it('should create log directory and append to file', async () => {
    await service.logToFile('test entry');

    expect(fs.promises.mkdir).toHaveBeenCalled();
    expect(fs.promises.appendFile).toHaveBeenCalled();
  });
});
