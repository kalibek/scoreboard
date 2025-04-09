import './App.css'
import {useEffect, useReducer} from "react";
import {
    PLAYER1_NAME_SET,
    PLAYER1_SCORED,
    PLAYER2_NAME_SET,
    PLAYER2_SCORED,
    reducer,
    RESET_SCORE,
    UNDO
} from "./reducer.js";
import {ScoreTable} from "./ScoreTable.jsx";

const initState = {
    player1: "Player 1",
    player2: "Player 2",
    score1: 0,
    score2: 0,
    games1: 0,
    games2: 0,
    results: [],
}


function App() {

    function handleKey(event) {
        switch (event.keyCode) {
            case 37: {
                dispatch({type: PLAYER1_SCORED});
                break;
            }
            case 39: {
                dispatch({type: PLAYER2_SCORED});
                break;
            }
            case 38: {
                dispatch({type: UNDO});
                break;
            }
            default:
                break
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, []);

    const [state, dispatch] = useReducer(reducer, initState);
    const {
        player1, player2,
        score1, score2,
        games1, games2,
        results
    } = state;

    return (
        <>
            <div className="card">
                <h3>Players</h3>
                <input type="text" value={player1}
                       onChange={e => dispatch({type: PLAYER1_NAME_SET, name: e.target.value})}/>
                vs.
                <input type="text" value={player2}
                       onChange={e => dispatch({type: PLAYER2_NAME_SET, name: e.target.value})}/>


                <h3>Scores</h3>
                <ScoreTable
                    {...{
                        player1, player2,
                        score1, score2,
                        games1, games2,
                        results
                    }}
                />

                <h3>Actions</h3>

                <div>
                    <button onClick={() => dispatch({type: PLAYER1_SCORED})} className="red">(&larr;){player1} scored
                    </button>
                    <button onClick={() => dispatch({type: PLAYER2_SCORED})} className="blue">{player2} scored(&rarr;)
                    </button>
                </div>
                <div>
                    <button onClick={() => dispatch({type: UNDO})}>UNDO</button>
                </div>
                <div>
                    <button onClick={() => dispatch({type: RESET_SCORE})}>RESET</button>
                </div>
            </div>
        </>
    )
}

export default App
