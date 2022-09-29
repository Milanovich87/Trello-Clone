// Строим карточки
import {
  toDoTemplateElement,
  inputContentTitleElement,
  inputContentTextElement,
  UserNameElement,
  data,
  formElement,
  toDoTemplateEditElement
} from './app.js'
import { countTasks } from './count.js'
import { render } from './render.js'
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

// Создаем Todo
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
export { buildToDoTemplate, handleSubmitForm }
