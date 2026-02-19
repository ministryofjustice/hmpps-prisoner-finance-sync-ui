export default class PrisonerTransactionService {
  async getTransactions(prisonerNumber: string, accountTypes: string[] = []) {
    if (prisonerNumber !== 'A9971EC') {
      return []
    }

    const allTransactions = [
      {
        date: '2026-02-18',
        description: 'Catalogue Spends 1',
        account: 'Spends',
        credit: 0,
        debit: 2.2,
        currentBalance: 20.93,
        location: 'LEI',
      },
      {
        date: '2026-02-18',
        description: 'Anonymous Cash - Savings',
        account: 'Savings',
        credit: 13.0,
        debit: 0,
        currentBalance: 13.0,
        location: 'LEI',
      },
      {
        date: '2026-02-15',
        description: 'Cash To Spends Transfer',
        account: 'Cash',
        credit: 0,
        debit: 3.33,
        currentBalance: 0.0,
        location: 'LEI',
      },
      {
        date: '2026-02-15',
        description: 'Cash To Spends Transfer',
        account: 'Spends',
        credit: 3.33,
        debit: 0,
        currentBalance: 23.13,
        location: 'LEI',
      },
      {
        date: '2026-02-15',
        description: 'Offender Payroll From:09/02/2026 To:13/02/2026',
        account: 'Spends',
        credit: 2.5,
        debit: 0,
        currentBalance: 19.8,
        location: 'LEI',
      },
      {
        date: '2026-02-10',
        description: 'Cash Bonus',
        account: 'Cash',
        credit: 3.33,
        debit: 0,
        currentBalance: 3.33,
        location: 'LEI',
      },
      {
        date: '2026-02-10',
        description: 'Bonus - Spends',
        account: 'Spends',
        credit: 1.0,
        debit: 0,
        currentBalance: 17.3,
        location: 'LEI',
      },
      {
        date: '2026-02-08',
        description: 'Cash To Spends Transfer',
        account: 'Cash',
        credit: 0,
        debit: 5.0,
        currentBalance: 0.0,
        location: 'LEI',
      },
      {
        date: '2026-02-08',
        description: 'Cash To Spends Transfer',
        account: 'Spends',
        credit: 5.0,
        debit: 0,
        currentBalance: 16.3,
        location: 'LEI',
      },
      {
        date: '2026-02-08',
        description: 'Offender Payroll From:03/02/2026 To:06/02/2026',
        account: 'Spends',
        credit: 2.0,
        debit: 0,
        currentBalance: 11.3,
        location: 'LEI',
      },
      {
        date: '2026-02-05',
        description: 'Sub-Account Transfer',
        account: 'Cash',
        credit: 0,
        debit: 5.0,
        currentBalance: 5.0,
        location: 'LEI',
      },
      {
        date: '2026-02-05',
        description: 'Sub-Account Transfer',
        account: 'Spends',
        credit: 5.0,
        debit: 0,
        currentBalance: 9.3,
        location: 'LEI',
      },
      {
        date: '2026-02-05',
        description: 'Money Through Post',
        account: 'Cash',
        credit: 10.0,
        debit: 0,
        currentBalance: 10.0,
        location: 'LEI',
      },
      {
        date: '2026-02-04',
        description: 'Canteen Spend',
        account: 'Spends',
        credit: 0,
        debit: 0.7,
        currentBalance: 4.3,
        location: 'LEI',
      },
      {
        date: '2026-02-04',
        description: 'Advance',
        account: 'Spends',
        credit: 5.0,
        debit: 0,
        currentBalance: 5.0,
        location: 'LEI',
      },
    ]

    if (!accountTypes || accountTypes.length === 0) {
      return allTransactions
    }

    return allTransactions.filter(txn => accountTypes.some(type => type.toLowerCase() === txn.account.toLowerCase()))
  }
}
