// import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './UserMenu.css'


// const UserMenu = () => {
//     return (
//         <footer className="sticky-footer">
//             <nav className="footer-nav">
//                 <Link to="/find-matches" className="footer-link">Find Matches</Link>
//                 <Link to="/match-requests" className="footer-link">Match Requests</Link>
//                 <Link to="/chats/:userId" className="footer-link">Match Chats</Link>
//                 <span></span>
//                 <Link to="/profile/:userId" className="footer-link">Profile</Link>
//             </nav>
//         </footer>
//     );
// };

const UserMenu = () => {
    //get the current user's ID from Redux store
    const userId = useSelector(state => state.session.user?.id);

    return (
        <footer className="sticky-footer">
            <nav className="footer-nav">
                <Link to="/find-matches" className="footer-link">Find Matches</Link>
                <Link to="/match-requests" className="footer-link">Match Requests</Link>
                {userId && (
                    <Link to={`/chats/${userId}`} className="footer-link">Match Chats</Link>
                )}
                <span></span>
                {userId && (
                    <Link to={`/profile/${userId}`} className="footer-link">Profile</Link>
                )}
            </nav>
        </footer>
    );
};


export default UserMenu;
