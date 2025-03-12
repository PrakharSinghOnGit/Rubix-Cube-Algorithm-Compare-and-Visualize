const { RubiksCube,
    move_U,
    move_U_prime,
    move_U2,
    move_D,
    move_D_prime,
    move_D2,
    move_L,
    move_L_prime,
    move_L2,
    move_R,
    move_R_prime,
    move_R2,
    move_F,
    move_F_prime,
    move_F2,
    move_B,
    move_B_prime,
    move_B2,
} = require('./cube-Structure-Rotations');

function scrambleCube(cube, numMoves=10)
{
    const moves = [
        move_U, move_U_prime,
        move_D, move_D_prime,
        move_L, move_L_prime,
        move_R, move_R_prime,
        move_F, move_F_prime,
        move_B, move_B_prime,
    ]

    for(let i=0; i<numMoves; i++)
    {
        let randomMove = moves[Math.floor(Math.random() * moves.length)];
        randomMove(cube);
    }
}

module.exports = {scrambleCube};