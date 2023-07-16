import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Company {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  createdAt!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  parentId!: string;

  @Field(() => Number)
  cost!: number;

  @Field(() => [Company], { nullable: true, defaultValue: undefined })
  children!: Company[];
}
