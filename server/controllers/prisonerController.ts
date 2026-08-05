import { NextFunction, Request, Response } from 'express'
import { Page } from '../services/auditService'
import type { Services } from '../services'
import { PrisonerTransactionResponse } from '../interfaces/prisonerTransactionResponse'
import buildPaginationItems from '../utils/mojPaginationHelper'

class PrisonerController {
    constructor(private readonly services: Services) { }

    public getTransactions = async (req: Request, res: Response, next: NextFunction) => {

        const prisonNumber = req.params.prisonNumber.toString()

        const { startDate, endDate, credit, debit, page } = req.query as Record<string, string>

        const { subAccount = null } = res.locals

        const transactionPage = await this.services.PrisonerFinanceService.getPrisonerTransactionsByPrisonNumber({
            prisonNumber,
            subAccountReference: subAccount,
            page,
            startDate,
            endDate,
            credit,
            debit,
        })

        res.render('pages/transactions/prisonerTransactions', { transactionPage })
    }
}

export default PrisonerController