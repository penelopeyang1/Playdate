import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import UserMenu from '../components/UserMenu';

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const isAuthenticated = useSelector(state => state.session.isAuthenticated);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const isLandingPage = location.pathname === "/";

  return (
    <>
      <ModalProvider>
        {isLandingPage && <Navigation />}
        {isLoaded && <Outlet />}
        <Modal />
        {isAuthenticated && <UserMenu />}
      </ModalProvider>
    </>
  );
}
