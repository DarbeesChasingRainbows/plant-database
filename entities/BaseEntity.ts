import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "npm:typeorm/common";
  
  export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;
  
    @UpdateDateColumn({ type: "timestamptz" })
    updated_at!: Date;
  }