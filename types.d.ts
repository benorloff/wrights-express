// resource.d.ts

export interface SalesDepartment {
  id: number | null;
  code: string | null;
}

export interface Pricing {
  sellPrice: string[];
  currMargin: string;
  currMarginPct: string;
  avgMargin: string;
  avgMarginPct: string;
}

export interface UOM {
  description: string | null;
  location: string;
  weight: string;
}

export interface Levy {
  code: string | null;
}

export interface PrimaryVendor {
  vendorNo: string | null;
}

export interface Links {
  self: string;
}

export interface InventoryItem {
  id: number;
  whse: string;
  partNo: string;
  description: string;
  status: number;
  availableQty: string;
  onHandQty: string;
  backorderQty: string;
  committedQty: string;
  onPurchaseQty: string;
  buyMeasureCode: string;
  stockMeasureCode: string;
  sellMeasureCode: string;
  alternatePartNo: string | null;
  currentCost: string;
  averageCost: string;
  standardCost: string;
  groupNo: string | null;
  type: string;
  salesDepartment: SalesDepartment;
  userDef1: string | null;
  userDef2: string;
  poDueDate: string | null;
  currentPONo: string | null;
  reorderPoint: string;
  minimumBuyQty: string;
  lastYearQty: string;
  lastYearSales: string;
  thisYearQty: string;
  thisYearSales: string;
  nextYearQty: string;
  nextYearSales: string;
  allowBackorders: boolean;
  allowReturns: boolean;
  dutyPct: string;
  freightPct: string;
  defaultExpiryDate: string | null;
  lotConsumeType: string | null;
  manufactureCountry: string | null;
  harmonizedCode: string | null;
  suggestedOrderQty: string;
  pricing: Pricing;
  uom: UOM;
  packSize: string;
  foregroundColor: number;
  backgroundColor: number;
  levy: Levy;
  primaryVendor: PrimaryVendor;
  allowBackOrders: boolean;
  dfltExpiryDays: number | null;
  mfgCountry: string | null;
  hsCode: string | null;
  serializedMode: string;
  upload: boolean;
  lastModified: string | null;
  lastSaleDate: string | null;
  lastReceiptDate: string | null;
  lastCountDate: string | null;
  lastCountQty: number | null;
  lastCountVariance: number | null;
  created: string;
  createdBy: string;
  modified: string;
  modifiedBy: string;
  links: Links;
}

export interface InventoryCollection {
  records: InventoryItem[];
  start: number;
  limit: number;
  count: number;
}