import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ProfilePage from '../components/ProfilePage';
import GameList from '../components/ProfilePage/GameList';
import ClipList from '../components/ProfilePage/ClipList';
import MiniProfile from '../components/MiniProfile';
// import Gamelist from '../componets/MiniProfile/GameList'
import MatchPage from '../components/MatchPage';
import MatchRequests from '../components/MatchRequests';
import ChatList from '../components/ChatList'; //list of all chats
import ChatPage from '../components/ChatPage'; //show messages in a specific chat
import NotFoundPage from '../components/NotFoundPage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
        path: "profile",
        element: <ProfilePage />,
        children: [
          {
            path: "games",
            element: <GameList />,
          },
          {
            path: "clips",
            element: <ClipList />,
          },
        ],
      },
      {
        path: "mini-profile/:userId",
        element: <MiniProfile />,
        children: [
          {
            path: "games",
            element: <GameList />,
          },
          {
            path: "clips",
            element: <ClipList />,
          },
        ],
      },
      {
        path: "matches",
        element: <MatchPage />,
      },
      {
        path: "match-requests",
        element: <MatchRequests />,
      },
      {
        path: "chats",
        element: <ChatList />,
      },
      {
        path: "chats/:chatId",
        element: <ChatPage />,
      },
      {
        path: "*",  //404 errors
        element: <NotFoundPage />,
      },
    ],
  },
]);
