import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadMatches, thunkCreateMatch } from '../../redux/match';
import './MatchPage.css'

const MatchPage = () => {
    const dispatch = useDispatch();
    const matches = useSelector((state) => state.matches);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const userId = useSelector((state) => state.session.user.id);

    useEffect(() => {
        dispatch(thunkLoadMatches());
    }, [dispatch]);

    // const handleSwipeRight = () => {
    //     const match = matches[currentMatchIndex];
    //     dispatch(thunkCreateMatch(userId, match.id));
    //     setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
    // };
    const handleSwipeRight = () => {
        if (matches.length > 0) {
            const match = matches[currentMatchIndex];
            dispatch(thunkCreateMatch(userId, match.id));
            setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
        }
    };

    const handleSwipeLeft = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
    };

    const currentMatch = matches[currentMatchIndex];

    return (
        <div className="match-page">
            {currentMatch ? (
                <div className="match-card">
                    {/* <img src={currentMatch.profilePictureUrl} alt={`${currentMatch.firstName}'s profile`} /> */}
                    <h2>{currentMatch.firstName}</h2>
                    <p>{currentMatch.age} years old</p>
                    <p>Playstyle: {currentMatch.playstyle}</p>
                    <p>Region: {currentMatch.region}</p>
                    <div className="swipe-buttons">
                        <button onClick={handleSwipeLeft}>Swipe Left</button>
                        <button onClick={handleSwipeRight}>Swipe Right</button>
                    </div>
                </div>
            ) : (
                <p>No matches available</p>
            )}
        </div>
    );
};

export default MatchPage;
