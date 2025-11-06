import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export type UserRole = 'INTERN' | 'ENGINEER' | 'ADMIN';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', role: 'INTERN' },
    { id: 2, name: 'Jane Smith', role: 'ENGINEER' },
    { id: 3, name: 'Admin User', role: 'ADMIN' },
    { id: 4, name: 'Alice Johnson', role: 'ENGINEER' },
    { id: 5, name: 'Bob Brown', role: 'INTERN' },
  ];

  findAll(role?: UserRole): User[] {
    if (role) {
      const users = this.users.filter((user) => user.role === role);
      if (users.length > 0) {
        return users.sort((a, b) => a.id - b.id);
      }
      throw new NotFoundException(`No users with role "${role}" found`);
    }
    return this.users.sort((a, b) => a.id - b.id);
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  create(user: CreateUserDto): User {
    const usersByHighestId = [...this.users.sort((a, b) => b.id - a.id)];
    const newUser: User = {
      id: usersByHighestId[0].id + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userUpdate: UpdateUserDto): User {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...userUpdate };
      }
      return user;
    });
    return this.findOne(id);
  }

  delete(id: number): User {
    const userToDelete = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return userToDelete;
  }
}
