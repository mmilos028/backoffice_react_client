// core components/views
import Home from "../views/authenticated/Home/Home";
import MyPersonalData from "../views/authenticated/MyAccount/MyPersonalData/MyPersonalData";
import ChangePassword from "../views/authenticated/MyAccount/ChangePassword/ChangePassword";

import SearchListVouchers from "../views/authenticated/Administration/Vouchers/SearchListVouchers/SearchListVouchers";
import CreateVoucherCard from "../views/authenticated/Administration/Vouchers/CreateVoucherCard/CreateVoucherCard";
import EditVoucherCard from "../views/authenticated/Administration/Vouchers/EditVoucherCard/EditVoucherCard";
import CreateMemberCard from "../views/authenticated/Administration/Vouchers/CreateMemberCard/CreateMemberCard";
import EditMemberCard from "../views/authenticated/Administration/Vouchers/EditMemberCard/EditMemberCard";
import NewUser from '../views/authenticated/Administration/UsersAndAdministrators/NewUser/NewUserForm';

const authenticatedRoutes = [
  {
    path: "/authenticated/home",
    sidebarName: "Home",
    navbarName: "Home",
    icon: "content_paste",
    component: Home
  },
  {
    path: "/authenticated/my-account/my-personal-data",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: MyPersonalData
  },
  {
    path: "/authenticated/my-account/change-password",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: ChangePassword
  },
  
  {
    path: "/authenticated/administration/vouchers/search-prepaid-cards",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: SearchListVouchers
  },
  {
    path: "/authenticated/administration/vouchers/create-voucher-card",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: CreateVoucherCard
  },
  {
    path: "/authenticated/administration/vouchers/edit-voucher-card",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: EditVoucherCard
  },
  {
    path: "/authenticated/administration/vouchers/create-member-card",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: CreateMemberCard
  },
  {
    path: "/authenticated/administration/vouchers/edit-member-card",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: EditMemberCard
  },
  {
    path: "/authenticated/administration/users-and-administrators/new-user",
    sidebarName: "Attendant",
    navbarName: "Attendant",
    icon: "content_paste",
    component: NewUser
  },
];

export default authenticatedRoutes;
