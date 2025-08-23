const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()   
    }


const tempClient = {
    nome: 'Silvia',
    email: 'silvia@gmail.com',
    celular: "(71) 91234-5678",
    cidade: "Salvador"
}

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

//Validação dos Campos
const isValiddFields = () => {
    //Retorna verdadeiro se todos os requisitos forem true
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}

//Interação com o layout
const saveClient = () => {
    if(isValiddFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email:document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
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