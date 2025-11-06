import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', () => {
    const expectedUsers = [
      { id: 1, name: 'John Doe', role: 'INTERN' },
      { id: 2, name: 'Jane Smith', role: 'ENGINEER' },
    ];

    mockUsersService.findAll.mockReturnValue(expectedUsers);

    const result = controller.findAll();

    expect(usersService.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(expectedUsers);
  });
});
