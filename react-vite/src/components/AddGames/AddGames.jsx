import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkLoadAllGames, thunkAddGame } from '../../redux/game';
import './AddGames.css';

const AddGames = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const gamesObject = useSelector(state => state.games);
    const userId = useSelector(state => state.session.user.id);

    const games = Object.values(gamesObject);

    const [selectedGames, setSelectedGames] = useState([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(thunkLoadAllGames());
    }, [dispatch]);

    const handleSelect = (gameId) => {
        setSelectedGames(prevSelected =>
            prevSelected.includes(gameId)
                ? prevSelected.filter(id => id !== gameId)
                : [...prevSelected, gameId]
        );
    };

    const handleSubmit = async () => {
        if (selectedGames.length === 0) {
            setError("You must select at least one game.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            await Promise.all(selectedGames.map(gameId => dispatch(thunkAddGame(userId, gameId))));
            navigate(`/profile/${userId}`);
        } catch (error) {
            console.error('Error adding games:', error);
            setError("An error occurred while adding the games. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="add-game-container">
            {games.length === 0 ? (
                <p>No games available</p>
            ) : (
                <div className="add-to-profile">
                    <div className="add-titles">
                        <h1>Pick the games you play to showcase on your profile!</h1>
                        {/* <h2>Showcase the games you play on your profile :)</h2> */}
                    </div>
                    <div className="add-games">
                        {games.map(game => (
                            <div key={game.id} className="add-game-item">
                                <img src={game.image_url} alt={game.title} className="add-game-image" />
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedGames.includes(game.id)}
                                        onChange={() => handleSelect(game.id)}
                                    />
                                    {/* {game.title} */}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Selected Games'}
                    </button>
                    {error && <p className="submit-error-message">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default AddGames;
