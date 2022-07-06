const fs = require("fs");
const mongoose = require("mongoose");

class FileHandler {
  // file path of refresh tokens
  static filePath = "./refreshTokens.json";

  // get a specific token
  getRefreshToken(id) {
    const tokens = JSON.parse(fs.readFileSync(FileHandler.filePath));
    const token = tokens.filter((token) => (token.id = id));
    return token.length > 0 ? token[0] : null;
  }

  // set refresh token
  setRefreshToken(id, token) {
    const tokens = JSON.parse(fs.readFileSync(FileHandler.filePath));
    let index = this._indexOfToken(id, tokens);
    if (index !== null) {
      tokens[index].token = token;
    } else {
      tokens.push({ id, token });
    }
    let data = JSON.stringify(tokens);
    fs.writeFileSync(FileHandler.filePath, data);
  }

  // remove refresh token
  removeRefreshToken(id) {
    const tokens = JSON.parse(fs.readFileSync(FileHandler.filePath));
    let index = this._indexOfToken(id, tokens);
    tokens.splice(index, 1);
    fs.writeFileSync(FileHandler.filePath, JSON.stringify(tokens));
  }

  // return index of a token based on its id
  _indexOfToken(ido, tokens) {
    let idx = null;
    let id = mongoose.Types.ObjectId(ido).toString();
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].id === id) {
        idx = i;
        break;
      }
    }
    return idx;
  }
}

exports.FileHandler = FileHandler;
