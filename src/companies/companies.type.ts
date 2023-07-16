export type CompanyResponse = {
  id: string;
  createdAt: string;
  name: string;
  parentId: string;
};

export type TravelResponse = {
  id: string;
  createdAt: string;
  employeeName: string;
  departure: string;
  destination: string;
  price: string;
  companyId: string;
};
