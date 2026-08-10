interface subAccount {
  id: string
  reference: string
  parentAccountId: string
  createdBy: string
  createdAt: string
}

export interface PrisonerAccountResponse {
  id: string
  reference: string
  createdBy: string
  createdAt: string
  type: string
  subAccounts: subAccount[]
}
