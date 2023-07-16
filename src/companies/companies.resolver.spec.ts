import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesResolver } from './companies.resolver';
import { CompaniesService } from './companies.service';
import { createMock } from '@golevelup/ts-jest';
import { Company } from './company.schema';

describe('CompaniesResolver', () => {
  let resolver: CompaniesResolver;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesResolver,
        {
          provide: CompaniesService,
          useValue: createMock(),
        },
      ],
    }).compile();

    resolver = module.get<CompaniesResolver>(CompaniesResolver);
    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('#getCompaniesWithCost', async () => {
    const mockCompanies = createMock<Company[]>([
      {
        id: 'uuid-1',
        name: 'Webprovise Corp',
        createdAt: '2021-02-26T00:55:36.632Z',
        parentId: '0',
        cost: 52983,
        children: [
          {
            id: 'uuid-2',
            name: 'Stamm LLC',
            createdAt: '2021-02-25T10:35:32.978Z',
            parentId: 'uuid-1',
            cost: 5199,
            children: [],
          },
        ],
      },
    ]);

    jest
      .spyOn(service, 'getCompaniesWithCost')
      .mockResolvedValue(mockCompanies);

    await expect(resolver.getCompaniesWithCost()).resolves.toEqual(
      mockCompanies,
    );
    expect(service.getCompaniesWithCost).toHaveBeenCalledTimes(1);
    expect(service.getCompaniesWithCost).toHaveBeenCalledWith();
  });
});
