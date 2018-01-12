import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';


// ==================
// Definition
// ==================
class Page3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className='son'>C 子container 3</div>
    );
  }
}

// ==================
// PropTypes
// ==================

Page3.propTypes = {
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
)(Page3);
