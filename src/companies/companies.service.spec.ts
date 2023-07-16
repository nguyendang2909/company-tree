import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { createMock } from '@golevelup/ts-jest';
import { Company } from './company.schema';
import { HttpService } from '@nestjs/axios';

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getCompaniesWithCost', () => {
    it('Should get companies successfully', async () => {
      const mockResponseFetchData = createMock({
        companies: [
          {
            id: 'uuid-1',
            createdAt: '2021-02-26T00:55:36.632Z',
            name: 'Webprovise Corp',
            parentId: '0',
          },
        ],
        travels: [
          {
            id: 'uuid-t1',
            createdAt: '2020-08-27T00:22:26.927Z',
            employeeName: 'Garry Schuppe',
            departure: 'Saint Kitts and Nevis',
            destination: 'Pitcairn Islands',
            price: '362.00',
            companyId: 'uuid-1',
          },
        ],
      });
      const mockTreeCompanies = createMock<Company[]>([
        {
          id: 'uuid-1',
          name: 'Webprovise Corp',
          createdAt: '2021-02-26T00:55:36.632Z',
          parentId: '0',
          cost: 362,
          children: [],
        },
      ]);

      jest.spyOn(service, 'fetchData').mockResolvedValue(mockResponseFetchData);
      jest
        .spyOn(service, 'getCompaniesTree')
        .mockReturnValue(mockTreeCompanies);

      await expect(service.getCompaniesWithCost()).resolves.toEqual(
        mockTreeCompanies,
      );

      expect(service.fetchData).toHaveBeenCalledTimes(1);
      expect(service.fetchData).toHaveBeenCalledWith();
      expect(service.getCompaniesTree).toHaveBeenCalledTimes(1);
      expect(service.getCompaniesTree).toHaveBeenCalledWith(
        mockResponseFetchData.companies,
        mockResponseFetchData.travels,
      );
    });
  });

  describe('#getCompaniesTree', () => {
    it('Should get tree companies successfully', () => {
      const mockCompanies = [
        {
          id: 'uuid-1',
          createdAt: '2021-02-26T00:55:36.632Z',
          name: 'Webprovise Corp',
          parentId: '0',
        },
      ];
      const mockTravels = [
        {
          id: 'uuid-t1',
          createdAt: '2020-08-27T00:22:26.927Z',
          employeeName: 'Garry Schuppe',
          departure: 'Saint Kitts and Nevis',
          destination: 'Pitcairn Islands',
          price: '362.00',
          companyId: 'uuid-1',
        },
      ];

      jest.spyOn(service, 'getCost').mockReturnValue(10);

      expect(service.getCompaniesTree(mockCompanies, mockTravels)).toEqual([
        { ...mockCompanies[0], cost: 10, children: [] },
      ]);
      expect(service.getCost).toHaveBeenCalledTimes(1);
      expect(service.getCost).toHaveBeenCalledWith(
        mockCompanies[0].id,
        [],
        mockTravels,
      );
    });
  });

  describe('#getCost', () => {
    it('Should get tree companies successfully with children company tree', () => {
      const mockCompanyId = 'uuid-1';
      const mockChildrenTree = [
        {
          id: 'uuid-2',
          name: 'Stamm LLC',
          createdAt: '2021-02-25T10:35:32.978Z',
          parentId: 'uuid-1',
          cost: 5199,
          children: [],
        },
      ];
      const mockTravels = [
        {
          id: 'uuid-t1',
          createdAt: '2020-08-27T00:22:26.927Z',
          employeeName: 'Garry Schuppe',
          departure: 'Saint Kitts and Nevis',
          destination: 'Pitcairn Islands',
          price: '15713.00',
          companyId: 'uuid-2',
        },
      ];
      const mockCostForCompany = 10;

      jest
        .spyOn(service, 'calculateCostForCompany')
        .mockReturnValue(mockCostForCompany);
      jest.spyOn(service, 'calculateCostForCompanyTree').mockReturnValue(1000);

      expect(
        service.getCost(mockCompanyId, mockChildrenTree, mockTravels),
      ).toEqual(1000);
      expect(service.calculateCostForCompany).toHaveBeenCalledTimes(1);
      expect(service.calculateCostForCompany).toHaveBeenCalledWith(
        mockCompanyId,
        mockTravels,
      );
      expect(service.calculateCostForCompanyTree).toHaveBeenCalledTimes(1);
      expect(service.calculateCostForCompanyTree).toHaveBeenCalledWith(
        mockCostForCompany,
        mockChildrenTree,
      );
    });

    it('Should get tree companies successfully without children company tree', () => {
      const mockCompanyId = 'uuid-1';
      const mockChildrenTree = [];
      const mockTravels = [
        {
          id: 'uuid-t1',
          createdAt: '2020-08-27T00:22:26.927Z',
          employeeName: 'Garry Schuppe',
          departure: 'Saint Kitts and Nevis',
          destination: 'Pitcairn Islands',
          price: '15713.00',
          companyId: 'uuid-2',
        },
      ];

      jest.spyOn(service, 'calculateCostForCompany').mockReturnValue(10);
      jest.spyOn(service, 'calculateCostForCompanyTree').mockReturnValue(1000);

      expect(
        service.getCost(mockCompanyId, mockChildrenTree, mockTravels),
      ).toEqual(10);
      expect(service.calculateCostForCompany).toHaveBeenCalledTimes(1);
      expect(service.calculateCostForCompany).toHaveBeenCalledWith(
        mockCompanyId,
        mockTravels,
      );
    });
  });

  describe('#calculateCostForCompany', () => {
    it('Should calculate cost for company successfully', () => {
      const mockCompanyId = 'uuid-1';
      const mockTravels = [
        {
          id: 'uuid-t1',
          createdAt: '2020-08-27T00:22:26.927Z',
          employeeName: 'Garry Schuppe',
          departure: 'Saint Kitts and Nevis',
          destination: 'Pitcairn Islands',
          price: '362.00',
          companyId: 'uuid-1',
        },
        {
          id: 'uuid-t1',
          createdAt: '2020-08-27T00:22:26.927Z',
          employeeName: 'Garry Schuppe',
          departure: 'Saint Kitts and Nevis',
          destination: 'Pitcairn Islands',
          price: '362.00',
          companyId: 'uuid-1',
        },
      ];

      expect(
        service.calculateCostForCompany(mockCompanyId, mockTravels),
      ).toEqual(724);
    });
  });

  describe('#calculateCostForCompanyTree', () => {
    it('Should calculate cost for company successfully', () => {
      const mockCostForCompany = 10;
      const mockChildrenTree = [
        {
          id: 'uuid-2',
          name: 'Stamm LLC',
          createdAt: '2021-02-25T10:35:32.978Z',
          parentId: 'uuid-1',
          cost: 5199,
          children: [],
        },
      ];

      expect(
        service.calculateCostForCompanyTree(
          mockCostForCompany,
          mockChildrenTree,
        ),
      ).toEqual(5209);
    });
  });
});
