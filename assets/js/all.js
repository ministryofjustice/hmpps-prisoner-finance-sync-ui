import ListFilter from './list-filter'
import { nodeListForEach } from './utils'

function initAll() {
    var $filters = document.querySelectorAll('[data-module="moj-filter"]')
        nodeListForEach($filters, function ($filter) {
        new ListFilter($filter)
    })
}

export {
  initAll
}