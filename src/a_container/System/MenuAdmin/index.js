/** 菜单管理页 **/

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import tools from '../../../util/tools';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import _ from 'lodash';
import { Link, hashHistory } from 'react-router';
import css from './index.scss';
// ==================
// 所需的所有组件
// ==================

import { Tree, Button, Table, Tooltip, Icon, Popconfirm, Modal, Form, Select, Input, InputNumber, message, Divider } from 'antd';
import { Icons } from '../../../util/json';

// ==================
// 本页面所需action
// ==================

import { addMenu, getMenus } from '../../../a_action/sys-action';

// ==================
// Definition
// ==================
const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(
    (state) => ({
    }),
    (dispatch) => ({
        actions: bindActionCreators({ addMenu, getMenus }, dispatch),
    })
)
@Form.create()
export default class MenuAdminContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],   // 所有的菜单数据（未分层级）
        sourceData: [], // 所有的菜单数据（分层级）
        tableData: [],   // 表格所需数据 （所选tree节点的直接子级）
        operateType: 'add',  // 操作类型 add新增，up修改, see查看
        modalShow: false,   // 新增&修改 模态框是否显示
        modalLoading: false,// 新增&修改 模态框是否正在执行请求
    };
  }

    componentDidMount() {
      this.getData();
  }

  /** 获取本页面所需数据 **/
  getData() {
      this.props.actions.getMenus().then((res) => {
          console.log('请求菜单：', res);
          if(res.status === 200) {
              this.setState({
                  data: res.data,
                  tableData: res.data.filter((item) => !item.parent)
              });
              this.makeSourceData(res.data);
          }
      });
  };

   /** 处理原始数据，将原始数据处理为层级关系 **/
    makeSourceData(data) {
        const d = _.cloneDeep(data);
        // 按照sort排序
        d.sort((a, b) => {
            return a.sorts - b.sorts;
        });
        const sourceData = this.dataToJson(null, d);
        console.log('得到了什么2：', sourceData);
        this.setState({
            sourceData,
        });
    }

    /** 工具 - 递归将扁平数据转换为层级数据 **/
    dataToJson(one, data) {
        let kids;
        if (!one) { // 第1次递归
            kids = data.filter((item) => !item.parent);
        } else {
            kids = data.filter((item) => item.parent === one.id);
        }
        kids.forEach((item) => item.children = this.dataToJson(item, data));
        return kids.length ? kids : null;
    }

    /** 递归构建树结构 **/
    makeTreeDom(data, key = '') {
        return data.map((item, index) => {
            const k = key ? `${key}-${item.id}` : `${item.id}`;
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={k} id={item.id} p={item.parent}>
                        { this.makeTreeDom(item.children, k) }
                    </TreeNode>
                );
            } else {
                return <TreeNode title={item.title} key={k} id={item.id} p={item.parent} selectable={false}/>;
            }
        });
    }

    /** 点击树目录时触发 **/
    onTreeSelect = (keys, e) => {
        const id = e.node.props.id;
        this.setState({
            tableData: this.state.data.filter((item) => item.parent === id)
        });
        console.log('选择：', keys, e);
    };

  /** 新增&修改 模态框出现 **/
  onModalShow = (data, type) => {
      const { form } = this.props;

      if (type === 'add') { // 新增，需重置表单各控件的值
          form.resetFields();
      } else {  // 查看或修改，需设置表单各控件的值为当前所选中行的数据
          // const v = form.getFieldsValue();
          form.setFieldsValue({
              formConditions: data.conditions,
              formDesc: data.desc,
              formIcon: data.icon,
              formParent: data.parent,
              formSorts: data.sorts,
              formTitle: data.title,
              formUrl: data.url,
          });
      }
    this.setState({
        modalShow: true,
        operateType: type,
    });
  };

    /** 新增&修改 模态框关闭 **/
    onClose = () => {
        this.setState({
            modalShow: false,
        });
    };

    /** 新增&修改 提交 **/
    onOk = () => {
        const { form } = this.props;
        form.validateFields([
            'formTitle',
            'formUrl',
            'formIcon',
            'formParent',
            'formDesc',
            'formSorts',
            'formConditions',
        ], (err, values) => {
            if (err) { return; }
            const params = {
                title: values.formTitle,
                url: values.formUrl,
                icon: values.formIcon,
                parentId: 0,
                sorts: values.formSorts,
                desc: values.formDesc,
                conditions: values.formConditions,
            };
            if (this.state.operateType === 'add') { // 新增
                this.props.actions.addMenu(params).then((res) => {
                    console.log('返回了什么', res);
                    if(res.status === 200) {
                        message.success('添加成功');
                        // this.getAllMenus(); // 重新获取菜单
                        // this.getData(me.state.nowData.parentId);
                        this.onClose();
                    } else {
                        message.error('添加失败');
                    }
                    this.setState({modalLoading: false});
                }).catch(() => {
                    this.setState({modalLoading: false});
                });
            } else {    // 修改
                this.props.actions.upMenu(params).then((res) => {
                    if(res.returnCode === "0") {
                        message.success('修改成功');
                        // this.getAllMenus(); // 重新获取菜单
                        // this.getData(me.state.nowData.parentId);
                        this.onClose();
                    } else {
                        message.error('修改失败');
                    }
                    this.setState({modalLoading: false});
                }).catch(() => {
                    this.setState({modalLoading: false});
                });
            }

            this.setState({modalLoading: true});
        });
    };

    /** 构建表格字段 **/
    makeColumns = () => {
        const columns = [
            {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial',
            },
            {
                title: '图标',
                dataIndex: 'icon',
                key: 'icon',
                render: (text) => {
                    return text ? <Icon type={text} /> : '';
                }
            },
            {
                title: '菜单名称',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '路径',
                dataIndex: 'url',
                key: 'url',
                render: (text, record) => {
                    return text ? `/${text.replace(/^\//, '')}` : '';
                },
            },
            {
                title: '描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '父级',
                dataIndex: 'parent',
                key: 'parent',
            },
            {
                title: '状态',
                dataIndex: 'conditions',
                key: 'conditions',
                render: (text, record) => text === 1 ? <span style={{color: 'green'}}>启用</span> : <span style={{color: 'red'}}>禁用</span>
            },
            {
                title: '操作',
                key: 'control',
                width: 120,
                render: (text, record) => {
                    let controls = [];

                    controls.push(
                        <span key="0" className="control-btn green" onClick={() => this.onModalShow(record, 'see')}>
                            <Tooltip placement="top" title="查看">
                                <Icon type="eye" />
                            </Tooltip>
                        </span>
                    );
                    controls.push(
                        <span key="1" className="control-btn blue" onClick={() => this.onModalShow(record, 'up')}>
                            <Tooltip placement="top" title="修改">
                                <Icon type="edit" />
                            </Tooltip>
                        </span>
                    );
                    controls.push(
                        <Popconfirm key="2" title="确定删除吗?" okText="确定" cancelText="取消">
                            <span className="control-btn red">
                                <Tooltip placement="top" title="删除">
                                    <Icon type="delete" />
                                </Tooltip>
                            </span>
                        </Popconfirm>
                    );
                    const result = [];
                    controls.forEach((item, index) => {
                        if (index) {
                            result.push(<Divider key={`line${index}`} type="vertical" />,);
                        }
                        result.push(item);
                    });
                    return result;
                },
            }
        ];
        return columns;
    };

    /** 构建表格数据 **/
    makeData(data) {
        console.log('DATA:', data);
        if (!data){return [];}
        return data.map((item, index) => {
            return {
                key: index,
                id: item.id,
                icon: item.icon,
                parent: item.parent,
                title: item.title,
                url: item.url,
                desc: item.desc,
                sorts: item.sorts,
                conditions: item.conditions,
                serial: (index + 1),
            };
        });
    }
  render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {  // 表单布局
          labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
          },
          wrapperCol: {
              xs: { span: 24 },
              sm: { span: 19 },
          },
      };
    return (
      <div className={c(css.page, 'flex-row')}>
          <div className={c(css.l)}>
              <div className={css.title}>目录结构</div>
              <div>
                  <Tree
                      defaultExpandedKeys={['0']}
                      onSelect={this.onTreeSelect}
                  >
                      <TreeNode title="根" key="0" id={null}>
                          { this.makeTreeDom(this.state.sourceData) }
                      </TreeNode>
                  </Tree>
              </div>
          </div>
          <div className={c(css.r, 'flex-auto')}>
              <div className={css.searchBox}>
                  <ul className={'flex-row'}>
                      <li><Button type="primary" icon="plus-circle-o" onClick={() => this.onModalShow('add')}>添加新菜单</Button></li>
                  </ul>
              </div>
              <Table
                  className={'diy-table'}
                  columns={this.makeColumns()}
                  dataSource={this.makeData(this.state.tableData)}
                  onChange={(p) => this.onTableChange(p)}
                  pagination={{
                      pageSize: this.state.pageSize,
                      showQuickJumper: true,
                      showTotal: (total, range) => `共 ${total} 条数据`,
                  }}
              />
          </div>
          {/* 查看&新增&修改用户模态框 */}
          <Modal
              title={{ add: '新增', up: '修改', see: '查看' }[this.state.operateType]}
              visible={this.state.modalShow}
              onOk={this.onOk}
              onCancel={this.onClose}
              confirmLoading={this.state.modalLoading}
          >
              <Form>
                  <FormItem
                      label="菜单名"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formTitle', {
                          initialValue: undefined,
                          rules: [
                              { required: true, whitespace: true, message: '必填' },
                              { max: 12, message: '最多输入12位字符' }
                          ],
                      })(
                          <Input placeholder="请输入菜单名" disabled={this.state.operateType === 'see'}/>
                      )}
                  </FormItem>
                  <FormItem
                      label="菜单链接"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formUrl', {
                          initialValue: undefined,
                          rules: [
                              { validator: (rule, value, callback) => {
                                  const v = value;
                                  if (v) {
                                      if (v.length > 12) {
                                          callback('最多输入12位字符');
                                      }else if (!tools.checkStr(v)){
                                          callback('只能输入字母、数字及下划线');
                                      }
                                  }
                                  callback();
                              }}
                          ],
                      })(
                          <Input placeholder="请输入菜单链接" disabled={this.state.operateType === 'see'} />
                      )}
                  </FormItem>
                  <FormItem
                      label="图标"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formIcon', {
                          initialValue: undefined,
                      })(
                          <Select
                              dropdownClassName={css.iconSelect}
                              disabled={this.state.operateType === 'see'}
                          >
                              {
                                  Icons.map((item, index) => {
                                      return <Option key={index} value={item}><Icon type={item}/></Option>;
                                  })
                              }
                          </Select>
                      )}

                  </FormItem>
                  <FormItem
                      label="父级"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formParent', {
                          initialValue: undefined,
                      })(
                          <Input placeholder="请选择父级"  disabled={this.state.operateType === 'see'} />
                      )}

                  </FormItem>
                  <FormItem
                      label="描述"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formDesc', {
                          rules: [{ max: 100, message: '最多输入100位字符' }],
                          initialValue: undefined,
                      })(
                          <TextArea
                              rows={4}
                              disabled={this.state.operateType === 'see'}
                              placeholoder="请输入描述"
                              autosize={{minRows: 2, maxRows: 6}}
                          />
                      )}
                  </FormItem>
                  <FormItem
                      label="排序"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formSorts', {
                          initialValue: 0,
                          rules: [{required: true, message: '请输入排序号'}],
                      })(
                          <InputNumber min={0} max={99999} style={{ width: '100%' }} disabled={this.state.operateType === 'see'} />
                      )}
                  </FormItem>
                  <FormItem
                      label="状态"
                      {...formItemLayout}
                  >
                      {getFieldDecorator('formConditions', {
                          initialValue: 1,
                          rules: [{required: true, message: '请选择状态'}],
                      })(
                          <Select
                              disabled={this.state.operateType === 'see'}
                          >
                              <Option key={1} value={1}>启用</Option>
                              <Option key={-1} value={-1}>禁用</Option>
                          </Select>
                      )}
                  </FormItem>
              </Form>
          </Modal>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

MenuAdminContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
    form: P.any,
};
