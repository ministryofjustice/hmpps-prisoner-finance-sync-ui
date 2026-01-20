import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as ActivitiesFrontend from './all'

govukFrontend.initAll()
mojFrontend.initAll()

ActivitiesFrontend.initAll()

export default {
  ...ActivitiesFrontend,
}
