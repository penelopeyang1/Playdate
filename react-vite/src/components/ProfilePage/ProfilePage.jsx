// // import { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { thunkLoadUserGames } from '../../redux/game';
// // import './ProfilePage.css';

// // const ProfilePage = () => {
// //     const dispatch = useDispatch();
// //     const userId = useSelector(state => state.session.user.id); // Fetch the user ID from the state
// //     const gamesObject = useSelector(state => state.games); // Fetch games from the state

// //     useEffect(() => {
// //         if (userId) {
// //             dispatch(thunkLoadUserGames(userId));
// //         }
// //     }, [dispatch, userId]);

// //     const games = Object.values(gamesObject);

// //     return (
// //         <div className="profile-page-container">
// //             <h1>Your Profile</h1>
// //             <div className="profile-games">
// //                 <h2>Your Games</h2>
// //                 {games.length === 0 ? (
// //                     <p>No games added yet.</p>
// //                 ) : (
// //                     <div className="games-list">
// //                         {games.map(game => (
// //                             <div key={game.id} className="game-item">
// //                                 <img src={game.image_url} alt={game.title} className="game-image" />
// //                                 <div className="game-details">
// //                                     <h3>{game.title}</h3>
// //                                     {/* <p>{game.description}</p> */}
// //                                     {/* Add other game details as needed */}
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default ProfilePage;

// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { thunkLoadUserGames } from '../../redux/game';
// import './ProfilePage.css';

// const ProfilePage = () => {
//     const dispatch = useDispatch();
//     const userId = useSelector(state => state.session.user.id);

//     const userGames = useSelector(state => state.games);

//     useEffect(() => {
//         if (userId) {
//             dispatch(thunkLoadUserGames(userId));
//         }
//     }, [dispatch, userId]);

//     return (
//         <div className="profile-page-container">
//             <h1>Your Profile</h1>
//             <div className="profile-games">
//                 <h2>Your Games</h2>
//                 {userGames && userGames.length === 0 ? (
//                     <p>No games added yet.</p>
//                 ) : (
//                     <div className="games-list">
//                         {userGames && userGames.map(game => (
//                             <div key={game.id} className="game-item">
//                                 <img src={game.image_url} alt={game.title} className="game-image" />
//                                 <div className="game-details">
//                                     <h3>{game.title}</h3>
//                                     {/* Optionally display game description */}
//                                     {/* <p>{game.description}</p> */}
//                                     {/* Add other game details as needed */}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadUserGames } from '../../redux/game';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.session.user.id);

    const userGames = useSelector(state => state.games);

    // const userGames = useSelector(state => state.userGames);


    useEffect(() => {
        if (userId) {
            dispatch(thunkLoadUserGames(userId));
        }
    }, [dispatch, userId]);

    // Convert userGames object into an array
    const gamesArray = Object.values(userGames);

    return (
        <div className="profile-page-container">
            <h1>Your Profile</h1>
            <div className="profile-games">
                <h2>Your Games</h2>
                {gamesArray.length === 0 ? (
                    <p>No games added yet.</p>
                ) : (
                    <div className="profile-games-list">
                        {gamesArray.map(game => (
                            <div key={game.id} className="game-item">
                                <img src={game.image_url} alt={game.title} className="game-image" />
                                <div className="game-details">
                                    <h3>{game.title}</h3>
                                    {/* Optionally display game description */}
                                    {/* <p>{game.description}</p> */}
                                    {/* Add other game details as needed */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
