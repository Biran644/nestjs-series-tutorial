import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { DatabaseService } from '../database/database.service';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an employee', async () => {
    const createEmployeeDto = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ENGINEER' as const,
    };
    const expectedEmployee = {
      id: 1,
      ...createEmployeeDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDatabaseService.employee.create.mockResolvedValue(expectedEmployee);

    const result = await service.create(createEmployeeDto);

    expect(mockDatabaseService.employee.create).toHaveBeenCalledWith({
      data: createEmployeeDto,
    });
    expect(result).toEqual(expectedEmployee);
  });

  it('should find all employees', async () => {
    const expectedEmployees = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ENGINEER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockDatabaseService.employee.findMany.mockResolvedValue(expectedEmployees);

    const result = await service.findAll();

    expect(mockDatabaseService.employee.findMany).toHaveBeenCalled();
    expect(result).toEqual(expectedEmployees);
  });

  it('should find employees by role', async () => {
    const expectedEmployees = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ENGINEER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockDatabaseService.employee.findMany.mockResolvedValue(expectedEmployees);

    const result = await service.findAll('ENGINEER');

    expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith({
      where: { role: 'ENGINEER' },
    });
    expect(result).toEqual(expectedEmployees);
  });
});
