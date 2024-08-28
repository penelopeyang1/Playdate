// import { useEffect, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { thunkLoadGames } from "../../redux/game";
import "./LandingPage.css";
import GameList from '../../components/GameList';

function LandingPage() {
    // const dispatch = useDispatch();
    // const games = useSelector((state) => state.games);

    // useEffect(() => {
    //     console.log("Dispatching thunkLoadGames...");
    //     dispatch(thunkLoadGames());
    // }, [dispatch]);

    // const displayGames = useMemo(() => Object.values(games), [games]);

    return (
        <div className="landing-page-container">
            <div className="catchphrases">
                <h1>Gaming is better together.</h1>
                <h1>Meet your duo.</h1>
            </div>
            <div className="game-list">
                <GameList />
                {/* {displayGames.map((game) => (
                    <div key={game.id} className="game-item">
                        <img src={game.image_url} alt={game.title} className="game-image" />
                        <h2 className="game-title">{game.title}</h2>
                        <p className="game-genre">{game.genre}</p>
                    </div>
                ))} */}
            </div>
        </div>
    );
}

export default LandingPage;
