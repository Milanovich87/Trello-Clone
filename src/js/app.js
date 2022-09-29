import { $ } from './helpers.js'

import { countTasks } from './count.js'
import { handleSubmitForm } from './buildtodoTemplate.js'
import { render } from './render.js'
import { handleWarningShow } from './handleWarningShow.js'
import { handleClickButtonRemove } from './handleClickButtonRemove.js'
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
export {
  countTodo, countInProgress, countDone, toDoTemplateElement,
  inputContentTitleElement,
  inputContentTextElement,
  UserNameElement,
  data,
  formElement,
  toDoTemplateEditElement, containerElement, contElement, doneElement,
  warningElement,
  listElement, UserNameEditElement, listEditElement
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

function handleBeforeUnload() {
  localStorage.setItem('data', JSON.stringify(data))
}

function handlePageLoad() {
  countTasks(data)
  render(data)
}

function getData() {
  const dataStorage = localStorage.getItem('data')
  const data = dataStorage ? JSON.parse(dataStorage) : []
  data.forEach(function (item) {
    item.createAt = new Date(item.createAt)
  })
  return data
}

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

// ПЕРЕНОС КАРТОЧЕК

function handleSelectTodo(event) {
  const target = event.target
  const role = target.dataset.role
  if (role != 'status') return
  const status = target.value

  const id = target.closest('.todo')?.id
  const toDo = data.find((item) => item.id == id)
  toDo.status = status
  if (target.value == 'inProgress' && (countInProgress.innerHTML >= '6')) {
    handleWarningShow()
    toDo.status = target.value
  } else {
    toDo.status = target.value
  }
  countTasks(data)
  render(data)
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
