/* Footer 页面底部 */
import React from 'react';
import { Layout } from 'antd';
import P from 'prop-types';
import css from './index.scss';

const { Footer } = Layout;
export default class Com extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Footer className={css.footer}>
                © 2018 <a href="http://isluo.com" target="_blank" rel="noopener noreferrer">isluo.com</a>, Inc.
            </Footer>
        );
    }
}

Com.propTypes = {
};
