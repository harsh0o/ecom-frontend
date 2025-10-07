import { Navigate, Outlet } from "react-router-dom";
import { CookieUtils } from "../../utils/CookieUtils";

const PrivateRoutes = () => {
  let auth = CookieUtils.getCookie('authToken')
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes