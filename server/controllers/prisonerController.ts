import { NextFunction, Request, Response } from 'express'
import type { Services } from '../services'
import { PrisonerTransactionResponse } from '../interfaces/prisonerTransactionResponse'
import { StatementBalanceResponse } from '../interfaces/statementBalanceResponse'
import { PrisonerTransactionRow } from '../interfaces/prisonerTransactionsRow'
import AuditPage from '../routes/page'
import { SubjectType } from '../data/hmppsAuditClient'

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

  public getHolds = async (req: Request, res: Response, next: NextFunction) => {
    const prisonNumber = req.params.prisonNumber.toString()

    await this.services.auditService.logPageView(AuditPage.AUDIT_HOLDS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
      subjectType: SubjectType.PRISONER,
      subjectId: prisonNumber,
    })

    const holdsPage = await this.services.prisonerHoldsService.getHolds(prisonNumber)

    res.render('pages/transactions/prisonerHolds', {
      holds: holdsPage.content,
      prisonNumber,
    })
  }

  public getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const prisonNumber = req.params.prisonNumber.toString()

    await this.services.auditService.logPageView(AuditPage.AUDIT_HOLDS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
      subjectType: SubjectType.PRISONER,
      subjectId: prisonNumber,
    })

    const subAccount = req.path.split('/').slice(-1)[0]
    const transactionPage = await this.services.prisonerFinanceService.getPrisonerTransactionsByPrisonNumber({
      prisonNumber,
      subAccountReference: subAccount,
      page: '1',
      startDate: null,
      endDate: null,
      credit: null,
      debit: null,
    })

    const prisonAccount = (await this.services.generalLedgerService.getPrisonerAccount(prisonNumber))[0]
    const subAccountId = prisonAccount.subAccounts.find(
      sa => sa.reference.toLowerCase() === subAccount.toLowerCase(),
    ).id
    const statementBalances =
      await this.services.generalLedgerService.getPrisonerSubAccountStatementBalances(subAccountId)
    const mergeTransactions = this.combineTransactions(transactionPage.content, statementBalances)

    res.render('pages/transactions/prisonerTransactions', {
      transactions: mergeTransactions,
      prisonNumber,
      subAccount: subAccount.toLowerCase(),
    })
  }
}

export default PrisonerController
