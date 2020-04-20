/** 左侧导航 **/

// ==================
// 第三方库
// ==================
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Layout, Menu as MenuAntd } from "antd";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";

const { Sider } = Layout;
const { SubMenu, Item } = MenuAntd;

// ==================
// 自定义的东西
// ==================
import "./index.less";
import ImgLogo from "@/assets/logo.png";
import Icon from "@/components/Icon";

// ==================
// 类型声明
// ==================
import { History } from "history";
import { Menu } from "@/models/index.type";

interface Props {
  data: Menu[]; // 所有的菜单数据
  collapsed: boolean; // 菜单咱开还是收起
  history: History;
  location: Location;
}

// ==================
// 本组件
// ==================
export default function MenuCom(props: Props): JSX.Element {
  const [chosedKey, setChosedKey] = useState<string[]>([]); // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]); // 当前需要被展开的项

  // 当页面路由跳转时，即location发生改变，则更新选中项
  useEffect(() => {
    const paths = props.location.pathname.split("/").filter((item) => !!item);
    setChosedKey([props.location.pathname]);
    setOpenKeys(paths.map((item) => `/${item}`));
  }, [props.location]);

  // ==================
  // 私有方法
  // ==================

  // 菜单被选择
  const onSelect = useCallback(
    (e) => {
      props.history.push(e.key);
    },
    [props.history]
  );

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback((one, data): Menu[] => {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item: Menu) => !item.parent);
    } else {
      kids = data.filter((item: Menu) => item.parent === one.id);
    }
    kids.forEach((item: Menu) => (item.children = dataToJson(item, data)));
    return kids.length ? kids : null;
  }, []);

  // 构建树结构
  const makeTreeDom = useCallback(
    (data: Menu[], key: string): JSX.Element[] => {
      return data.map((item: Menu) => {
        const newKey = `${key}/${item.url.replace(/\//, "")}`;
        if (item.children) {
          return (
            <SubMenu
              key={newKey}
              title={
                !item.parent && item.icon ? (
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </span>
                ) : (
                  item.title
                )
              }
            >
              {makeTreeDom(item.children, newKey)}
            </SubMenu>
          );
        } else {
          return (
            <Item key={newKey}>
              {!item.parent && item.icon ? <Icon type={item.icon} /> : null}
              <span>{item.title}</span>
            </Item>
          );
        }
      });
    },
    []
  );

  // ==================
  // 计算属性 memo
  // ==================

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom: JSX.Element[] = useMemo(() => {
    const d: Menu[] = cloneDeep(props.data);
    // 按照sort排序
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData: Menu[] = dataToJson(null, d) || [];
    const treeDom = makeTreeDom(sourceData, "");
    return treeDom;
  }, [props.data, dataToJson, makeTreeDom]);

  return (
    <Sider
      width={256}
      className="sider"
      trigger={null}
      collapsible
      collapsed={props.collapsed}
    >
      <div className={props.collapsed ? "menuLogo hide" : "menuLogo"}>
        <Link to="/">
          <img src={ImgLogo} />
          <div>React-Admin</div>
        </Link>
      </div>
      <MenuAntd
        theme="dark"
        mode="inline"
        selectedKeys={chosedKey}
        {...(props.collapsed ? {} : { openKeys })}
        onOpenChange={setOpenKeys}
        onSelect={onSelect}
      >
        {treeDom}
      </MenuAntd>
    </Sider>
  );
}
