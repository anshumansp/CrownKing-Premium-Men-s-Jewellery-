import { Table, Column, Model, DataType } from 'sequelize-typescript';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

@Table({
  tableName: 'categories',
  timestamps: true,
  indexes: [
    {
      fields: ['name'],
    },
    {
      fields: ['slug'],
      unique: true,
    },
  ],
})
export class Category extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  subCategories!: SubCategory[];
} 