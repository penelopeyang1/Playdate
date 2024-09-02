import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkLoadUserDetails } from '../../redux/user';
import { thunkLoadUserGames, thunkDeleteGame } from '../../redux/game';
import MiniProfile from '../MiniProfile';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector(state => state.session.user.id);
    const user = useSelector(state => state.users[userId]);
    const userGames = useSelector(state => state.games);
    const [isMiniProfileOpen, setIsMiniProfileOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadUserDetails(userId));
            dispatch(thunkLoadUserGames(userId));
        }
    }, [dispatch, userId]);

    const handleToggleMiniProfile = () => {
        setIsMiniProfileOpen(!isMiniProfileOpen);
    };

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
    };

    const handleAddMoreGames = () => {
        navigate('/add-games');
    };

    const handleDeleteGame = (gameId) => {
        if (window.confirm('Are you sure you want to delete this game from your profile?')) {
            dispatch(thunkDeleteGame(gameId));
        }
    };

    const gamesArray = Object.values(userGames);

    return (
        <div className="profile-page-container">
            <h1>Your Profile</h1>
            <button onClick={handleToggleMiniProfile}>
                {isMiniProfileOpen ? 'Close Mini Profile' : 'View Mini Profile'}
            </button>
            <button onClick={handleEditProfile}>
                Edit Profile
            </button>
            <button onClick={handleAddMoreGames}>
                Add More Games
            </button>
            {user && (
                <div className="user-details">
                    <h2>{user.first_name}</h2>
                    <p>Email: {user.email}</p>
                    <p>Age: {user.age}</p>
                    <p>Region: {user.region}</p>
                    <p>Playstyle: {user.playstyle}</p>
                    <p>Platforms: {user.platforms}</p>
                    <img src={user.profile_image_url} alt="Profile" className="profile-image" />
                </div>
            )}
            <div className="profile-games">
                <h2>Your Games</h2>
                {gamesArray.length === 0 ? (
                    <p>No games added yet.</p>
                ) : (
                    <div className="profile-games-list">
                        {gamesArray.map(game => (
                            <div key={game.id} className="game-item">
                                <img src={game.image_url} alt={game.title} className="game-image" />
                                <div className="game-details">
                                    <h3>{game.title}</h3>
                                    <button onClick={() => handleDeleteGame(game.id)}>Delete Game</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
