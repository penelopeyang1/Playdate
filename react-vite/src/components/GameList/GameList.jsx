import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadGames } from '../../redux/game';
import './GameList.css';

const GameList = () => {
    const dispatch = useDispatch();
    const gamesObject = useSelector(state => state.games);

    //convert object to array
    const games = Object.values(gamesObject);

    useEffect(() => {
        dispatch(thunkLoadGames());
    }, [dispatch]);

    //game list horizontal auto-scroll
    useEffect(() => {
        const scrollContainer = document.querySelector('.game-list');

        //check if scrollContainer exists before applying scroll logic
        if (!scrollContainer) {
            return;
        }

        let scrollAmount = 0;
        const scrollStep = 0.3; //scroll speed
        const scrollInterval = setInterval(() => {
            if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                scrollAmount = 0; //reset scroll position
            } else {
                scrollAmount += scrollStep;
            }
            scrollContainer.scrollLeft = scrollAmount;
        }, 20); //adjust the interval time for smoother scrolling

        return () => clearInterval(scrollInterval);
    }, [games]); //ensure this effect runs after games have been loaded

    return (
        <div className="game-list-container">
            {games.length === 0 ? (
                <p>No games available</p>
            ) : (
                <div className="game-list">
                    {games.map(game => (
                        <div key={game.id} className="game-item">
                            <img src={game.image_url} alt={game.title} className="game-image" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameList;
