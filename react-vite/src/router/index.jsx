import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ProfilePage from '../components/ProfilePage';
import MiniProfile from '../components/MiniProfile';
import MatchPage from '../components/MatchPage';
import MatchRequests from '../components/MatchRequests';
import ChatList from '../components/ChatList'; //list of all chats
import ChatPage from '../components/ChatPage'; //show messages in a specific chat
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
            element: <GameList />,  // Component to display the user's games
          },
          {
            path: "clips",
            element: <ClipList />,  // Component to display the user's clips
          },
        ],
      },
      {
        path: "mini-profile/:userId",
        element: <MiniProfile />,
        children: [
          {
            path: "games",
            element: <GameList />,  // Component to display the user's games in mini-profile
          },
          {
            path: "clips",
            element: <ClipList />,  // Component to display the user's clips in mini-profile
          },
        ],
      },
      {
        path: "matches",
        element: <MatchPage />,  // Component to list all matches for the current user
      },
      {
        path: "match-requests",
        element: <MatchRequests />,  // Component to handle and display match requests
      },
      {
        path: "chats",
        element: <ChatList />,  // Component to list all chats for the current user
      },
      {
        path: "chats/:chatId",
        element: <ChatPage />,  // Component to display messages in a specific chat
      },
      {
        path: "*",  //404 errors
        element: <NotFoundPage />,
      },
    ],
  },
]);
