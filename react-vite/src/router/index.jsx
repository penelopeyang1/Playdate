import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ProfilePage from '../components/ProfilePage';
import GameList from '../components/GameList';
import AddGames from '../components/AddGames';
// import ClipList from '../components/ClipList';
import MiniProfile from '../components/MiniProfile';
import MatchPage from '../components/MatchPage';
import MatchRequests from '../components/MatchRequests';
import ChatList from '../components/ChatList'; //list of all chats
import ChatPage from '../components/ChatPage'; //show messages in a specific chat
import NotFoundPage from '../components/NotFoundPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage/LandingPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
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
