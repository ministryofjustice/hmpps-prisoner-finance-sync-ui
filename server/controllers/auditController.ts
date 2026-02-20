import { Request, Response, NextFunction } from 'express'
import { Page } from '../services/auditService'
import paginationFromCursor from '../utils/pagination/cursor'
import type { Services } from '../services'
import { auditFilterSchema, formatValidationErrors } from '../validators/auditFilterValidator'

export default class AuditController {
  constructor(private readonly services: Services) {}

  public detail = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.params.requestId as string

    await this.services.auditService.logPageView(Page.AUDIT_DETAIL_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const auditDetail = await this.services.auditHistoryService.getPayloadByRequestId(requestId)
    res.render('pages/audit/detail', { auditDetail })
  }

  public history = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.services.auditService.logPageView(Page.AUDIT_HISTORY_PAGE, {
        who: res.locals.user.username,
        correlationId: req.id,
      })

      const viewFilters = {
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
        transactionType: (req.query.transactionType as string) || '',
        legacyTransactionId: (req.query.legacyTransactionId as string) || '',
        prisonId: (req.query.prisonId as string) || '',
      }

      const parseResult = auditFilterSchema.safeParse(req.query)

      if (!parseResult.success) {
        const { errors, errorMap } = formatValidationErrors(parseResult.error)

        res.render('pages/audit/history', {
          ...viewFilters,
          payloadSummaryData: [],
          errors,
          errorMap,
        })
        return
      }

      const { page, cursor, prev, ...apiFiltersRaw } = parseResult.data
      const pageNumber = parseInt(page || '1', 10)
      const prevCursors = cursor ? (prev as string) || '' : ''

      const apiFilters = Object.fromEntries(Object.entries(apiFiltersRaw).filter(([_, value]) => !!value))

      const cursorPage = await this.services.auditHistoryService.getMatchingPayloads({
        ...apiFilters,
        cursor: cursor || null,
        size: 20,
      })

      const currentUrl = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`)
      const pagination = paginationFromCursor(cursorPage, currentUrl, prevCursors, pageNumber)

      res.render('pages/audit/history', {
        ...viewFilters,
        payloadSummaryData: cursorPage.content,
        pagination,
      })
    } catch (error) {
      next(error)
    }
  }
}
