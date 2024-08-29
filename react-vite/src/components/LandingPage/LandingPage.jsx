import "./LandingPage.css";
import GameList from '../GameList';

function LandingPage() {
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
