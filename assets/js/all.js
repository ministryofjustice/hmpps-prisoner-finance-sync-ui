import ListFilter from './list-filter'
import nodeListForEach from './utils'
import Card from './card'

function initAll() {
    var $filters = document.querySelectorAll('[data-module="moj-filter"]')
    
    nodeListForEach($filters, function ($filter) {
        new ListFilter($filter)
    })

    const $cards = document.querySelectorAll('.card--clickable')
    nodeListForEach($cards, $card => {
      // eslint-disable-next-line no-new
      new Card($card)
    })
}

export {
  initAll
}