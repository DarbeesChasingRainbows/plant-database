import { Column, Index } from 'https://esm.sh/typeorm@0.3.20/es2022/typeorm.mjs';
import { Entity } from "npm:typeorm";
import { BaseEntity } from "./BaseEntity.ts";

@Entity()
export class Plant extends BaseEntity {
@Column({ type: "varchar", length: 100 })
  @Index("botanical_name_idx", { unique: true })
  botanical_name!: string;

  @Column("varchar", { length: 100 })
  @Index("common_name_idx")
  common_name!: string;

  @Column("string", { length: 100, nullable: true })
  family?: string;

  @Column("text")
  description!: string;

  @Column("boolean", { default: false })
  is_medicinal!: boolean;

  @Column("boolean", { default: false })
  is_food_crop!: boolean;

  @Column("ltree")
  taxonomy!: string;
}