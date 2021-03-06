import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import Search from 'containers/Search'
import ResultsList from 'components/ResultsList'
// import ResultModal from 'containers/ResultModal'

import { Row, Column } from 'react-foundation'

import { generatePageTitle } from 'utils'

class Index extends React.Component {
  render() {
    const {
      params,
      buckets,
      showResults,
    } = this.props

    const pageTitle = generatePageTitle(params.query)

    const hasResults = (buckets && buckets.length > 0)

    return (
      <Row isColumn>
        <Helmet title={pageTitle} />
        <Row>
          <Column small={12} medium={10} centerOnMedium>
            <Search
              showFilters={false}
              params={params}
              // filters={this.props.results.narrowNodes}
            />
          </Column>
        </Row>
        <Row className='results-container'>
          <Column small={12} medium={10} centerOnMedium>
            <ResultsList
              buckets={buckets}
              show={showResults}
              forQuery={params.query}
            />
          </Column>
        </Row>
      </Row>
    )
  }

}

export default connect(state => ({
  params: state.routing.locationBeforeTransitions.query,
  buckets: state.results,
  showResults: state.resultsDisplay.show
}), null)(Index)
