import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadPotentialMatches, thunkCreateLike, thunkCreateDislike, loadUsersWhoLikedMe, thunkLoadUsersLikedByMe, thunkLoadMatches } from '../../redux/match';
import MiniProfile from '../MiniProfile';
import './MatchPage.css';

const MatchPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const userId = user?.id;
    const potentialMatches = useSelector(state => state.matches.potentialMatches || []);
    const likedUsers = useSelector(state => state.matches.likedUsers || []);
    const likes = useSelector(state => state.matches.likes || []);
    const matches = useSelector(state => state.matches.matches || {});
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadPotentialMatches(userId));
            dispatch(loadUsersWhoLikedMe(userId));
            dispatch(thunkLoadUsersLikedByMe(userId));
            dispatch(thunkLoadMatches(userId));
        }
    }, [dispatch, userId]);

    const filteredMatches = potentialMatches.filter(match => match.id !== userId);
    const currentMatch = filteredMatches[currentMatchIndex];

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const checkMutualLike = (matchId) => {
        return matches[matchId]?.status === 'matched';
    };

    const handleSwipeRight = () => {
        if (filteredMatches.length > 0) {
            const match = filteredMatches[currentMatchIndex];
            console.log('Current Match:', match);

            dispatch(thunkCreateLike(userId, match.id)).then(() => {
                dispatch(thunkLoadMatches(userId)).then(() => {
                    const mutualLike = checkMutualLike(match.id);

                    console.log('Current User ID:', userId);
                    console.log('Liked User ID:', match.id);
                    console.log('Users Who Liked Me:', likedUsers.map(user => user.id));
                    console.log('Likes by Current User:', likes.map(like => like.requestee_id));
                    console.log('Mutual Like (after refresh):', mutualLike);

                    setAnimationClass(mutualLike ? 'match-made' : 'swipe-right');

                    setTimeout(() => {
                        setAnimationClass('');
                        if (currentMatchIndex < filteredMatches.length - 1) {
                            setCurrentMatchIndex((prevIndex) => prevIndex + 1);
                        } else {
                            setCurrentMatchIndex(-1);
                        }
                    }, 500);
                });
            });
        }
    };

    const handleSwipeLeft = () => {
        if (filteredMatches.length > 0) {
            const match = filteredMatches[currentMatchIndex];
            setAnimationClass('swipe-left');
            setTimeout(() => {
                dispatch(thunkCreateDislike(userId, match.id)).then(() => {
                    setAnimationClass('');
                    if (currentMatchIndex < filteredMatches.length - 1) {
                        setCurrentMatchIndex((prevIndex) => prevIndex + 1);
                    } else {
                        setCurrentMatchIndex(-1);
                    }
                });
            }, 300);
        }
    };

    if (!userId) {
        return <p>Loading user data...</p>;
    }

    if (currentMatchIndex === -1 || filteredMatches.length === 0) {
        return (
            <div className='no-more-msg'>
                <p>No more potential matches available.</p>
                <p>Come back again later!</p>
            </div>
        )
    }

    return (
        <div className="match-page">
            {filteredMatches.length > 0 ? (
                <div className={`match-card ${animationClass}`}>
                    <MiniProfile userId={currentMatch?.id} />
                    <div className="swipe-buttons">
                        <button className='dislike-button' onClick={handleSwipeLeft}><i className="fa-solid fa-heart-crack"></i></button>
                        <button className='like-button' onClick={handleSwipeRight}><i className="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            ) : (
                <p>Loading potential matches...</p>
            )}
        </div>
    );
};

export default MatchPage;
