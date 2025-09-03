import moment from 'moment'

const
  defaultRanges = {
    'Today': [ moment(), moment(), '0D' ],
    'Yesterday': [ moment().subtract(1, 'days'), moment().subtract(1, 'days'), '-1D' ],
    'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek'), '0W' ] ,
    'Last Week': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek'), '-1W' ] ,
    'Last 10 Days': [moment().subtract(9, 'days'), moment(), '-10D' ] ,
    'Last 30 Days': [moment().subtract(29, 'days'), moment(), '-30D' ],
    'Last 90 Days': [moment().subtract(89, 'days'), moment(), '-90D' ],
    'This Month': [moment().startOf('month'), moment().endOf('month'), '0M'],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
      '-1M' 
    ],
    'This Year': [ moment().startOf('year'), moment().endOf('year') , '0Y' ]
  },
  defaultLetterRanges = ['0D','-1D','0W','-1W','-10D','-30D','-90D','0M','-1M','0Y'],
  letterMatchesLabel = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'Last 10 Days',
    'Last 30 Days',
    'Last 90 Days',
    'This Month',
    'Last Month',
    'This Year'
  ]

export { defaultRanges, defaultLetterRanges, letterMatchesLabel }
