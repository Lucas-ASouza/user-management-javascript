class User {

    constructor (name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get id(){
        return this._id;
    }

    get register() {
        return this._register;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    set photo(value) {
        this._photo = value;
    }

    loadFromJSON(json){

        for (let name in json){

            switch(name){

                case '_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    this[name] = json[name];    
            }
        }

    }

    getNewId(){
        
        let usersID = parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0) usersID = 0;
        
        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;

    }

    static getUsersStorage(){
        
        let users = [];

        if(localStorage.getItem("users")){
        //veririficar se já existe um array, para não criar outro    

            users = JSON.parse(localStorage.getItem("users"));

        }
        return users;  


    }
    
    save(){

        let users = User.getUsersStorage();

        if (this.id >0) {
            //caso ID já exista, trata-se de uma edição de um usuário já existente
           
            users.map(u=>{

                if (u._id == this.id){

                    Object.assign(u, this);
                    //manter o que está igual do this, sobrescrever o diferente
                }

                return u;

            });


        } else {
            //Id inexistente, inserindo usuário novo
            this._id = this.getNewId();

            users.push(this);

        
        }
        localStorage.setItem("users", JSON.stringify(users));
        //sessionStorage.setItem("users", JSON.stringify(users));
            //primeiro parâmetro = nome(chave) do segundo parâmetro
            //segundo parâmetro = valor do parâmetro
    }

    removeUser(){

        let users = User.getUsersStorage();

        users.forEach((userData, index)=>{

            if (this._id == userData._id){

                users.splice(index, 1);

            }

        });

        localStorage.setItem("users", JSON.stringify(users));

    }

}