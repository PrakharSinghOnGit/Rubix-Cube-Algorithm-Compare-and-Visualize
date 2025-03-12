class RubiksCube {
  constructor(n) {
    this.n = n;
    this.faces = {
      U: Array.from({ length: n }, () => Array(n).fill('W')),
      D: Array.from({ length: n }, () => Array(n).fill('Y')),
      L: Array.from({ length: n }, () => Array(n).fill('G')),
      R: Array.from({ length: n }, () => Array(n).fill('B')),
      F: Array.from({ length: n }, () => Array(n).fill('R')),
      B: Array.from({ length: n }, () => Array(n).fill('O'))
    };
  }

  // Checks if all faces are solved:
  isSolved() {
    return Object.values(this.faces).every(face =>
      face.every(row => row.every(cell => cell === row[0]))
    );
  }

  // Returns a deep copy of the cube state as a nested array structure.
  getState() {
    return {
      U: this.faces.U.map(row => row.slice()),
      D: this.faces.D.map(row => row.slice()),
      L: this.faces.L.map(row => row.slice()),
      R: this.faces.R.map(row => row.slice()),
      F: this.faces.F.map(row => row.slice()),
      B: this.faces.B.map(row => row.slice())
    };
  }

  toString() {
    return Object.entries(this.faces)
      .map(([face, grid]) =>
        `${face}: ${JSON.stringify(grid).replace(/,/g, ', ')}`
      )
      .join('\n');
  }

}

// ----- Cube rotation functions -----

function rotate90cw(face) {
  // Rotate 90° clockwise:
  // For each column i in the original face, take the column values and reverse them.
  return face[0].map((_, i) => face.map(row => row[i]).reverse());
}

function rotate90ccw(face) {
  // Rotate 90° counterclockwise:
  // Map over each column (in order) and then reverse the order of rows.
  return face[0].map((_, i) => face.map(row => row[i])).reverse();
}

// ----- Cube move functions -----

function move_U(cube) {
  // Rotate U face clockwise.
  cube.faces['U'] = rotate90cw(cube.faces['U']);

  // Save F top row.
  let temp = cube.faces['F'][0].slice();

  cube.faces['F'][0] = cube.faces['R'][0];
  cube.faces['R'][0] = cube.faces['B'][0];
  cube.faces['B'][0] = cube.faces['L'][0];
  cube.faces['L'][0] = temp;
}

function move_U_prime(cube) {
  // Save F top row.
  let temp = cube.faces['F'][0].slice();

  cube.faces['F'][0] = cube.faces['L'][0];
  cube.faces['L'][0] = cube.faces['B'][0];
  cube.faces['B'][0] = cube.faces['R'][0];
  cube.faces['R'][0] = temp;

  cube.faces['U'] = rotate90ccw(cube.faces['U']);
}

function move_D(cube) {
  cube.faces['D'] = rotate90cw(cube.faces['D']);
  let lastIndex = cube.faces['F'].length - 1;
  let temp = cube.faces['F'][lastIndex].slice();

  cube.faces['F'][lastIndex] = cube.faces['L'][lastIndex];
  cube.faces['L'][lastIndex] = cube.faces['B'][lastIndex];
  cube.faces['B'][lastIndex] = cube.faces['R'][lastIndex];
  cube.faces['R'][lastIndex] = temp;
}

function move_D_prime(cube) {
  let lastIndex = cube.faces['F'].length - 1;
  let temp = cube.faces['F'][lastIndex].slice();

  cube.faces['F'][lastIndex] = cube.faces['R'][lastIndex];
  cube.faces['R'][lastIndex] = cube.faces['B'][lastIndex];
  cube.faces['B'][lastIndex] = cube.faces['L'][lastIndex];
  cube.faces['L'][lastIndex] = temp;

  cube.faces['D'] = rotate90ccw(cube.faces['D']);
}

function move_L(cube) {
  let n = cube.n;
  cube.faces['L'] = rotate90cw(cube.faces['L']);

  // Save U left column.
  let temp = [];
  for (let i = 0; i < n; i++) {
    temp.push(cube.faces['U'][i][0]);
  }

  // U left column <- reversed(B right column).
  let colB = [];
  for (let i = 0; i < n; i++) {
    let rowB = cube.faces['B'][i];
    colB.push(rowB[rowB.length - 1]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['U'][i][0] = colB[n - 1 - i];
  }

  // B right column <- reversed(D left column).
  let colD = [];
  for (let i = 0; i < n; i++) {
    colD.push(cube.faces['D'][i][0]);
  }
  for (let i = 0; i < n; i++) {
    let rowB = cube.faces['B'][i];
    rowB[rowB.length - 1] = colD[n - 1 - i];
  }

  // D left column <- F left column (normal order).
  let colF = [];
  for (let i = 0; i < n; i++) {
    colF.push(cube.faces['F'][i][0]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['D'][i][0] = colF[i];
  }

  // F left column <- temp (original U left column).
  for (let i = 0; i < n; i++) {
    cube.faces['F'][i][0] = temp[i];
  }
}

function move_L_prime(cube) {
  let n = cube.n;
  let temp = [];
  for (let i = 0; i < n; i++) {
    temp.push(cube.faces['U'][i][0]);
  }

  // U left column <- F left column.
  for (let i = 0; i < n; i++) {
    cube.faces['U'][i][0] = cube.faces['F'][i][0];
  }

  // F left column <- D left column.
  for (let i = 0; i < n; i++) {
    cube.faces['F'][i][0] = cube.faces['D'][i][0];
  }

  // D left column <- reversed(B right column).
  let colB = [];
  for (let i = 0; i < n; i++) {
    let rowB = cube.faces['B'][i];
    colB.push(rowB[rowB.length - 1]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['D'][i][0] = colB[n - 1 - i];
  }

  // B right column <- reversed(temp).
  for (let i = 0; i < n; i++) {
    let rowB = cube.faces['B'][i];
    rowB[rowB.length - 1] = temp[n - 1 - i];
  }

  cube.faces['L'] = rotate90ccw(cube.faces['L']);
}

function move_R(cube) {
  let n = cube.n;
  cube.faces['R'] = rotate90cw(cube.faces['R']);

  let temp = [];
  for (let i = 0; i < n; i++) {
    let rowU = cube.faces['U'][i];
    temp.push(rowU[rowU.length - 1]);
  }

  // U right column <- reversed(B left column).
  let colB = [];
  for (let i = 0; i < n; i++) {
    let rowB = cube.faces['B'][i];
    colB.push(rowB[0]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['U'][i][cube.faces['U'][i].length - 1] = colB[n - 1 - i];
  }

  // B left column <- reversed(D right column).
  let colD = [];
  for (let i = 0; i < n; i++) {
    let rowD = cube.faces['D'][i];
    colD.push(rowD[rowD.length - 1]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['B'][i][0] = colD[n - 1 - i];
  }

  // D right column <- F right column (normal order).
  let colF = [];
  for (let i = 0; i < n; i++) {
    let rowF = cube.faces['F'][i];
    colF.push(rowF[rowF.length - 1]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['D'][i][cube.faces['D'][i].length - 1] = colF[i];
  }

  // F right column <- temp (original U right column).
  for (let i = 0; i < n; i++) {
    cube.faces['F'][i][cube.faces['F'][i].length - 1] = temp[i];
  }
}

function move_R_prime(cube) {
  let n = cube.n;
  let temp = [];
  for (let i = 0; i < n; i++) {
    let rowU = cube.faces['U'][i];
    temp.push(rowU[rowU.length - 1]);
  }

  // U right column <- F right column.
  for (let i = 0; i < n; i++) {
    cube.faces['U'][i][cube.faces['U'][i].length - 1] = cube.faces['F'][i][cube.faces['F'][i].length - 1];
  }

  // F right column <- D right column.
  for (let i = 0; i < n; i++) {
    cube.faces['F'][i][cube.faces['F'][i].length - 1] = cube.faces['D'][i][cube.faces['D'][i].length - 1];
  }

  // D right column <- reversed(B left column).
  let colB = [];
  for (let i = 0; i < n; i++) {
    let rowB = cube.faces['B'][i];
    colB.push(rowB[0]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['D'][i][cube.faces['D'][i].length - 1] = colB[n - 1 - i];
  }

  // B left column <- reversed(temp).
  for (let i = 0; i < n; i++) {
    cube.faces['B'][i][0] = temp[n - 1 - i];
  }

  cube.faces['R'] = rotate90ccw(cube.faces['R']);
}

function move_F(cube) {
  let n = cube.n;
  cube.faces['F'] = rotate90cw(cube.faces['F']);

  let lastRowIndex = cube.faces['U'].length - 1;
  let temp = cube.faces['U'][lastRowIndex].slice(); // Save U bottom row.

  // U bottom row <- reversed(L right column).
  let colL = [];
  for (let i = 0; i < n; i++) {
    let rowL = cube.faces['L'][i];
    colL.push(rowL[rowL.length - 1]);
  }
  cube.faces['U'][lastRowIndex] = colL.slice().reverse();

  // L right column <- D top row (normal order).
  let tempD = cube.faces['D'][0].slice();
  for (let i = 0; i < n; i++) {
    cube.faces['L'][i][cube.faces['L'][i].length - 1] = tempD[i];
  }

  // D top row <- reversed(R left column).
  let colR = [];
  for (let i = 0; i < n; i++) {
    let rowR = cube.faces['R'][i];
    colR.push(rowR[0]);
  }
  cube.faces['D'][0] = colR.slice().reverse();

  // R left column <- temp (original U bottom row).
  for (let i = 0; i < n; i++) {
    cube.faces['R'][i][0] = temp[i];
  }
}

function move_F_prime(cube) {
  let n = cube.n;
  let lastRowIndex = cube.faces['U'].length - 1;
  let temp = cube.faces['U'][lastRowIndex].slice();

  // U bottom row <- R left column (normal order).
  for (let i = 0; i < n; i++) {
    cube.faces['U'][lastRowIndex][i] = cube.faces['R'][i][0];
  }

  // R left column <- reversed(D top row).
  let tempD = cube.faces['D'][0].slice();
  let reversedTempD = tempD.slice().reverse();
  for (let i = 0; i < n; i++) {
    cube.faces['R'][i][0] = reversedTempD[i];
  }

  // D top row <- L right column (normal order).
  let tempL = [];
  for (let i = 0; i < n; i++) {
    let rowL = cube.faces['L'][i];
    tempL.push(rowL[rowL.length - 1]);
  }
  cube.faces['D'][0] = tempL;

  // L right column <- reversed(temp) (original U bottom row).
  let reversedTemp = temp.slice().reverse();
  for (let i = 0; i < n; i++) {
    cube.faces['L'][i][cube.faces['L'][i].length - 1] = reversedTemp[i];
  }

  cube.faces['F'] = rotate90ccw(cube.faces['F']);
}

function move_B(cube) {
  let n = cube.n;
  cube.faces['B'] = rotate90cw(cube.faces['B']);

  let temp = cube.faces['U'][0].slice(); // Save U top row.

  // U top row <- reversed(R right column).
  let colR = [];
  for (let i = 0; i < n; i++) {
    let rowR = cube.faces['R'][i];
    colR.push(rowR[rowR.length - 1]);
  }
  cube.faces['U'][0] = colR.slice().reverse();

  // R right column <- D bottom row (normal order).
  let lastRowIndex = cube.faces['D'].length - 1;
  let tempD = cube.faces['D'][lastRowIndex].slice();
  for (let i = 0; i < n; i++) {
    cube.faces['R'][i][cube.faces['R'][i].length - 1] = tempD[i];
  }

  // D bottom row <- reversed(L left column).
  let colL = [];
  for (let i = 0; i < n; i++) {
    let rowL = cube.faces['L'][i];
    colL.push(rowL[0]);
  }
  cube.faces['D'][lastRowIndex] = colL.slice().reverse();

  // L left column <- temp (original U top row).
  for (let i = 0; i < n; i++) {
    cube.faces['L'][i][0] = temp[i];
  }
}

function move_B_prime(cube) {
  let n = cube.n;
  let temp = cube.faces['U'][0].slice();

  // U top row <- L left column (normal order).
  for (let i = 0; i < n; i++) {
    cube.faces['U'][0][i] = cube.faces['L'][i][0];
  }

  // L left column <- reversed(D bottom row).
  let lastRowIndex = cube.faces['D'].length - 1;
  let tempD = cube.faces['D'][lastRowIndex].slice();
  let reversedTempD = tempD.slice().reverse();
  for (let i = 0; i < n; i++) {
    cube.faces['L'][i][0] = reversedTempD[i];
  }

  // D bottom row <- R right column (normal order).
  let tempR = [];
  for (let i = 0; i < n; i++) {
    let rowR = cube.faces['R'][i];
    tempR.push(rowR[rowR.length - 1]);
  }
  cube.faces['D'][lastRowIndex] = tempR;

  // R right column <- reversed(temp) (original U top row).
  let reversedTemp = temp.slice().reverse();
  for (let i = 0; i < n; i++) {
    cube.faces['R'][i][cube.faces['R'][i].length - 1] = reversedTemp[i];
  }

  cube.faces['B'] = rotate90ccw(cube.faces['B']);
}

// ----- Wide (Slice) Moves for NxN -----
// For moves ending with "w", a parameter (default layers) indicates how many layers from that face are turned.

// Upper Wide Move (e.g., Uw or 3Uw for turning 2 or 3 top layers)
function move_Uw(cube, layers = 2) {
  let n = cube.n;
  // Rotate U face only once (outer layer)
  if (layers > 0) {
    cube.faces['U'] = rotate90cw(cube.faces['U']);
  }
  for (let i = 0; i < layers; i++) {
    let temp = cube.faces['F'][i].slice();
    cube.faces['F'][i] = cube.faces['R'][i];
    cube.faces['R'][i] = cube.faces['B'][i];
    cube.faces['B'][i] = cube.faces['L'][i];
    cube.faces['L'][i] = temp;
  }
}

function move_Uw_prime(cube, layers = 2) {
  let n = cube.n;
  for (let i = 0; i < layers; i++) {
    let temp = cube.faces['F'][i].slice();
    cube.faces['F'][i] = cube.faces['L'][i];
    cube.faces['L'][i] = cube.faces['B'][i];
    cube.faces['B'][i] = cube.faces['R'][i];
    cube.faces['R'][i] = temp;
  }
  if (layers > 0) {
    cube.faces['U'] = rotate90ccw(cube.faces['U']);
  }
}

// Down Wide Move (Dw)
function move_Dw(cube, layers = 2) {
  let n = cube.n;
  if (layers > 0) {
    cube.faces['D'] = rotate90cw(cube.faces['D']);
  }
  for (let i = 0; i < layers; i++) {
    let rowIndex = n - 1 - i;
    let temp = cube.faces['F'][rowIndex].slice();
    cube.faces['F'][rowIndex] = cube.faces['L'][rowIndex];
    cube.faces['L'][rowIndex] = cube.faces['B'][rowIndex];
    cube.faces['B'][rowIndex] = cube.faces['R'][rowIndex];
    cube.faces['R'][rowIndex] = temp;
  }
}

function move_Dw_prime(cube, layers = 2) {
  let n = cube.n;
  for (let i = 0; i < layers; i++) {
    let rowIndex = n - 1 - i;
    let temp = cube.faces['F'][rowIndex].slice();
    cube.faces['F'][rowIndex] = cube.faces['R'][rowIndex];
    cube.faces['R'][rowIndex] = cube.faces['B'][rowIndex];
    cube.faces['B'][rowIndex] = cube.faces['L'][rowIndex];
    cube.faces['L'][rowIndex] = temp;
  }
  if (layers > 0) {
    cube.faces['D'] = rotate90ccw(cube.faces['D']);
  }
}

// Left Wide Move (Lw)
function move_Lw(cube, layers = 2) {
  let n = cube.n;
  if (layers > 0) {
    cube.faces['L'] = rotate90cw(cube.faces['L']);
  }
  for (let j = 0; j < layers; j++) {
    let temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(cube.faces['U'][i][j]);
    }
    let colB = [];
    for (let i = 0; i < n; i++) {
      colB.push(cube.faces['B'][i][n - 1 - j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][j] = colB[n - 1 - i];
    }
    let colD = [];
    for (let i = 0; i < n; i++) {
      colD.push(cube.faces['D'][i][j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['B'][i][n - 1 - j] = colD[n - 1 - i];
    }
    let colF = [];
    for (let i = 0; i < n; i++) {
      colF.push(cube.faces['F'][i][j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][j] = colF[i];
    }
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][j] = temp[i];
    }
  }
}

function move_Lw_prime(cube, layers = 2) {
  let n = cube.n;
  for (let j = 0; j < layers; j++) {
    let temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(cube.faces['U'][i][j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][j] = cube.faces['F'][i][j];
    }
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][j] = cube.faces['D'][i][j];
    }
    let colB = [];
    for (let i = 0; i < n; i++) {
      colB.push(cube.faces['B'][i][n - 1 - j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][j] = colB[n - 1 - i];
    }
    for (let i = 0; i < n; i++) {
      cube.faces['B'][i][n - 1 - j] = temp[n - 1 - i];
    }
  }
  if (layers > 0) {
    cube.faces['L'] = rotate90ccw(cube.faces['L']);
  }
}

// Right Wide Move (Rw)
function move_Rw(cube, layers = 2) {
  let n = cube.n;
  if (layers > 0) {
    cube.faces['R'] = rotate90cw(cube.faces['R']);
  }
  for (let j = 0; j < layers; j++) {
    let colIndex = n - 1 - j;
    let temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(cube.faces['U'][i][colIndex]);
    }
    let colB = [];
    for (let i = 0; i < n; i++) {
      colB.push(cube.faces['B'][i][j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][colIndex] = colB[n - 1 - i];
    }
    let colD = [];
    for (let i = 0; i < n; i++) {
      colD.push(cube.faces['D'][i][colIndex]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['B'][i][j] = colD[n - 1 - i];
    }
    let colF = [];
    for (let i = 0; i < n; i++) {
      colF.push(cube.faces['F'][i][colIndex]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][colIndex] = colF[i];
    }
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][colIndex] = temp[i];
    }
  }
}

function move_Rw_prime(cube, layers = 2) {
  let n = cube.n;
  for (let j = 0; j < layers; j++) {
    let colIndex = n - 1 - j;
    let temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(cube.faces['U'][i][colIndex]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][colIndex] = cube.faces['F'][i][colIndex];
    }
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][colIndex] = cube.faces['D'][i][colIndex];
    }
    let colB = [];
    for (let i = 0; i < n; i++) {
      colB.push(cube.faces['B'][i][j]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][colIndex] = colB[n - 1 - i];
    }
    for (let i = 0; i < n; i++) {
      cube.faces['B'][i][j] = temp[n - 1 - i];
    }
  }
  if (layers > 0) {
    cube.faces['R'] = rotate90ccw(cube.faces['R']);
  }
}

// Front Wide Move (Fw)
function move_Fw(cube, layers = 2) {
  let n = cube.n;
  if (layers > 0) {
    cube.faces['F'] = rotate90cw(cube.faces['F']);
  }
  // For F, the affected rows on U and D shift,
  // while L and R contribute columns.
  let startU = n - layers;
  for (let j = 0; j < layers; j++) {
    let uIndex = startU + j;
    let temp = cube.faces['U'][uIndex].slice();
    // U row becomes reversed L's right column (offset by j)
    let colL = [];
    for (let i = 0; i < n; i++) {
      colL.push(cube.faces['L'][i][n - 1 - j]);
    }
    cube.faces['U'][uIndex] = colL.slice().reverse();
    // L's column becomes D's top row (offset by j)
    let dIndex = j;
    let tempD = cube.faces['D'][dIndex].slice();
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][n - 1 - j] = tempD[i];
    }
    // D's row becomes reversed R's left column (offset by j)
    let colR = [];
    for (let i = 0; i < n; i++) {
      colR.push(cube.faces['R'][i][j]);
    }
    cube.faces['D'][dIndex] = colR.slice().reverse();
    // R's column becomes temp (original U row)
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][j] = temp[i];
    }
  }
}

function move_Fw_prime(cube, layers = 2) {
  let n = cube.n;
  let startU = n - layers;
  for (let j = 0; j < layers; j++) {
    let uIndex = startU + j;
    let temp = cube.faces['U'][uIndex].slice();
    // U row <- R's left column
    let colR = [];
    for (let i = 0; i < n; i++) {
      colR.push(cube.faces['R'][i][j]);
    }
    cube.faces['U'][uIndex] = colR.slice();
    // R's left column <- D's top row (reversed)
    let dIndex = j;
    let tempD = cube.faces['D'][dIndex].slice();
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][j] = tempD.slice().reverse()[i];
    }
    // D's top row <- L's right column
    let colL = [];
    for (let i = 0; i < n; i++) {
      colL.push(cube.faces['L'][i][n - 1 - j]);
    }
    cube.faces['D'][dIndex] = colL.slice();
    // L's right column <- temp (reversed)
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][n - 1 - j] = temp.slice().reverse()[i];
    }
  }
  if (layers > 0) {
    cube.faces['F'] = rotate90ccw(cube.faces['F']);
  }
}

// Back Wide Move (Bw)
function move_Bw(cube, layers = 2) {
  let n = cube.n;
  if (layers > 0) {
    cube.faces['B'] = rotate90cw(cube.faces['B']);
  }
  // For B, the affected rows on U and D shift,
  // while R and L contribute columns.
  for (let j = 0; j < layers; j++) {
    let temp = cube.faces['U'][j].slice();
    // U row becomes reversed R's right column (offset by j)
    let colR = [];
    for (let i = 0; i < n; i++) {
      colR.push(cube.faces['R'][i][n - 1 - j]);
    }
    cube.faces['U'][j] = colR.slice().reverse();
    // R's column becomes D's bottom row (offset by j)
    let dIndex = n - 1 - j;
    let tempD = cube.faces['D'][dIndex].slice();
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][n - 1 - j] = tempD[i];
    }
    // D's row becomes reversed L's left column (offset by j)
    let colL = [];
    for (let i = 0; i < n; i++) {
      colL.push(cube.faces['L'][i][j]);
    }
    cube.faces['D'][dIndex] = colL.slice().reverse();
    // L's column becomes temp (original U row)
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][j] = temp[i];
    }
  }
}

function move_Bw_prime(cube, layers = 2) {
  let n = cube.n;
  for (let j = 0; j < layers; j++) {
    let temp = cube.faces['U'][j].slice();
    // U row <- L's left column
    let colL = [];
    for (let i = 0; i < n; i++) {
      colL.push(cube.faces['L'][i][j]);
    }
    cube.faces['U'][j] = colL.slice();
    // L's left column <- D's bottom row (reversed)
    let dIndex = n - 1 - j;
    let tempD = cube.faces['D'][dIndex].slice();
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][j] = tempD.slice().reverse()[i];
    }
    // D's bottom row <- R's right column
    let colR = [];
    for (let i = 0; i < n; i++) {
      colR.push(cube.faces['R'][i][n - 1 - j]);
    }
    cube.faces['D'][dIndex] = colR.slice();
    // R's right column <- temp (reversed)
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][n - 1 - j] = temp.slice().reverse()[i];
    }
  }
  if (layers > 0) {
    cube.faces['B'] = rotate90ccw(cube.faces['B']);
  }
}

// ----- Middle Layer Moves -----
// For odd-sized cubes only (n odd), the middle slice is at index m = floor(n/2).

// M move: vertical middle slice (parallel to L & R)
// Convention: M move rotates like an L' move on the middle slice.
function move_M(cube) {
  let n = cube.n;
  let m = Math.floor(n / 2);
  let temp = [];
  for (let i = 0; i < n; i++) {
    temp.push(cube.faces['U'][i][m]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['U'][i][m] = cube.faces['F'][i][m];
  }
  for (let i = 0; i < n; i++) {
    cube.faces['F'][i][m] = cube.faces['D'][i][m];
  }
  let colB = [];
  for (let i = 0; i < n; i++) {
    colB.push(cube.faces['B'][i][m]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['D'][i][m] = colB[n - 1 - i];
  }
  for (let i = 0; i < n; i++) {
    cube.faces['B'][i][m] = temp[n - 1 - i];
  }
}

function move_M_prime(cube) {
  let n = cube.n;
  let m = Math.floor(n / 2);
  let temp = [];
  for (let i = 0; i < n; i++) {
    temp.push(cube.faces['U'][i][m]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['U'][i][m] = cube.faces['B'][n - 1 - i][m];
  }
  let colB = [];
  for (let i = 0; i < n; i++) {
    colB.push(cube.faces['B'][i][m]);
  }
  for (let i = 0; i < n; i++) {
    cube.faces['B'][i][m] = cube.faces['D'][n - 1 - i][m];
  }
  for (let i = 0; i < n; i++) {
    cube.faces['D'][i][m] = cube.faces['F'][i][m];
  }
  for (let i = 0; i < n; i++) {
    cube.faces['F'][i][m] = temp[i];
  }
}

// E move: equatorial slice (parallel to U & D)
// Convention: cycle the middle row of F, R, B, L.
function move_E(cube) {
  let n = cube.n;
  let m = Math.floor(n / 2);
  let temp = cube.faces['F'][m].slice();
  cube.faces['F'][m] = cube.faces['R'][m];
  cube.faces['R'][m] = cube.faces['B'][m];
  cube.faces['B'][m] = cube.faces['L'][m];
  cube.faces['L'][m] = temp;
}

function move_E_prime(cube) {
  let n = cube.n;
  let m = Math.floor(n / 2);
  let temp = cube.faces['F'][m].slice();
  cube.faces['F'][m] = cube.faces['L'][m];
  cube.faces['L'][m] = cube.faces['B'][m];
  cube.faces['B'][m] = cube.faces['R'][m];
  cube.faces['R'][m] = temp;
}

// S move: standing slice (parallel to F & B)
// Convention: treat the middle slice like a F move.
function move_S(cube) {
  let n = cube.n;
  let m = Math.floor(n / 2);
  let temp = [];
  for (let i = 0; i < n; i++) {
    temp.push(cube.faces['U'][m][i]);
  }
  let colL = [];
  for (let i = 0; i < n; i++) {
    colL.push(cube.faces['L'][i][m]);
  }
  cube.faces['U'][m] = colL.slice().reverse();
  let dRow = cube.faces['D'][m].slice();
  for (let i = 0; i < n; i++) {
    cube.faces['L'][i][m] = dRow[i];
  }
  let colR = [];
  for (let i = 0; i < n; i++) {
    colR.push(cube.faces['R'][i][m]);
  }
  cube.faces['D'][m] = colR.slice().reverse();
  for (let i = 0; i < n; i++) {
    cube.faces['R'][i][m] = temp[i];
  }
}

function move_S_prime(cube) {
  let n = cube.n;
  let m = Math.floor(n / 2);
  let temp = [];
  for (let i = 0; i < n; i++) {
    temp.push(cube.faces['U'][m][i]);
  }
  let colR = [];
  for (let i = 0; i < n; i++) {
    colR.push(cube.faces['R'][i][m]);
  }
  cube.faces['U'][m] = colR.slice();
  let dRow = cube.faces['D'][m].slice();
  for (let i = 0; i < n; i++) {
    cube.faces['R'][i][m] = dRow.slice().reverse()[i];
  }
  let colL = [];
  for (let i = 0; i < n; i++) {
    colL.push(cube.faces['L'][i][m]);
  }
  cube.faces['D'][m] = colL.slice();
  for (let i = 0; i < n; i++) {
    cube.faces['L'][i][m] = temp[i];
  }
}

// ----- Double Turn Moves -----

function move_U2(cube) {
  move_U(cube);
  move_U(cube);
}

function move_D2(cube) {
  move_D(cube);
  move_D(cube);
}

function move_L2(cube) {
  move_L(cube);
  move_L(cube);
}

function move_R2(cube) {
  move_R(cube);
  move_R(cube);
}

function move_F2(cube) {
  move_F(cube);
  move_F(cube);
}

function move_B2(cube) {
  move_B(cube);
  move_B(cube);
}

// // ----- Driver Code Example -----
// const cube = new RubiksCube(3);
// console.log(cube.toString());
// console.log("Is solved?", cube.isSolved());

// // Try some moves:
// move_Uw(cube, 2);
// console.log("\nAfter Uw move:");
// console.log(cube.toString());

// move_Uw_prime(cube, 2);
// console.log("\nAfter Uw' move:");
// console.log(cube.toString());

// move_Fw(cube, 2);
// console.log("\nAfter Fw move:");
// console.log(cube.toString());

// move_M(cube);
// console.log("\nAfter M move (middle slice):");
// console.log(cube.toString());


module.exports = {
  RubiksCube,
  move_U,
  move_U_prime,
  move_U2,
  move_Uw,
  move_Uw_prime,
  move_D,
  move_D_prime,
  move_D2,
  move_Dw,
  move_Dw_prime,
  move_L,
  move_L_prime,
  move_L2,
  move_Lw,
  move_Lw_prime,
  move_R,
  move_R_prime,
  move_R2,
  move_Rw,
  move_Rw_prime,
  move_F,
  move_F_prime,
  move_F2,
  move_Fw,
  move_Fw_prime,
  move_B,
  move_B_prime,
  move_B2,
  move_Bw,
  move_Bw_prime,
  move_E,
  move_E_prime,
  move_M,
  move_M_prime,
  move_S,
  move_S_prime
};