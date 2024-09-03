import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeleteGame } from '../../redux/game';
import './DeleteGameModal.css';

const DeleteGameModal = ({ gameId }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(thunkDeleteGame(gameId));
        closeModal();
    };

    return (
        <div className='delete-game-modal'>
            <img src='../diamond-star.png' alt='Confirmation Icon'></img>
            <div className="title">
                <h3>Are you sure you want to delete this game?</h3>
            </div>
            <div className="buttons">
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                <button className="confirm-button" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default DeleteGameModal;
