type Gender = "MALE" | "FEMALE" | "OTHER";

type CustomerType = "INDIVIDUAL" | "BUSINESS";

type BusinessType =
  | "CORPORATION"
  | "SOLE_PROPRIETOR"
  | "PARTNERSHIP"
  | "COOPERATIVE"
  | "TRUST"
  | "NON_PROFIT"
  | "GOVERNMENT";

type IdentityAccountType =
  | "BANK_ACCOUNT"
  | "EWALLET"
  | "CREDIT_CARD"
  | "PAY_LATER"
  | "OTC"
  | "QR_CODE"
  | "SOCIAL_MEDIA";

interface BankAccount {
  account_number: string;
  account_holder_name: string;
}

interface IdentityAccount {
  type: IdentityAccountType;
  company?: string;
  description?: string;
  country?: string;
  properties?: Properties;
}

interface Address {
  country: string;
  street_line1?: string;
  street_line2?: string;
  city?: string;
  province_state?: string;
  postal_code?: string;
  category?: string;
  is_primary?: boolean;
}

interface IndividualDetail {
  given_names: string;
  surname?: string;
  nationality?: string;
  place_of_birth?: string;
  date_of_birth?: string;
  gender?: Gender;
  employment?: Employment;
}

interface BusinessDetail {
  business_name: string;
  trading_name?: string;
  business_type: BusinessType;
  nature_of_business?: string;
  business_domicile?: string;
  date_of_registration?: string;
}

export interface CreateCustomerRequest {
  reference_id: string;
  type: CustomerType;
  individual_detail?: IndividualDetail;
  business_detail?: BusinessDetail;
  mobile_number?: string;
  phone_number?: string;
  hashed_phone_number?: string;
  email?: string;
  addresses?: Address[];
  identity_accounts?: IdentityAccount[];
}

export interface CustomerResponse {
  id: string;
  reference_id: string;
  type: CustomerType;
  individual_detail: IndividualDetail;
  business_detail: BusinessDetail | null;
  email: string;
  mobile_number: string;
  phone_number?: string;
  hashed_phone_number?: string;
  addresses: Address[];
  identity_accounts: IdentityAccount[];
  kyc_documents: KycDocument[];
  description?: string;
  date_of_registration: string;
  domicile_of_registration?: string;
  metadata: Metadata;
  created: string;
  updated: string;
}

interface Employment {
  employer_name?: string;
  nature_of_business?: string;
  role_description?: string;
}

interface Properties {
  token_id?: string;
}

interface KycDocument {
  type: string;
  sub_type: string;
  country: string;
  document_name: string;
  document_number: string;
  expires_at?: string | null;
  holder_name: string;
  document_images: string[];
}

interface Metadata {
  foo: string;
}
