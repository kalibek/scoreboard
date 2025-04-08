import './App.css'
import {useEffect, useReducer} from "react";

const PLAYER1_NAME_SET = "player1_name_set";
const PLAYER2_NAME_SET = "player2_name_set";
const PLAYER1_SCORED = "player1_scored";
const PLAYER2_SCORED = "player2_scored";
const UNDO = "undo";
const RESET_SCORE = "reset_score";

const initState = {
    player1: "Player 1",
    player2: "Player 2",
    service: 1,
    score1: 0,
    score2: 0,
    games1: 0,
    games2: 0,
    results: [],
}

function reducer(prevState, action) {
    switch (action.type) {
        case PLAYER1_NAME_SET:
            return {
                ...prevState,
                player1: action.name,
                history: {...prevState}
            }
        case PLAYER2_NAME_SET:
            return {
                ...prevState,
                player2: action.name,
                history: {...prevState}
            }
        case PLAYER1_SCORED: {
            let newScore = prevState.score1 + 1;
            if (newScore >= 11 && newScore > prevState.score2 + 1) {
                return {
                    ...prevState, score1: 0, score2: 0, games1: prevState.games1 + 1,
                    results: [...prevState.results, {
                        game: prevState.results.length + 1,
                        result1: newScore,
                        result2: prevState.score2
                    }],
                    history: {...prevState}
                }
            } else {
                return {
                    ...prevState, score1: newScore,
                    history: {...prevState}
                }
            }
        }
        case PLAYER2_SCORED: {
            let newScore = prevState.score2 + 1;
            if (newScore >= 11 && newScore > prevState.score1 + 1) {
                return {
                    ...prevState, score2: 0, score1: 0, games2: prevState.games2 + 1,
                    results: [...prevState.results, {
                        game: prevState.results.length + 1,
                        result1: prevState.score1,
                        result2: newScore
                    }],
                    history: {...prevState}
                }
            } else {
                return {
                    ...prevState, score2: newScore,
                    history: {...prevState}
                }
            }
        }
        case RESET_SCORE:
            return {
                ...prevState,
                score1: 0, score2: 0,
                games1: 0, games2: 0,
                results: [],
                history: {...prevState}
            }
        case UNDO:
            return prevState.history ? {
                ...prevState.history
            } : prevState;
        default:
            return prevState;
    }
}

function App() {

    const handleKey = (e) => {
        if (e.keyCode === 37) {
            dispatch({type: PLAYER1_SCORED})
        }
        if (e.keyCode === 39) {
            dispatch({type: PLAYER2_SCORED})
        }
    };

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
                <table>
                    <tbody>
                    <tr className="red">
                        <td className="name">{player1}</td>
                        <td className="score"><b>{games1}</b></td>
                        {results.map(r => <td key={`${r.game}_1`} className="score games">
                            {(r.result1 > r.result2) ? <b>{r.result1}</b> : r.result1}

                        </td>)}
                        <td className="score">{score1}</td>
                    </tr>
                    <tr className="blue">
                        <td className="name">{player2}</td>
                        <td className="score"><b>{games2}</b></td>
                        {results.map(r => <td key={`${r.game}_2`} className="score games">
                            {(r.result2 > r.result1) ? <b>{r.result2}</b> : r.result2}
                        </td>)}
                        <td className="score">{score2}</td>
                    </tr>
                    </tbody>
                </table>

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
