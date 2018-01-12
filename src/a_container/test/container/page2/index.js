import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';


// ==================
// Definition
// ==================
class Page2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className='son'>B 子container 2</div>
    );
  }
}

// ==================
// PropTypes
// ==================

Page2.propTypes = {
  location: P.any,
  history: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
  }), 
  (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
  })
)(Page2);
