import { Resolver, Query } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './company.schema';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [Company], { name: 'companies' })
  public async getCompaniesWithCost() {
    return this.companiesService.getCompaniesWithCost();
  }
}
