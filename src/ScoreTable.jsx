import {Serve} from "./Serve.jsx";

function whoseServe(score1, score2, gameCount) {
    let turn = (score1 >= 10) ?
        (score1 + score2) % 2 :
        Math.floor((score1 + score2) / 2) % 2;

    if (gameCount % 2 !== 0) {
        turn = 1 - turn;
    }
    return turn + 1;

}

function ScoreRow({showScores, player, order, serve, score, games, results}) {
    return <tr className={order === 1 ? "red" : "blue"}>
        <td className="name">
            <Serve name={player} order={order} serve={serve}></Serve>
        </td>
        <td className="score"><b>{games}</b></td>
        {showScores ? results.map(r => <td key={`${r.game}_${order}`} className="score games">
            {order === 1 ?
                ((r.result1 > r.result2) ? <b>{r.result1}</b> : r.result1) :
                ((r.result2 > r.result1) ? <b>{r.result2}</b> : r.result2)
            }
        </td>) : <></>}
        <td className="score">{score}</td>
    </tr>
}

export function ScoreTable({
                               player1, player2,
                               score1, score2,
                               games1, games2,
                               results
                           }) {


    const serve = whoseServe(score1, score2, results.length);

    const showScores = score1 === 0 && score2 === 0;
    return <table>
        <tbody>
        <ScoreRow {...{
            player: player1,
            score: score1, games: games1,
            order: 1,
            serve, results, showScores
        }}/>
        <ScoreRow {...{
            player: player2,
            score: score2, games: games2,
            order: 2,
            serve, results, showScores
        }}/>
        </tbody>
    </table>
}