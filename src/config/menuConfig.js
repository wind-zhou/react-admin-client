import {
  SmileOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  PauseOutlined,
  UserOutlined,
  SafetyOutlined,
  DeleteOutlined,
  ColumnWidthOutlined,
  DragOutlined,
  FontColorsOutlined
} from '@ant-design/icons';

const menuList = [
  { 
    title: "首页", // 菜单标题名称
    key: "/home", // 对应的 path
    icon: <SmileOutlined /> // 图标名称
  },
  {
    title: "商品",
    key: "/products",
    icon: <ClockCircleOutlined />,
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "/category",
        icon: <CheckOutlined />
      },
      {
        title: "商品管理",
        key: "/product",
        icon: <PauseOutlined />
      }
    ]
  },
  {
    title: "用户管理",
    key: "/user",
    icon: <UserOutlined />
  },
  {
    title: "角色管理",
    key: "/role",
    icon: <SafetyOutlined />
  },
  {
    title: "图形图表",
    key: "/charts",
    icon: <DeleteOutlined />,
    children: [
      { title: "柱形图", key: "/charts/bar", icon: <ColumnWidthOutlined /> },
      { title: "折线图", key: "/charts/line", icon: <DragOutlined /> },
      { title: "饼图", key: "/charts/pie", icon: <FontColorsOutlined /> }
    ]
  }
];

export default menuList
