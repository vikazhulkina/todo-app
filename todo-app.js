(function() {
    let listArr = [],
        listName = ''

    // заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title
        return appTitle
    }

    // форма для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form')
        let input = document.createElement('input')
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3')
        input.classList.add('form-control')
        input.placeholder = 'Введите название нового дела'
        buttonWrapper.classList.add('input-group-append')
        button.classList.add('btn', 'btn-primary')
        button.textContent = 'Добавить дело'
        button.disabled = true

        buttonWrapper.append(button)
        form.append(input)
        form.append(buttonWrapper)


        input.addEventListener('input', function (e) {
            e.preventDefault()
            if (input.value.trim() !== '') {
                button.disabled = false
            } else {
                button.disabled = true
            }
        })

        return {
            form,
            input,
            button
        }
    }

    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul')
        list.classList.add('list-group')
        return list
    }

    function createTodoItem(object) {
        let item = document.createElement('li')

        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div')
        let doneButton = document.createElement('button')
        let deleteButton = document.createElement('button')

        // устанавливаем стили для элемента списка и размещения кнопок
        // в его правой части с помощью flex

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
        item.textContent = object.name

        buttonGroup.classList.add('btn-group', 'btn-group-sm')
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'

        if (object.done === true) item.classList.add('list-group-item-success')

         // добавляем обработчики на кнопки
         doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success')
            for (let item of listArr) {
                if (item.id === object.id) item.done = !item.done
            }
            saveList(listArr, listName)

        })

        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove()
                for (let i=0; i<listArr.length; i++) {
                    if (listArr[i].id === object.id) listArr.splice(i,1)
                 }
            saveList(listArr, listName)
            }

        })

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton, deleteButton)
        item.append(buttonGroup)

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton
        }

    }

    function getID(arr) {
        let max = 0
        for (const item of arr) {
            if (item.id > max) max = item.id
        }

        return max + 1
    }

    function saveList(arr, key) {
        localStorage.setItem(key, JSON.stringify(arr))
    }

    function createTodoApp(container, title, key) {

        let todoAppTitle = createAppTitle(title)
        let todoItemForm = createTodoItemForm()
        let todoList = createTodoList()

        listName = key

        container.append(todoAppTitle)
        container.append(todoItemForm.form)
        container.append(todoList)

        let localData = localStorage.getItem(listName)

        if(localData !== null && localData !== '') listArr = JSON.parse(localData)


        for (let listItem of listArr) {
            let todoItem = createTodoItem(listItem)
            todoList.append(todoItem.item)
        }

        // браузер создаёт событие submit на форме по нажатию enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault()

            // игнорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return
            }

            let newItem = {
                id: getID(listArr),
                name: todoItemForm.input.value,
                done: false
            }

            let todoItem = createTodoItem(newItem)

            listArr.push(newItem)

            saveList(listArr, listName)

            // создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item)
            todoItemForm.button.disabled = true

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = ''
        })
    }

   window.createTodoApp = createTodoApp
})()





