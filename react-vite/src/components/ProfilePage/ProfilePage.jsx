import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkLoadUserGames, thunkDeleteGame } from '../../redux/game';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector(state => state.session.user.id);
    const userGames = useSelector(state => state.games);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadUserGames(userId));
        }
    }, [dispatch, userId]);

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
            <button onClick={handleEditProfile}>
                Edit Profile
            </button>
            <button onClick={handleAddMoreGames}>
                Add More Games
            </button>
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
