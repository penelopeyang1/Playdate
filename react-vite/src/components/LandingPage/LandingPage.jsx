import { useEffect, useState } from 'react';
import GameList from '../GameList';
import "./LandingPage.css";

function LandingPage() {
    const [loading, setLoading] = useState(true);
    const handleDataLoaded = () => {
        setLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="landing-page-container">
            {loading ? (
                <div className="loader">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <div className="headline">
                        <div className="text">
                            <h1>Gaming is better together.</h1>
                            <h1>Find your duo.</h1>
                        </div>
                    </div>
                    <GameList onDataLoaded={handleDataLoaded} />
                </>
            )}
        </div>
    );
}

export default LandingPage;
