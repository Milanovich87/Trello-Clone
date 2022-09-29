// удаляем выбранную todo
import { countTasks } from './count.js'
import { render } from './render.js'
import { data } from './app.js'
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

export { handleClickButtonRemove }
