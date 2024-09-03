import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserMatches } from '../../redux/match.js';
import OpenModalButton from "../OpenModalButton";
import './ChatList.css';
import UnmatchModal from '../UnmatchModal';
import MiniProfile from '../MiniProfile';

const ChatList = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const userId = user?.id;
    const matches = useSelector(state => state.matches.matches || {});
    const [selectedUser, setSelectedUser] = useState(null);
    const overlayRef = useRef(null);
    const [starredMatches, setStarredMatches] = useState([]);

    useEffect(() => {
        if (userId) {
            dispatch(loadUserMatches(userId));
        }
    }, [dispatch, userId]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleToggleStar = (matchId) => {
        setStarredMatches(prevStarredMatches => {
            if (prevStarredMatches.includes(matchId)) {
                return prevStarredMatches.filter(id => id !== matchId);
            } else {
                return [...prevStarredMatches, matchId];
            }
        });
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

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="chat-list">
            {Object.keys(matches).length === 0 ? (
                <h3 className='no-matches'>You have no matches yet.</h3>
            ) : (
                <div className="matches-list">
                    <h2>Matches</h2>
                    <div className='chats-container'>
                        {Object.values(matches).map(({ match, matched_user }) => (
                            <div
                                key={match.id}
                                className="card"
                                onClick={() => handleUserClick(matched_user)}
                            >
                                <div className='img-details'>
                                    <img src={matched_user.profile_image_url} alt={matched_user.first_name} />
                                    <div className='name-desc'>
                                        <h4>{matched_user.first_name}</h4>
                                        <span>Start the chat with {matched_user.first_name}!</span>
                                    </div>
                                </div>
                                <div className='buttons' onClick={(event) => event.stopPropagation()}>
                                    {/* starring matches */}
                                    <button
                                        className={`star-button ${starredMatches.includes(match.id) ? 'starred' : ''}`}
                                        onClick={() => handleToggleStar(match.id)}
                                    >
                                        {starredMatches.includes(match.id) ? '★' : '☆'}
                                    </button>
                                    <OpenModalButton
                                        buttonText={<i className="fa-solid fa-xmark"></i>}
                                        className='unmatch-button'
                                        modalComponent={<UnmatchModal matchId={match.id} />}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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

export default ChatList;
