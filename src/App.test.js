import {expect} from "chai";

const testTable = [
    {score1: 0, score2: 0, expected: 1},
    {score1: 0, score2: 1, expected: 1},
    {score1: 1, score2: 1, expected: 2},
    {score1: 2, score2: 1, expected: 2},
    {score1: 3, score2: 1, expected: 1},
    {score1: 3, score2: 2, expected: 1},
    {score1: 3, score2: 3, expected: 2},
    {score1: 3, score2: 4, expected: 2},
    {score1: 3, score2: 5, expected: 1},
    {score1: 10, score2: 10, expected: 1},
    {score1: 10, score2: 11, expected: 2},
    {score1: 11, score2: 11, expected: 1},
    {score1: 11, score2: 12, expected: 2},
    {score1: 11, score2: 13, expected: 1},
]

function whoseServe(score1, score2) {
    if (score1 >= 10) {
        return (score1 + score2) % 2 + 1;
    }
    return Math.floor((score1 + score2) / 2) % 2 + 1;

}

describe("whoseServe", () => {
    testTable.forEach(({score1, score2, expected}) => {
        it(`should return ${expected} when score is ${score1}:${score2}`, function () {
            const serves = whoseServe(score1, score2);
            expect(serves).to.equal(expected);
        })
    })
})