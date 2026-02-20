import { z } from 'zod'
import { isValidDatePickerDate } from '../utils/datePickerUtils'

export const auditFilterSchema = z.object({
  legacyTransactionId: z
    .string()
    .optional()
    .refine(val => !val || /^\d+$/.test(val), {
      message: 'Transaction ID must be a number',
    }),

  prisonId: z
    .string()
    .optional()
    .refine(val => !val || /^[A-Za-z0-9]{3}$/.test(val), {
      message: 'Prison Id Must be 3 alphanumeric characters',
    }),

  transactionType: z
    .string()
    .optional()
    .refine(val => !val || /^[A-Z0-9_]{1,19}$/.test(val), {
      message: 'Transaction Type must be 1-19 capital alphanumeric characters or underscores',
    }),

  startDate: z.string().trim().optional().refine(isValidDatePickerDate, {
    message: 'Start date must be a real date, like 18/01/2026',
  }),

  endDate: z.string().trim().optional().refine(isValidDatePickerDate, {
    message: 'End date must be a real date, like 18/01/2026',
  }),

  page: z.string().optional(),
  cursor: z.string().optional(),
  prev: z.string().optional(),
})

export function formatValidationErrors(error: z.ZodError) {
  const errors = error.issues.map(err => ({
    href: `#${String(err.path[0])}`,
    text: err.message,
  }))

  const errorMap = error.issues.reduce(
    (acc: Record<string, string>, err) => {
      acc[String(err.path[0])] = err.message
      return acc
    },
    {} as Record<string, string>,
  )

  return { errors, errorMap }
}
