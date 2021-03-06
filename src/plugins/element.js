import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Header,
  Container,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Cascader,
  Select,
  Option,
  Alert
} from "element-ui";

Vue.prototype.$message = Message;
Vue.prototype.$messageBox = MessageBox;

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

Vue.use(Card);
Vue.use(Row);
Vue.use(Col);

Vue.use(Table);
Vue.use(TableColumn);

Vue.use(Switch);
Vue.use(Tooltip);

Vue.use(Pagination);

Vue.use(Dialog);

Vue.use(Tag);
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Select);
Vue.use(Option);

Vue.use(Alert)

