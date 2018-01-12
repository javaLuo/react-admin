/* 测试页 */

// ==================
// 所需的第三方库或资源
// ==================

import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, message, Form } from 'antd';
import { bindActionCreators } from 'redux';

// ==================
// 所需的我们自己的组件或资源
// ==================

import css from './index.scss';
import ImgTest from '../../assets/test.jpg';
import Mp3 from '../../assets/starSky.mp3';

import Page1 from './container/page1';      // 子页面1
import Page2 from './container/page2';      // 子页面2
import Page3 from './container/page3';      // 子页面3

// ==================
// 本页面所需actions
// ==================

import { onTestAdd, fetchApi, fetchTest } from '../../a_action/app-action';


/** 修饰器测试 **/
@connect(
    (state) => ({
        num: state.app.num,
    }), 
    (dispatch) => ({
        actions: bindActionCreators({ onTestAdd, fetchApi, fetchTest }, dispatch),
    })
)
@Form.create()
/** 定义组件class **/
export default class TestPageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 模态框隐藏和显示
            mokeFetch: [],  // 用于测试fetch请求
            mokeAjax: [],   // 用于测试ajax请求
        };
    }

    // 打开模态框按钮被点击时触发
    onBtnClick() {
        this.setState({
            visible: true,
        });
    }

    // 关闭模态框
    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    // Ajax测试按钮被点击时触发
    onAjaxClick = () => {
        this.props.actions.fetchApi().then((res) => {
            if (res.code === 'success') {
                this.setState({
                    mokeAjax: res.data,
                });
            } else {
                message.error('获取数据失败');
            }
        });
    };

    // Fetch测试按钮点击时触发
    onFetchClick() {
        this.props.actions.fetchTest().then((res) => {
            console.log(res);
            if (res.code === 'success') {
                this.setState({
                    mokeFetch: res.data,
                });
            } else {
                message.error('获取数据失败');
            }
        });
    }

    componentDidMount() {
        console.log('所有页面默认拥有的3个对象：', this.props.location, this.props.match, this.props.history);
        const set = new Set([1,2,3]);
        const map = new Map();
        console.log('Set 和 Map 测试', set, map);
    }

    render() {
        const { form } = this.props;
        console.log('通过修饰器注入的form对象：', form);
        return (
            <div className={css.page}>
                <h1 className={css.title}>功能测试</h1>
                <div className={css.box}>
                    <div className={css.list}>
                        <h2>引入图片</h2>
                        <p><img src={ImgTest} style={{ height: '150px' }}/></p>
                    </div>
                    <div className={css.list}>
                        <h2>引入其他种类的资源</h2>
                        <p><audio src={Mp3} controls/></p>
                    </div>
                    <div className={css.list}>
                        <h2>LESS、SASS测试</h2>
                        <p>
                            <span className={'less_btn'}>来自LESS样式</span>&nbsp;
                            <span className={'scss_btn'}>来自SASS样式</span>
                        </p>
                    </div>
                    <div className={css.list}>
                        <h2>Antd组件测试</h2>
                        <p>
                            <Button type="primary">
                              普通按钮
                            </Button>&nbsp;
                            <Button type="primary" loading>
                              加载中
                            </Button>&nbsp;
                            <Button type="primary" onClick={() => this.onBtnClick()}>
                              打开模态框
                            </Button>&nbsp;
                        </p>
                    </div>
                    <div className={css.list}>
                        <h2>location对象测试</h2>
                        <p>
                            当前路由：{ this.props.location.pathname }<br/>
                            search参数：{ this.props.location.search }<br/>
                            state参数：{this.props.location.state ? Object.entries(this.props.location.state).map((v) => `${v[0]}=${v[1]}`).join('，') : ''}
                        </p>
                        <p>所有页面都自动被注入location、match、history对象</p>
                    </div>
                    <div className={css.list}>
                        <h2>action测试</h2>
                        <p>
                            <Button type="primary" onClick={() => this.props.actions.onTestAdd(this.props.num)}>通过action改变数据num</Button>&nbsp;<br/>
                            store中数据num：{this.props.num}
                        </p>
                    </div>
                    <div className={css.list}>
                        <h2>异步请求测试（Mock模拟数据）</h2>
                        <div className={css.pbox}>
                            <Button type="primary" onClick={this.onAjaxClick}>ajax请求测试(使用的reqwest库)</Button><br/>
                            数据：
                            <ul>
                                {
                                    this.state.mokeAjax.map((item, index) => <li key={index}>{`id: ${item.id}, email: ${item.email}`}</li>)
                                }
                            </ul>
                        </div>
                        <div className={css.pbox}>
                            <Button type="primary" onClick={() => this.onFetchClick()}>fetch请求测试(使用的axios库)</Button><br/>
                            数据：
                            <ul>
                                {
                                    this.state.mokeFetch.map((item, index) => <li key={index}>{`id: ${item.id}, email: ${item.email}`}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={css.list}>
                        <h2>嵌套路由测试</h2>
                        <div className={css.sonTest}>
                            <Link to={`${this.props.match.url}/Page1`} >子页1</Link>
                            <Link to={`${this.props.match.url}/Page2`} >子页2</Link>
                            <Link to={`${this.props.match.url}/Page3`} >子页3</Link>
                            <Switch>
                                <Route exact path={`${this.props.match.url}/`} component={Page1} />
                                <Route exact path={`${this.props.match.url}/Page1`} component={Page1} />
                                <Route exact path={`${this.props.match.url}/Page2`} component={Page2} />
                                <Route exact path={`${this.props.match.url}/Page3`} component={Page3} />
                            </Switch>
                        </div>
                    </div>
                </div>
                <Modal
                  title="模态框"
                  visible={this.state.visible}
                  onOk={() => this.handleCancel()}
                  onCancel={() => this.handleCancel()}
                >
                  <p>内容...</p>
                </Modal>
            </div>
        );
    }
}

// ==================
// PropTypes
// ==================
TestPageContainer.propTypes = {
    num: P.number,      // 测试： 来自store的全局变量num
    location: P.any,    // 自动注入的location对象
    match: P.any,       // 自动注入的match对象
    history: P.any,     // 自动注入的history对象
    actions: P.any,     // connect高阶函数注入的actions，见本页面最下面的actions
    form: P.any,
};

