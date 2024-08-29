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
            <div className="better-together">
                <h1>Gaming is better together.</h1>
            </div>
            <div className="meet-duo">
                <h1>Meet your duo.</h1>
            </div>
            <GameList />
        </div>
    );
}

export default LandingPage;
