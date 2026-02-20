import { Request, Response } from 'express'
import { Page } from '../services/auditService'
import type { Services } from '../services'

export default class HomeController {
  constructor(private readonly services: Services) {}

  public index = async (req: Request, res: Response): Promise<void> => {
    await this.services.auditService.logPageView(Page.INDEX_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    res.render('pages/index')
  }
}
