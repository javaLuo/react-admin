/** 通用动态面包屑 **/
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./index.less";
import { Menu } from "@/models/index.type";

interface Props {
  menus: Menu[];
}

export default function BreadCom(props: Props): JSX.Element {
  const location = useLocation();

  /** 根据当前location动态生成对应的面包屑 **/
  const breads = useMemo(() => {
    const paths: string = location.pathname;
    const breads: JSX.Element[] = [];

    let parentId: number | null = null;
    do {
      const pathObj: Menu | undefined = props.menus.find(
        (v) => v.id === parentId || v.url === paths
      );

      if (pathObj) {
        breads.push(
          <Breadcrumb.Item key={pathObj.id}>{pathObj.title}</Breadcrumb.Item>
        );
        parentId = pathObj.parent;
      } else {
        parentId = null;
      }
    } while (parentId);

    breads.reverse();
    return breads;
  }, [location.pathname, props.menus]);

  return (
    <div className="bread">
      <EnvironmentOutlined className="icon" />
      <Breadcrumb>{breads}</Breadcrumb>
    </div>
  );
}
