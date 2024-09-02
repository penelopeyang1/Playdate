import "./LandingPage.css";
import GameList from '../GameList';

function LandingPage() {
    return (
        <div className="landing-page-container">
            <div className="headline">
                <div className="text">
                    <h1>Gaming is better together.</h1>
                    <h1>Find your duo.</h1>
                </div>
            </div>
            <GameList />
        </div>
    );
}

export default LandingPage;
