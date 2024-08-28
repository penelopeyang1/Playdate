import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadGames } from '../../redux/game';

const GameList = () => {
    const dispatch = useDispatch();
    const gamesObject = useSelector(state => state.games); // games as an object
    console.log(gamesObject);

    // Convert object to array
    const games = Object.values(gamesObject);

    useEffect(() => {
        dispatch(thunkLoadGames());
    }, [dispatch]);

    return (
        <div>
            <h1>Games List</h1>
            {games.length === 0 ? (
                <p>No games available</p>
            ) : (
                <ul>
                    {games.map(game => (
                        <li key={game.id}>{game.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GameList;
