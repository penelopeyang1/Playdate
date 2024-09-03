// import React from 'react';
// import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './UserMenu.css'

const UserMenu = () => {
    // Get the current user's ID from Redux store
    const userId = useSelector(state => state.session.user?.id);

    return (
        <div className='user-menu-container'>
            {userId && (
                <div className="sticky-footer">
                    <nav className="footer-nav">
                        <NavLink
                            to="/find-matches"
                            className={({ isActive }) => isActive ? "footer-link active" : "footer-link"}
                        >
                            <i className="fa-solid fa-p"></i>
                        </NavLink>
                        <NavLink
                            to={`/match-requests/${userId}`}
                            className={({ isActive }) => isActive ? "footer-link active" : "footer-link"}
                        >
                            <i className="fa-solid fa-heart"></i>
                        </NavLink>
                        <NavLink
                            to={`/chats/${userId}`}
                            className={({ isActive }) => isActive ? "footer-link active" : "footer-link"}
                        >
                            <i className="fa-solid fa-comment"></i>
                        </NavLink>
                        <NavLink
                            to={`/profile/${userId}`}
                            className={({ isActive }) => isActive ? "footer-link active" : "footer-link"}
                        >
                            <i className="fa-solid fa-user"></i>
                        </NavLink>
                    </nav>
                </div>
            )}
        </div>
    );
};


export default UserMenu;
