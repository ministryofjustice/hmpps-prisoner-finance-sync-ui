import { expect } from '@playwright/test'
import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { PrisonerTransactionResponse } from '../../../interfaces/prisonerTransactionResponse'
import { setUpNunJucksFilters } from '../../../utils/nunjucksSetup'

describe('prisoner transactions page', () => {
    const payload: Array<PrisonerTransactionResponse> = [
        {
            date: '2026-03-10T10:43:28.094Z',
            description: '',
            credit: 0,
            debit: 10,
            location: 'LEI',
            accountType: 'CASH',
            subAccountBalance: 0,
            accountBalance: 10,
        },
        {
            date: '2026-03-10T10:43:28.094Z',
            description: '',
            credit: 20,
            debit: 0,
            location: 'MDI',
            accountType: 'SAVINGS',
            subAccountBalance: 20,
            accountBalance: 17,
        },
        {
            date: '2026-03-10T10:43:28.094Z',
            description: 'Cash to Savings Transfer',
            credit: 0,
            debit: 10,
            location: '',
            accountType: 'CASH',
            subAccountBalance: 10,
            accountBalance: 19,
        },
        {
            date: '2026-03-10T10:43:28.094Z',
            description: 'Cash to Savings Transfer',
            credit: 10,
            debit: 0,
            location: '',
            accountType: 'SAVINGS',
            subAccountBalance: 20,
            accountBalance: 40,
        },
    ]

    const payloadWithoutLastRunningBalance: Array<PrisonerTransactionResponse> = [
        {
            date: '2026-03-10T10:43:28.094Z',
            description: '',
            credit: 0,
            debit: 10,
            location: 'LEI',
            accountType: 'CASH',
            subAccountBalance: 0,
            accountBalance: 40,
        },
        {
            date: '2026-03-10T10:43:28.094Z',
            description: '',
            credit: 20,
            debit: 0,
            location: 'MDI',
            accountType: 'SAVINGS',
            subAccountBalance: 20,
            accountBalance: 33,
        },
        {
            date: '2026-03-10T10:43:28.094Z',
            description: 'Cash to Savings Transfer',
            credit: 0,
            debit: 10,
            location: '',
            accountType: 'CASH',
            subAccountBalance: 10,
            accountBalance: 23,
        },
        {
            date: '2026-03-10T10:43:28.094Z',
            description: 'Cash to Savings Transfer',
            credit: 10,
            debit: 666,
            location: '',
            accountType: 'SAVINGS',
            subAccountBalance: null,
            accountBalance: null,
        },
    ]

    let $: cheerio.CheerioAPI
    let njkEnv: nunjucks.Environment
    const prisonNumber = 'A12345'
    const params = {
        prisonNumber,
        applicationName: 'Hmpps Prisoner Finance Ui',
        transactions: payload,
        prisoner: { firstName: 'BOB', lastName: 'Taylor' },
        currentBalance: 1000,
        holdBalance: 0,
        prisonNames: [{ prisonId: 'LEI', prisonName: 'Leeds (HMP)' }],
    }

    const paramsWithoutLastRunningBalance = {
        prisonNumber,
        applicationName: 'Hmpps Prisoner Finance Ui',
        transactions: payloadWithoutLastRunningBalance,
        prisoner: { firstName: 'BOB', lastName: 'Taylor' },
        currentBalance: 1000,
        holdBalance: 0,
        prisonNames: [{ prisonId: 'LEI', prisonName: 'Leeds (HMP)' }],
        displayTotalBalance: false,
    }

    beforeAll(() => {
        njkEnv = nunjucks.configure(
            ['server/views', 'node_modules/govuk-frontend/dist', 'node_modules/@ministryofjustice/frontend/'],
            {
                autoescape: true,
                trimBlocks: true,
                lstripBlocks: true,
            },
        )

        setUpNunJucksFilters(njkEnv)

        const html = njkEnv.render('pages/transactions/prisonerTransactions.njk', params)

        $ = cheerio.load(html)
    })

    it('should render the page elements correctly', () => {

        const transactionsTable = $('table[data-testid="prisoner-transactions-table"]')

        expect(transactionsTable.find('thead tr th').length).toBe(8)
        expect(transactionsTable.find('tbody tr').length).toBe(payload.length)

        const lastTransactionRunningBalance = $('table[data-testid="prisoner-transactions-table"] tbody tr')
            .last()
            .find('td')
            .eq(3)
            .text()
            .trim()

        expect(lastTransactionRunningBalance).toBe('666')

    })
})