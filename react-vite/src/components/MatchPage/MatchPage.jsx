// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { thunkLoadPotentialMatches } from '../../redux/match';
// import './MatchPage.css';

// const MatchPage = () => {
//     const dispatch = useDispatch();
//     const potentialMatches = useSelector((state) => state.matches.potentialMatches);
//     const userId = useSelector((state) => state.session.user.id);

//     useEffect(() => {
//         dispatch(thunkLoadPotentialMatches(userId));
//     }, [dispatch, userId]);

//     const handleSwipeRight = () => {
//             if (potentialMatches.length > 0) {
//                 const match = potentialMatches[currentMatchIndex];
//                 dispatch(thunkCreateMatch(userId, match.id)); // Ensure this action exists
//                 setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % potentialMatches.length);
//             }
//         };

//     const handleSwipeLeft = () => {
//         setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % potentialMatches.length);
//     };

//     return (
//         <div className="match-page">
//             {potentialMatches.length > 0 ? (
//                 <div className="potential-matches-list">
//                     {potentialMatches.map((match) => (
//                         <div key={match.id} className="match-card">
//                             <img src={match.imageUrl} alt={`${match.firstName}'s profile`} />
//                             <h2>{match.firstName}</h2>
//                             <p>{match.age} years old</p>
//                             <p>Playstyle: {match.playstyle}</p>
//                             <p>Region: {match.region}</p>
//                             <div className="swipe-buttons">
//                                 <button onClick={handleSwipeLeft}>Swipe Left</button>
//                                 <button onClick={handleSwipeRight}>Swipe Right</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>No potential matches available</p>
//             )}
//         </div>
//     );
// };

// export default MatchPage;

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { thunkLoadPotentialMatches, thunkCreateMatch } from '../../redux/match';
// import MiniProfile from '../MiniProfile'; // Import MiniProfile component
// import './MatchPage.css';

// const MatchPage = () => {
//     const dispatch = useDispatch();
//     const potentialMatches = useSelector((state) => state.matches.potentialMatches || []);
//     const userId = useSelector((state) => state.session.user.id);
//     const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

//     useEffect(() => {
//         dispatch(thunkLoadPotentialMatches(userId));
//     }, [dispatch, userId]);

//     // const filteredMatches = potentialMatches.filter(match => match.id !== userId);
//     const filteredMatches = potentialMatches.filter(match => match.id.toString() !== userId.toString());

//     const handleSwipeRight = () => {
//         if (filteredMatches.length > 0) {
//             const match = filteredMatches[currentMatchIndex];
//             dispatch(thunkCreateMatch({ user_one_id: userId, user_two_id: match.id, status: 'pending' }));
//             setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % filteredMatches.length);
//         }
//     };

//     const handleSwipeLeft = () => {
//         setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % filteredMatches.length);
//     };

//     const currentMatch = filteredMatches[currentMatchIndex];

//     return (
//         <div className="match-page">
//             {filteredMatches.length > 0 ? (
//                 <div className="match-card">
//                     <MiniProfile userId={currentMatch.id} />
//                     <div className="swipe-buttons">
//                         <button onClick={handleSwipeLeft}>Swipe Left</button>
//                         <button onClick={handleSwipeRight}>Swipe Right</button>
//                     </div>
//                 </div>
//             ) : (
//                 <p>No potential matches available</p>
//             )}
//         </div>
//     );
// };

// export default MatchPage;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadPotentialMatches, thunkCreateMatch } from '../../redux/match';
import MiniProfile from '../MiniProfile';
import './MatchPage.css';

const MatchPage = () => {
    const dispatch = useDispatch();
    const potentialMatches = useSelector((state) => state.matches.potentialMatches || []);
    const userId = useSelector((state) => state.session.user.id);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    useEffect(() => {
        dispatch(thunkLoadPotentialMatches(userId));
    }, [dispatch, userId]);

    const filteredMatches = potentialMatches.filter(match => match.id !== userId);

    const handleSwipeRight = () => {
        if (filteredMatches.length > 0) {
            const match = filteredMatches[currentMatchIndex];
            dispatch(thunkCreateMatch({ user_one_id: userId, user_two_id: match.id, status: 'pending' }));
            setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % filteredMatches.length);
        }
    };

    const handleSwipeLeft = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % filteredMatches.length);
    };

    const currentMatch = filteredMatches[currentMatchIndex];

    return (
        <div className="match-page">
            {filteredMatches.length > 0 ? (
                <div className="match-card">
                    <MiniProfile userId={currentMatch?.id} />
                    <div className="swipe-buttons">
                        <button onClick={handleSwipeLeft}>Swipe Left</button>
                        <button onClick={handleSwipeRight}>Swipe Right</button>
                    </div>
                </div>
            ) : (
                <p>No potential matches available</p>
            )}
        </div>
    );
};

export default MatchPage;
