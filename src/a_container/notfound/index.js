/* 404 NotFound */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import P from 'prop-types';
import css from './index.scss';
import ImgNotFound from '../../assets/error.gif';

@connect(
    (state) => ({
    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)
export default class HomePageContainer extends React.Component {
  static propTypes = {
      history: P.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({
        show: true,
    }));

  }

  onGoBackHome = () => {
    this.props.history.replace('/');
  };

  render() {
    return (
      <div className={css.page}>
          <div>
            <div className={css.title}>404</div>
            <div className={css.info}>Oh dear</div>
            <div className={css.info}>这里什么也没有</div>
            <Button className={css.backBtn} type="primary" ghost onClick={this.onGoBackHome}>返回首页</Button>
          </div>
          <img src={ImgNotFound + `?${new Date().getTime()}`} />
      </div>
    );
  }
}