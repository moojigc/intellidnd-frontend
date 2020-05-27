const Table = require('./Table');
const bcrypt = require('bcryptjs');

async function crypt(pass) { 
    return await new Promise((resolve, reject) => {
        bcrypt.hash(pass, 10, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    });
}

class User extends Table {
    constructor(params) {
        const { email, username, password, id, characterName, characterId } = params;
        super({
            id: id,
            collection: 'users'
        })
        this.email = email;
        this.username = username;
        this.password = password;
        this.characters = [
            {
                characterName: characterName,
                characterId: characterId
            }
        ]
    }
    async checkUsernameTaken() {
        let res = await this.find({ username: this.username });
        if (res) {
            this._id = res._id;
            this.password = res.password;
            return res;
        } 
        else return false;
    }
    async registerUser() {
        this.password = await crypt(this.password);
        return await this.dbInsert();
    }
    async addCharacterId(id) {
        return await this.dbCustomUpdate({ $push: { characterId: id } })
    }
}

module.exports = User;