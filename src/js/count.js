// счетчик карточек
import { countTodo, countInProgress, countDone } from './app.js'
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

export { countTasks }
