import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import * as usersService from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: usersService.UsersService) {}
  @Get() // GET /users or /users?role=value
  findAll(@Query('role') role?: usersService.UserRole): usersService.User[] {
    return this.usersService.findAll(role);
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id', ParseIntPipe) id: number): usersService.User {
    return this.usersService.findOne(id);
  }

  @Post() // POST /users
  create(@Body(ValidationPipe) user: CreateUserDto): usersService.User {
    return this.usersService.create(user);
  }

  @Patch(':id') // PATCH /users/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) userUpdate: UpdateUserDto,
  ): usersService.User {
    return this.usersService.update(id, userUpdate);
  }

  @Delete(':id') // DELETE /users/:id
  delete(@Param('id', ParseIntPipe) id: number): usersService.User {
    return this.usersService.delete(id);
  }
}
