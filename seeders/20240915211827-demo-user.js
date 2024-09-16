'use strict';
const { getUserTypes, UserTypes } = require('../enums/UserTypes');
const hashPassword = require('../helpers/auth').hashPassword;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await hashPassword('123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin',
        email: 'admin@example.com',
        password: await hashPassword('admin'),
        type: UserTypes.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'root',
        email: 'root@example.com',
        password: await hashPassword('root'),
        type: UserTypes.ROOT,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: await hashPassword('alice123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: await hashPassword('bob123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: await hashPassword('charlie123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'David',
        email: 'david@example.com',
        password: await hashPassword('david123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eva',
        email: 'eva@example.com',
        password: await hashPassword('eva123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Frank',
        email: 'frank@example.com',
        password: await hashPassword('frank123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Grace',
        email: 'grace@example.com',
        password: await hashPassword('grace123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Henry',
        email: 'henry@example.com',
        password: await hashPassword('henry123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Isabella',
        email: 'isabella@example.com',
        password: await hashPassword('isabella123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jack',
        email: 'jack@example.com',
        password: await hashPassword('jack123'),
        type: UserTypes.USER,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
