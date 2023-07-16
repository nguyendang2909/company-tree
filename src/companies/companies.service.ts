import { Injectable } from '@nestjs/common';
import { CompanyResponse, TravelResponse } from './companies.type';
import { Company } from './company.schema';
import { HttpService } from '@nestjs/axios';
import { AppConfig } from './app.config';

@Injectable()
export class CompaniesService {
  constructor(private httpService: HttpService) {}

  async getCompaniesWithCost() {
    const { companies, travels } = await this.fetchData();
    return this.getCompaniesTree(companies, travels);
  }

  async fetchData() {
    const [{ data: companies }, { data: travels }] = await Promise.all([
      this.httpService.axiosRef.get<CompanyResponse[]>(
        `${AppConfig.FETCH_URL}/companies`,
      ),
      this.httpService.axiosRef.get<TravelResponse[]>(
        `${AppConfig.FETCH_URL}/travels`,
      ),
    ]);
    return { companies, travels };
  }

  getCompaniesTree(
    companies: CompanyResponse[],
    travels: TravelResponse[],
    parentId = '0',
  ): Company[] {
    const result = [];
    for (const company of companies) {
      if (company.parentId === parentId) {
        const children = this.getCompaniesTree(companies, travels, company.id);
        result.push({
          ...company,
          children,
          cost: this.getCost(company.id, children, travels),
        });
      }
    }
    return result;
  }

  getCost(
    companyId: string,
    childrenTree: Company[],
    travels: TravelResponse[],
  ) {
    const costForCompany = this.calculateCostForCompany(companyId, travels);
    return childrenTree.length
      ? this.calculateCostForCompanyTree(costForCompany, childrenTree)
      : costForCompany;
  }

  calculateCostForCompany(companyId: string, travels: TravelResponse[]) {
    return travels
      .filter((travelResponse) => travelResponse.companyId === companyId)
      .reduce((acc, currenValue) => acc + Number(currenValue.price), 0);
  }

  calculateCostForCompanyTree(costForCompany: number, companyTree: Company[]) {
    return companyTree.reduce(
      (acc, current) => acc + current.cost,
      costForCompany,
    );
  }
}
