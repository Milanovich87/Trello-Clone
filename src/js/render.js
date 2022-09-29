// Render
import { containerElement, contElement, doneElement } from './app.js'
import { buildToDoTemplate } from './buildtodoTemplate.js'
import { countTasks } from './count.js'
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
export { render }
