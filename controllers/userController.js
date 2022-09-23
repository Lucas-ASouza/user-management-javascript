class UserController {

    constructor (formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event =>{

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];
            
            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);
            //substituir os valores antigos(user old) com os valores digitados novos

        this.getPhoto(this.formUpdateEl).then(
            (content)=>{

                if (!values.photo) {
                    result._photo = userOld._photo;
                    //se a foto nova for inexistente, logo ela é igual a antiga
                } else{
                    result._photo = content;
                    // se a foto nova existir e for diferente, setar ela
                }

                let user = new User();

                user.loadFromJSON(result);

                user.save();

                this.getTr(user, tr);
    
                this.updateCount();

                this.formUpdateEl.reset();

                btn.disabled = false;
                //habilita novamento o botão submit

                this.showPanelCreate();

           },
           (e)=>{
               console.error(e);
           }
       );       

        })

    }

    onSubmit(){

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;
            // desabilita o botão submit enquanto processa a informação

            let values = this.getValues(this.formEl);


            if (!values) return false;
            //caso formulário tenha sido enviado incompleto ou de forma incorreta, não continuar com o código dessem metódo


            this.getPhoto(this.formEl).then(
                 (content)=>{

                    values.photo = content;

                    values.save();

                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;
                    //habilita novamento o botão submit

                },
                (e)=>{
                    console.error(e);
                }
            );       
        });

    }

    getPhoto(formEl){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {
    
                if (item.name === 'photo') {
                    return item;
                }
    
            });
    
            let file = elements[0].files[0];
    
            fileReader.onload = () => {
    
                resolve(fileReader.result);
    
            };

            fileReader.oneerror = ()=>{

                reject(e)

            }
    
            if (file) {
                fileReader.readAsDataURL(file);
            } else{
                resolve('dist/img/boxed-bg.jpg');
            }

        });

    }

    getValues(formEl){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index){

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                //verificar se os campos names, email e password estão vazios

                field.parentElement.classList.add('has-error');
                isValid = false;

            }
            if (field.name === "gender") {
    
                if (field.checked) {
                    user[field.name] = field.value
                }
    
            } else if(field.name == "admin"){
            
                user[field.name] = field.checked;
            
            } else {
    
                user[field.name] = field.value;
    
            }
    
        });
        if (!isValid){

            return false;
        }
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }

    selectAll(){

        let users = User.getUsersStorage();

        users.forEach(dataUser =>{

            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(user);

        });

    }


    addLine(dataUser) {

        let tr = this.getTr(dataUser)

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    getTr(dataUser, tr = null){

        if (tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src=${dataUser.photo} class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        return tr

    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e=>{
        
            if (confirm("deseja realmente excluir esse usuário?")) {

                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user));

                user.removeUser();

                tr.remove();

                this.updateCount();

            }

        });    

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = (JSON.parse(tr.dataset.user));
            //let form = document.querySelector("#form-user-update");

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            //salva em index do formulário

            for (let name in json){

                let field = this.formUpdateEl.querySelector("[name=" +name.replace("_", "")+ "]");

                if(field){
                    
                    switch (field.type) {
                        case 'file':
                        continue; //para não trazer a foto para o campo de edição
                        break;
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" +name.replace("_", "")+ "][value="+ json[name] + "]");
                            field.checked = true;    
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                   }

                    field.value = json[name];
                    //register da classe não contem Value.    
                }

            }
            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();

        });

    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            // '...' = SPREAD. Transforma coleção em array, só assim podemos usar forEach
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;

        })
        
        
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }

}