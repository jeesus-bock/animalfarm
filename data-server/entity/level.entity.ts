import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DBLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  matrix: string;
}
