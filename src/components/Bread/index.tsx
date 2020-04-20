/** 通用动态面包屑 **/
import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./index.less";
import { Menu } from "@/models/index.type";

interface Props {
  location: Location;
  menus: Menu[];
}

export default function BreadCom(props: Props): JSX.Element {
  /** 根据当前location动态生成对应的面包屑 **/
  const breads = useMemo(() => {
    const paths: string[] = props.location.pathname
      .split("/")
      .filter((item) => !!item);
    const breads: JSX.Element[] = [];
    paths.forEach((item, index) => {
      const temp = props.menus.find((v) => v.url.replace(/^\//, "") === item);
      if (temp) {
        breads.push(
          <Breadcrumb.Item key={index}>{temp.title}</Breadcrumb.Item>
        );
      }
    });
    return breads;
  }, [props.location.pathname, props.menus]);

  return (
    <div className="bread">
      <EnvironmentOutlined className="icon" />
      <Breadcrumb>{breads}</Breadcrumb>
    </div>
  );
}
