// import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './UserMenu.css'

const UserMenu = () => {
    //get the current user's ID from Redux store
    const userId = useSelector(state => state.session.user?.id);

    return (
        <div className='user-menu-container'>
            {userId && (
                <div className="sticky-footer">
                    <nav className="footer-nav">
                        <Link to="/find-matches" className="footer-link">
                            <i class="fa-solid fa-p"></i>
                        </Link>
                        <Link to="/match-requests" className="footer-link">
                            <i class="fa-solid fa-heart"></i>
                        </Link>
                        <Link to={`/chats/${userId}`} className="footer-link">
                            <i class="fa-solid fa-comment"></i>
                        </Link>
                        <Link to={`/profile/${userId}`} className="footer-link">
                            <i class="fa-solid fa-user"></i>
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    );
};


export default UserMenu;
