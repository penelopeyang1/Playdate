import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkLoadUserDetails } from '../../redux/user';
import { thunkLoadUserGames, thunkDeleteGame } from '../../redux/game';
import { thunkLogout } from "../../redux/session";
import MiniProfile from '../MiniProfile';
import OpenModalButton from "../OpenModalButton";
import DeleteGameModal from '../DeleteGameModal/DeleteGameModal';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const userId = sessionUser?.id;
    const user = useSelector(state => state.users[userId]);
    const userGames = useSelector(state => state.games);
    const [showMiniProfile, setShowMiniProfile] = useState(false);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadUserDetails(userId));
            dispatch(thunkLoadUserGames(userId));
        } else {
            navigate('/');
        }
    }, [dispatch, userId, navigate]);

    const handleAddMoreGames = () => {
        navigate('/add-games');
    };

    const handleProfileButtonClick = () => {
        setShowMiniProfile(true);
    };

    const handleCloseProfile = () => {
        setShowMiniProfile(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                handleCloseProfile();
            }
        };

        if (showMiniProfile) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMiniProfile]);

    const gamesArray = Object.values(userGames);

    const logout = (e) => {
        e.preventDefault();
        dispatch(thunkLogout());
        navigate('/');
    };

    if (!userId) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="profile-page-container">
            <h1 className='title'>Your Profile</h1>
            {user && (
                <div className="user-details">
                    <div className='img-name'>
                        <img src={user.profile_image_url} className="profile-image" />
                        <div className='name-email'>
                            <h2>{user.first_name}</h2>
                            <p>{user.email}</p>
                            <button className='profile-button' onClick={handleProfileButtonClick}>
                                Profile
                            </button>
                            <button className='logout-button' onClick={logout}>Log out</button>
                        </div>
                    </div>
                    <div className='details'>
                        <p><i className="fa-solid fa-genderless"></i> {user.gender}</p>
                        <p><i className="fa-solid fa-cake-candles"></i> {user.age}</p>
                        <p><i className="fa-solid fa-globe"></i> {user.region}</p>
                        <p><i className="fa-solid fa-medal"></i> {user.playstyle}</p>
                        <p><i className="fa-solid fa-microphone"></i> {user.has_mic ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}
            <div className="profile-games">
                <h2>Your Games</h2>
                <button onClick={handleAddMoreGames} className='add-game-button'>Add More Games</button>
                {gamesArray.length === 0 ? (
                    <p>No games added yet.</p>
                ) : (
                    <div className="profile-games-list">
                        {gamesArray.map(game => (
                            <div key={game.id} className="game-item">
                                <img src={game.game_image_url} alt={game.title} className="game-image" />
                                <div className="delete-button">
                                    <OpenModalButton
                                        buttonText={<i className="fa-solid fa-trash-can"></i>}
                                        className='delete-button'
                                        modalComponent={<DeleteGameModal gameId={game.id} />}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showMiniProfile && (
                <div className="mini-profile-overlay">
                    <div className="mini-profile-content" ref={overlayRef}>
                        <MiniProfile userId={userId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
