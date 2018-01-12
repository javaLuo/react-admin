/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import tools from '../../util/tools';
import { bindActionCreators } from 'redux';
import P from 'prop-types';

import { Link, hashHistory } from 'react-router';

// ==================
// 所需的所有组件
// ==================

import css from './index.scss';
import ImgLogo from '../../assets/react-logo.jpg';

// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onOk(obj, keys) {
      console.log('选择返回：', obj, keys);
   }

  render() {
    return (
      <div className={classNames(css.home, "all_nowarp")}>
          <div className={css.box}>
              <img src={ImgLogo} />
              <div className={css.title}>React-Luo</div>
              <div className={css.info}>react、redux、webpack3、eslint、babel6、antd</div>
          </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
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
)(HomePageContainer);
