import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeleteMatch, loadUserMatches } from '../../redux/match';
import './UnmatchModal.css';

const UnmatchModal = ({ matchId }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const userId = user?.id;

    // Handler to confirm unmatch
    const handleConfirmUnmatch = async () => {
        try {
            // Dispatch the thunk to delete the match
            await dispatch(thunkDeleteMatch(matchId));
            // Reload the user's matches
            await dispatch(loadUserMatches(userId));
            closeModal();
        } catch (error) {
            console.error("Error unmatching:", error);
        }
    };

    return (
        <div className="unmatch-modal">
            <img src='../public/diamond-star.png'></img>
            <div className="title">
                <h3>Are you sure you want to unmatch?</h3>
            </div>
            <div className="buttons">
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                <button className="confirm-button" onClick={handleConfirmUnmatch}>Unmatch</button>
            </div>
        </div>
    );
}

export default UnmatchModal;
