import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ProfilePage from '../components/ProfilePage';
import GameList from '../components/GameList';
import AddGames from '../components/AddGames';
// import ClipList from '../components/ClipList';
import MiniProfile from '../components/MiniProfile';
import MatchPage from '../components/MatchPage';
import LikePage from '../components/LikePage';
import ChatList from '../components/ChatList'; //list of all chats
// import ChatPage from '../components/ChatPage'; //show messages in a specific chat
import NotFoundPage from '../components/NotFoundPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage/LandingPage';

const AuthRedirect = ({ element }) => {
  const isAuthenticated = useSelector(state => state.session.isAuthenticated);
  const userId = useSelector(state => state.session.user?.id);

  // If the user is authenticated, redirect to their profile page
  if (isAuthenticated) {
    return <Navigate to={`/profile/${userId}`} replace />;
  }

  // Otherwise, render the given element (e.g., the LandingPage)
  return element;
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AuthRedirect element={<LandingPage />} />, // Use the AuthRedirect component
        children: [
          {
            path: "all",
            element: <GameList />,
          },
        ]
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "add-games",
        element: <AddGames />,
      },
      {
        path: "profile/:userId",
        element: <ProfilePage />,
      },
      {
        path: "mini-profile/:userId",
        element: <MiniProfile />,
      },
      {
        path: "find-matches",
        element: <MatchPage />,
      },
      {
        path: "match-requests/:userId",
        element: <LikePage />,
      },
      {
        path: "chats/:userId",
        element: <ChatList />,
      },
      // {
      //   path: "chats/:chatId",
      //   element: <ChatPage />,
      // },
      {
        path: "*",  //404 errors
        element: <NotFoundPage />,
      },
    ],
  },
]);
