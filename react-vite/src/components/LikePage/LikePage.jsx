import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsersWhoLikedMe, thunkLoadUsersLikedByMe } from '../../redux/match.js';
import MiniProfile from '../MiniProfile';
import './LikePage.css';

const LikePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const userId = user?.id;
    const likedUsers = useSelector(state => state.matches.likedUsers);
    const usersLikedByMe = useSelector(state => state.matches.usersLikedByMe);
    const [selectedUser, setSelectedUser] = useState(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (userId) {
            dispatch(loadUsersWhoLikedMe(userId));
            dispatch(thunkLoadUsersLikedByMe(userId));
        }
    }, [dispatch, userId]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleCloseProfile = () => {
        setSelectedUser(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                handleCloseProfile();
            }
        };

        if (selectedUser) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedUser]);

    if (!userId) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="like-page">
            <div className='liked-you'>
                <h2>People that liked you</h2>
                {likedUsers.length === 0 ? (
                    <p>No one has liked you... yet.</p>
                ) : (
                    <div className="users-list">
                        {likedUsers.map(user => (
                            <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
                                <img src={user.image_url} alt={`${user.first_name}'s avatar`} />
                                <p>{user.first_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='you-liked'>
                <h2>People you liked</h2>
                {usersLikedByMe.length === 0 ? (
                    <p>You haven't liked anyone yet.</p>
                ) : (
                    <div className="users-list">
                        {usersLikedByMe.map(user => (
                            <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
                                <img src={user.image_url} alt={`${user.first_name}'s avatar`} />
                                <p>{user.first_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedUser && (
                <div className="mini-profile-overlay">
                    <div className="mini-profile-content" ref={overlayRef}>
                        <MiniProfile userId={selectedUser.id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikePage;
