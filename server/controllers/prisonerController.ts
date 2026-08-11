import { NextFunction, Request, Response } from 'express'
import type { Services } from '../services'
import { PrisonerTransactionResponse } from '../interfaces/prisonerTransactionResponse'
import { StatementBalanceResponse } from '../interfaces/statementBalanceResponse'
import { PrisonerTransactionRow } from '../interfaces/prisonerTransactionsRow'
import { Page } from '../services/auditService'

class PrisonerController {
  constructor(private readonly services: Services) {}

  private combineTransactions(
    prisonerTransactions: PrisonerTransactionResponse[],
    statementBalances: StatementBalanceResponse[],
  ): PrisonerTransactionRow[] {
    const transactionRows: PrisonerTransactionRow[] = prisonerTransactions.map(t => ({
      date: new Date(t.date),
      description: t.description,
      location: t.location,
      accountType: t.accountType,
      subAccountBalance: t.subAccountBalance,
      isStatementBalance: false,
      amount: t.debit ? -t.debit : t.credit,
    }))

    const statementBalanceRows: PrisonerTransactionRow[] = statementBalances.map(s => ({
      date: new Date(s.balanceDateTime),
      description: '',
      location: '',
      accountType: '',
      subAccountBalance: s.amount,
      isStatementBalance: true,
      amount: s.amount,
    }))

    return [...transactionRows, ...statementBalanceRows].sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  public getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    await this.services.auditService.logPageView(Page.AUDIT_COMBINED_TRANSACTIONS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const prisonNumber = req.params.prisonNumber.toString()
    const subAccount = req.path.split('/').slice(-1)[0]
    const transactionPage = await this.services.PrisonerFinanceService.getPrisonerTransactionsByPrisonNumber({
      prisonNumber,
      subAccountReference: subAccount,
      page: '1',
      startDate: null,
      endDate: null,
      credit: null,
      debit: null,
    })

    const prisonAccount = (await this.services.GeneralLedgerService.getPrisonerAccount(prisonNumber))[0]
    const subAccountId = prisonAccount.subAccounts.find(
      sa => sa.reference.toLowerCase() === subAccount.toLowerCase(),
    ).id
    const statementBalances =
      await this.services.GeneralLedgerService.getPrisonerSubAccountStatementBalances(subAccountId)
    const mergeTransactions = this.combineTransactions(transactionPage.content, statementBalances)

    res.render('pages/transactions/prisonerTransactions', {
      transactions: mergeTransactions,
      prisonNumber,
      subAccount: subAccount.toLowerCase(),
    })
  }
}

export default PrisonerController
