import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { thunkLoadUserGames } from '../../redux/game';
import { thunkLoadUserDetails } from '../../redux/user';
import './MiniProfile.css';

const MiniProfile = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();

    // Fetch user details from the state
    // const user = useSelector(state => state.session[userId]);
    // const userGames = useSelector(state => state.games);


    const user = useSelector(state => state.users[userId] || {});
    const userGames = useSelector(state => state.userGames || {});

    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadUserDetails(userId));
            dispatch(thunkLoadUserGames(userId));
        }
    }, [dispatch, userId]);

    console.log('User:', user);
    console.log('User Games:', userGames);

    const gamesArray = Object.values(userGames);

    return (
        <div className="mini-profile">
            {user && (
                <div className="mini-profile-details">
                    {/* <img src={user.image_url || '/default-profile.png'} alt={user.first_name} className="profile-image" /> */}
                    <h2>{user.first_name}</h2>
                    <p>Gender: {user.gender || 'N/A'}</p>
                    <p>Age: {user.age || 'N/A'}</p>
                    <p>Region: {user.region || 'N/A'}</p>
                    <p>Playstyle: {user.playstyle || 'N/A'}</p>
                    <p>Mic Available: {user.has_mic ? 'Yes' : 'No'}</p>
                    <p>Platforms: {user.platforms || 'N/A'}</p>
                </div>
            )}
            <div className="mini-profile-games">
                <h3>Games</h3>
                {gamesArray.length === 0 ? (
                    <p>No games added yet.</p>
                ) : (
                    <div className="games-list">
                        {gamesArray.map(game => (
                            <div key={game.id} className="game-item">
                                <img src={game.game_image_url} alt={game.game_title} className="game-image" />
                                <div className="game-details">
                                    <h4>{game.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiniProfile;
