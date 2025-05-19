import { QueryInterface, DataTypes } from 'sequelize';

export async function up (queryInterface: QueryInterface): Promise<void> {
    // Create users table first
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });

    // Then create wallets table with foreign key reference to users
    await queryInterface.createTable('wallets', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: true
      },
      chain: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });

    // Create blacklisted_tokens table
    await queryInterface.createTable('blacklisted_tokens', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    // Add index for faster token lookup
    await queryInterface.addIndex('blacklisted_tokens', ['token']);
    
    // Add index for faster cleanup of expired tokens
    await queryInterface.addIndex('blacklisted_tokens', ['expires_at']);
  }

  export async function down (queryInterface: QueryInterface): Promise<void> {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('blacklisted_tokens')
    await queryInterface.dropTable('wallets');
    await queryInterface.dropTable('users');
  }
  