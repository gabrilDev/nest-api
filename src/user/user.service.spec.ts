import {
  InternalServerErrorException,
  // eslint-disable-next-line prettier/prettier
  NotFoundException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from './../commom/test/TestUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('shoult be list all users', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserById', () => {
    it('should find a existibf user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findUserById('1');
      expect(userFound).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findUserById('3')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);
      const savedUser = await service.createUser(user);
      expect(savedUser).toMatchObject(user);
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
    });
  });
  it('should return a exception when doesnt create a user', async () => {
    const user = TestUtil.giveMeAValidUser();
    mockRepository.save.mockReturnValue(null);
    mockRepository.create.mockReturnValue(user);

    // eslint-disable-next-line prettier/prettier
    await service.createUser(user).catch( e => {
      expect(e).toBeInstanceOf(InternalServerErrorException);
      expect(e).toMatchObject({
        message: 'Problema para criar um usuário.',
      });
    });
    expect(mockRepository.create).toBeCalledTimes(1);
    expect(mockRepository.save).toBeCalledTimes(1);
  });

  describe('updateUser', () => {
    it('Should update a user', async () => {
      const user = TestUtil.giveMeAValidUser();
      const updatedUser = { name: 'Nome Atualizado' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'Nome Atualizado',
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('Should delete a user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.delete.mockReturnValue(user);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
    it('Should not delete a inexisting user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('8');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
