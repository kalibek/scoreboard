const PLAYER1_NAME_SET = "player1_name_set";
const PLAYER2_NAME_SET = "player2_name_set";
const PLAYER1_SCORED = "player1_scored";
const PLAYER2_SCORED = "player2_scored";
const UNDO = "undo";
const RESET_SCORE = "reset_score";


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
                    history: {...prevState},
                    service: (newScore + prevState.score2)
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

export {
    reducer,
    PLAYER1_NAME_SET,
    PLAYER2_NAME_SET,
    PLAYER1_SCORED,
    PLAYER2_SCORED,
    UNDO,
    RESET_SCORE,
}