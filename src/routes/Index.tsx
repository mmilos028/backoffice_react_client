import LoginLayout from "../layouts/login/LoginLayout";
import Authenticated from "../layouts/authenticated/authenticated_with_sidebar/AuthenticatedLayout";

const indexRoutes = [
    { path: "/login", component: LoginLayout },
    { path: "/authenticated", component: Authenticated },
    { redirect: true, path: "/", to: "/login" }
];

export default indexRoutes;