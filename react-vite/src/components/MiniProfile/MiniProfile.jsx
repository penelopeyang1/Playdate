import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadUserGames } from '../../redux/game';
import { thunkLoadUserDetails } from '../../redux/user';
import './MiniProfile.css';

const MiniProfile = ({ userId }) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.users[userId] || {});
    const games = useSelector(state => state.games || {});

    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadUserDetails(userId));
            dispatch(thunkLoadUserGames(userId));
        }
    }, [dispatch, userId]);

    // console.log('User:', user);
    // console.log('User Games:', userGames);

    const gamesArray = Object.values(games);

    return (
        <div className="mini-profile">
            {user && user.first_name ? (
                <div className="content">
                    <div className='filter-bar'></div>
                    <div className='name'><h2>{user.first_name}</h2></div>
                    <div className='image'><img src={user.image_url}></img></div>
                    <div className='info-bar'>
                        <p><i className="fa-solid fa-genderless"></i> {user.gender || 'N/A'}</p>
                        <p><i className="fa-solid fa-cake-candles"></i> {user.age || 'N/A'}</p>
                        <p><i className="fa-solid fa-globe"></i> {user.region || 'N/A'}</p>
                        <p><i className="fa-solid fa-medal"></i> {user.playstyle || 'N/A'}</p>
                        <p><i className="fa-solid fa-microphone"></i> {user.has_mic ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
            <div className="games-container">
                <h3>Some games I play</h3>
                {gamesArray.length === 0 ? (
                    <p>No games added yet.</p>
                ) : (
                    <div className="mini-profile-games">
                        {gamesArray.map(game => (
                            <div key={game.id} className="game-item">
                                <img src={game.game_image_url} alt={game.title} className="game-image" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='platforms'>
                <h3>Platforms I play on</h3>
                <div className='platforms-list'>
                    <p>{user.platforms}</p>
                </div>
            </div>
            <div className='clips'>

            </div>
        </div>
    );
};

export default MiniProfile;
