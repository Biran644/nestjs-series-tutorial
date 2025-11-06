import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let employeesService: EmployeesService;

  const mockEmployeesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    employeesService = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    mockEmployeesService.create.mockResolvedValue(expectedEmployee);

    const result = await controller.create(createEmployeeDto);

    expect(employeesService.create).toHaveBeenCalledWith(createEmployeeDto);
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

    mockEmployeesService.findAll.mockResolvedValue(expectedEmployees);

    const result = await controller.findAll('127.0.0.1');

    expect(employeesService.findAll).toHaveBeenCalledWith(undefined);
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

    mockEmployeesService.findAll.mockResolvedValue(expectedEmployees);

    const result = await controller.findAll('127.0.0.1', 'ENGINEER');

    expect(employeesService.findAll).toHaveBeenCalledWith('ENGINEER');
    expect(result).toEqual(expectedEmployees);
  });
});
