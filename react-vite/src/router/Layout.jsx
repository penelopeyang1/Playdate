// import { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";
// import { thunkAuthenticate } from "../redux/session";
// import Navigation from "../components/Navigation/Navigation";
// import UserMenu from '../components/UserMenu';

// export default function Layout() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);
//   useEffect(() => {
//     dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
//   }, [dispatch]);

//   return (
//     <>
//       <ModalProvider>
//         <Navigation />
//         {isLoaded && <Outlet />}
//         <Modal />
//         <UserMenu />
//       </ModalProvider>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import UserMenu from '../components/UserMenu';

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const isAuthenticated = useSelector(state => state.session.isAuthenticated); // Assuming session state has isAuthenticated

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && <Outlet />}
        <Modal />
        {isAuthenticated && <UserMenu />}
      </ModalProvider>
    </>
  );
}
