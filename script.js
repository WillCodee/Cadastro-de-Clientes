
const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()   
    }


const inputNome = document.getElementById('nome')
const inputEmail = document.getElementById('email')
const inputCelular = document.getElementById('celular')
const inputCidade = document.getElementById('cidade')

// Ler o q está no localStorage transforma em jason e envia pro db_client
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) || [] 
//Mostra o que tem no db_client
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

// CRUD => CREATE - READ - UPDATE - DELETE


//Create
const createCliente = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client) //Vai acrescentar mais um
    setLocalStorage(dbClient)
}

//Read
const readClient = () => getLocalStorage()

//Update
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

//Delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index,1)
    setLocalStorage(dbClient)
}

//Campo Cria Erro
const criaErro = (campo,msg) => {
    const div = document.createElement('div')
    div.innerText = msg
    div.classList.add('error-text')
    campo.insertAdjacentElement('afterend',div)
}

function limparErros(){
    const divs = document.querySelectorAll('.error-text')
    divs.forEach(div => div.remove())
}

const validaName = (nome) =>{
    const regexName = new RegExp(
        /[a-zA-Z\s]+$/
    )

    if(regexName.test(nome)){
        return true
    }
    return false
}

const validaEmail = (email) => {
    const regexEmail = new RegExp(
        //usuario12@host.com.br
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
    )

    if(regexEmail.test(email)){
        return true
    }
    return false
}


const validaCidade = (cidade) =>{
    const regexCidade = new RegExp(
        /[a-zA-Z\s]+$/
    )

    if(regexCidade.test(cidade)){
        return true
    }
    return false
}

const validaCelular = (celular) =>{
    const regexCelular = /^\(?[1-9]{2}\)? ?9?[0-9]{4}-?[0-9]{4}$/

    if(regexCelular.test(celular)){
        return true
    }
    return false
}

//Validação dos Campos
const isValideFields = () => {
    limparErros()
    let valid = true

    if(inputNome.value === ""){
        criaErro(inputNome,'Campo nome não pode está em branco')
        valid = false
    }else if(!validaName(inputNome.value)){
        criaErro(inputNome,'Informe o nome corretamente')
        valid = false
    }
        
    if(inputEmail.value === ''){
        criaErro(inputEmail,'Campo email não pode está em branco')
        valid = false
    }else if(!validaEmail(inputEmail.value)){
        criaErro(inputEmail,'Informe o email corretamente')
        valid = false
    }

    if(inputCelular.value === ''){
        criaErro(inputCelular,'Campo celular não pode está em branco')
        valid = false
    }else if(!validaCelular(inputCelular.value)){
        criaErro(inputCelular,'Informe o Celular corretamente')
        valid = false
    }

    if(inputCidade.value === ''){
        criaErro(inputCidade,'Campo Cidade não pode está em branco')
        valid = false
    }else if(!validaCidade(inputCidade.value)){
        criaErro(inputCidade,'Informe a Cidade corretamente')
        valid = false
    }

    return valid
    }
    

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
    limparErros()
}

//Interação com o layout
const saveClient = () => {
    if(isValideFields()){
        const client = {
            nome: inputNome.value,
            email: inputEmail.value,
            celular: inputCelular.value,
            cidade: inputCidade.value
        }
        //Diferenciar o salvar de Editar do de cadastrar
        const index = document.getElementById('nome').dataset.index 
        if(index == 'new'){
            createCliente(client)
            updateTable()
            closeModal()
        }else{
            updateClient(index,client)
            updateTable()
            closeModal()
        }
        
    }
}

const createRow = (client,index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
            <td>${client.email}</td>
            <td>${client.celular}</td>
             <td>${client.cidade}</td>
                <td>
                <button type="button" class="button green" id="edit-${index}">Editar</button>
                <button type="button" class="button red" id="delete-${index}">Excluir</button>
                </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row) )
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields= (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const actionClient = (event) => {
    if(event.target.type == 'button'){
       const [action,index] = event.target.id.split("-")
       
       if(action == 'edit'){
            editClient(index)
       }else{
        const client = readClient()[index]
            const response  = confirm(`Deseja realmente excluir o cliente ${client.nome}?`)
            if(response){
                deleteClient(index)
                updateTable()
            }
       }
    }
}

updateTable()

//Evento
document.getElementById('cadastrarCliente').addEventListener('click',openModal)

document.getElementById('modalClose').addEventListener('click',closeModal)

document.getElementById('salvar').addEventListener('click',saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click',actionClient)