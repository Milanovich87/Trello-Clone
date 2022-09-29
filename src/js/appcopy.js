import { $ } from './helpers.js'

data = getData()

const formElement = document.querySelector('#form')
const inputContentTitleElement = document.querySelector('.content__title')
const inputContentTextElement = document.querySelector('.content__text')
const containerElement = document.querySelector('#list')
const buttonClearElement = document.querySelector('#buttonClear')
const toDoTemplateEditElement = document.querySelector('#toDoTemplateEdit')
const UserNameElement = document.querySelector('#userName')
const toDoTemplateElement = document.querySelector('#toDoTemplate')
const contElement = document.querySelector('#listProg')
const doneElement = document.querySelector('#done')
const listElement = document.querySelector('.users')
const addtoDoTemplateEditElement = document.querySelector('#btn')
const countTodo = document.getElementById('countTodo')
const countInProgress = document.getElementById('countInProgress')
const countDone = document.getElementById('countDone')
const closeWarningElement = document.querySelector('#closeWarning')
const warningElement = document.querySelector('.warning__count')
const warningDeleteAllTasks = document.querySelector('.warning__delete')
const buttonConfirmWarningElement = document.querySelector('#btnConfirm')
const buttonCanselWarningElement = document.querySelector('#btnCancel')
const listEditElement = document.querySelector('.users__edit')
const UserNameEditElement = document.querySelector('#userNameEdit')
const EditCardElement = document.querySelector('#toDoTemplateEdit2')
const EditInputElement = document.querySelector('.content__title.edit')
const EditHiddenElement = document.querySelector('.title-hidden')
const EditTextareaElement = document.querySelector('.text-textarea.edit')
const EditFormElement = document.querySelector('.todo__edit')
const EditSelectElement = document.querySelector('.form-select.edit')
const btnCloseEditElement = document.querySelector('#cancelEdit')

// счетчик карточек

function countTasks(array) {
  let counterTodo
  let counterProgress
  let counterDone

  counterTodo = array.filter((item) => item.status == 'todo').length
  counterProgress = array.filter((item) => item.status == 'inProgress').length
  counterDone = array.filter((item) => item.status == 'done').length

  countTodo.innerHTML = counterTodo
  countInProgress.innerHTML = counterProgress
  countDone.innerHTML = counterDone
}

// Строим редактируемую карточку

function handleAddForm() {
  toDoTemplateEditElement.style.display = 'block'
}

// закрыть редактируемую карточку

function handleCloseForm() {
  const closetoDoTemplateEditElement = document.querySelector('#cancel')
  closetoDoTemplateEditElement.addEventListener('click', () => {
    inputContentTitleElement.value = ''
    inputContentTextElement.value = ''
    toDoTemplateEditElement.style.display = 'none'
  })
}
handleCloseForm()

// Event listeners -----------------------------------------------------------

function handleSubmitForm(event) {
  event.preventDefault()
  const contentTitle = inputContentTitleElement.value
  const contentText = inputContentTextElement.value
  const contentUserName = UserNameElement.value
  const createAt = new Date()

  const toDo = {
    contentTitle,
    contentText,
    contentUserName,
    createAt,
    status: 'todo',
    id: createAt.getTime()
  }

  data.push(toDo)
  formElement.reset()
  countTasks(data)
  toDoTemplateEditElement.style.display = 'none'
  render(data)
}

function handleClickButtonRemove(event) {
  const target = event.target
  const role = target.dataset.role

  if (role != 'remove') return

  const id = target.closest('.todo')?.id

  const toDo = data.find((item) => item.id == id)
  const index = data.indexOf(toDo)
  data.splice(index, 1)
  countTasks(data)
  render(data)
}

function handleBeforeUnload() {
  localStorage.setItem('data', JSON.stringify(data))
}

function handlePageLoad() {
  countTasks(data)
  render(data)
}

// Строим карточки
function buildToDoTemplate(toDo) {
  const date = toDo.createAt.getHours() + ':' + toDo.createAt.getMinutes()
  let template = toDoTemplateElement.innerHTML
  const payload = {
    ...toDo,
    date
  }
  for (const key in payload) {
    template = template.replaceAll(`{{${key}}}`, payload[key])
  }
  //  меняем цвет карточек
  if (payload.status == 'inProgress') {
    template = template.replaceAll('{{inProgress}}', 'status').replaceAll('{{color}}', 'inProgress')
  }

  if (payload.status == 'done') {
    template = template.replaceAll('{{done}}', 'status').replaceAll('{{color}}', 'done')
  }
  return template
}

// Render

function render(data) {
  let html = ''
  let htmlTodo = ''
  let htmlInProgress = ''
  let htmlDone = ''
  data.forEach((item) => {
    const template = buildToDoTemplate(item)
    html = html + template
    if (item.status == 'todo') {
      htmlTodo = htmlTodo + template
    } else if (item.status == 'inProgress') {
      htmlInProgress = htmlInProgress + template
    } else if (item.status == 'done') {
      htmlDone = htmlDone + template
    }
  })
  countTasks(data)
  containerElement.innerHTML = html
  containerElement.innerHTML = htmlTodo
  contElement.innerHTML = htmlInProgress
  doneElement.innerHTML = htmlDone
}

function getData() {
  const dataStorage = localStorage.getItem('data')
  const data = dataStorage ? JSON.parse(dataStorage) : []
  data.forEach(function (item) {
    item.createAt = new Date(item.createAt)
  })
  return data
}

// ПЕРЕНОС КАРТОЧЕК

function handleSelectTodo(event) {
  const target = event.target
  const role = target.dataset.role
  if (role != 'status') return
  const status = target.value

  const id = target.closest('.todo')?.id
  const toDo = data.find((item) => item.id == id)
  toDo.status = status
  if (target.value == 'inProgress' && (countInProgress.innerHTML >= '3')) {
    handleWarningShow()
    toDo.status = target.value
  } else {
    toDo.status = target.value
  }
  countTasks(data)
  render(data)
}

// WARNING

function handleWarningShow() {
  warningElement.classList.toggle('show')
}

// Warning delete All

// вызываем карточку warning-delete
function handleDeleteAllTasks() {
  if (countDone.innerHTML == 0) return

  warningDeleteAllTasks.classList.toggle('show')
}

// закрываем карточку warning-delete
function handleCLoseTasksDelete() {
  warningDeleteAllTasks.classList.toggle('show')
}
// удаляем все tasks
function handleConfirmDeleteALLTasks() {
  data = data.filter(item => item.status != 'done')

  render(data)

  handleCLoseTasksDelete()
}

// UserName select

function printTodos(data) {
  data.forEach(({ name }) => {
    const listHTML = `
            <option>${name}</option>
        `
    UserNameElement.insertAdjacentHTML('beforeend', listHTML)
    listElement.append(UserNameElement)
    UserNameEditElement.insertAdjacentHTML('beforeend', listHTML)
    listEditElement.append(UserNameEditElement)
  })
}

function getTodos(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.response)
        resolve(data)
      } else {
        reject(`Ошибка ${xhr.status}`)
      }
    }
    xhr.onerror = function (event) {
      reject('Что-то пошло не так!')
    }

    xhr.send()
  })
}
getTodos('https://jsonplaceholder.typicode.com/users')
  .then((data) => printTodos(data))
  .catch((error) => console.error(error))

// Редактирование карточек

function handleOpenCloseEditPopup() {
  EditCardElement.classList.toggle('show')
}

function handleCardEdit(event) {
  const target = event.target

  const on = target.classList.contains('card-edit')

  if (on != true) return

  const id = target.closest('.todo')?.id
  const toDo = data.find((item) => item.id == id)

  EditInputElement.setAttribute('value', toDo.contentTitle)
  EditTextareaElement.setAttribute('value', toDo.contentText)
  EditSelectElement.setAttribute('value', toDo.contentUserName)
  EditHiddenElement.setAttribute('value', toDo.id)
  EditTextareaElement.innerHTML = toDo.contentText

  handleOpenCloseEditPopup()
}

function handleSubmitEditForm(event) {
  event.preventDefault()

  const id = EditHiddenElement.getAttribute('value')

  const toDo = data.find((item) => item.id == id)
  const index = data.indexOf(toDo)

  const ToDoEdit = {
    ...toDo
  }

  ToDoEdit.contentTitle = EditInputElement.value
  ToDoEdit.contentText = EditTextareaElement.value
  ToDoEdit.contentUserName = EditSelectElement.value

  data.splice(index, 1, ToDoEdit)

  EditFormElement.reset()

  handleOpenCloseEditPopup()

  render(data)
}

// Add event listeners

addtoDoTemplateEditElement.addEventListener('click', handleAddForm)
buttonCanselWarningElement.addEventListener('click', handleCLoseTasksDelete)
buttonConfirmWarningElement.addEventListener('click', handleConfirmDeleteALLTasks)
buttonClearElement.addEventListener('click', handleDeleteAllTasks)
closeWarningElement.addEventListener('click', handleWarningShow)
formElement.addEventListener('submit', handleSubmitForm)
document.addEventListener('click', handleClickButtonRemove)
window.addEventListener('beforeunload', handleBeforeUnload)
document.addEventListener('DOMContentLoaded', handlePageLoad)
document.addEventListener('change', handleSelectTodo)
document.addEventListener('click', handleCardEdit)
EditFormElement.addEventListener('submit', handleSubmitEditForm)
btnCloseEditElement.addEventListener('click', handleOpenCloseEditPopup)
