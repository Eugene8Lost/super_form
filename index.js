let name = document.querySelector('#name'),
    secondName = document.querySelector('#secondName'),
    email = document.querySelector("#email"),
    age = document.querySelector('#age'),
    job = document.querySelector('#job'),
    btn = document.querySelector('.btn'),
    users = document.querySelector('.users'),
    clear = document.querySelector('.clear')

// Объект для localStorage
// Объект, содержащий ключ (почта): значение (еще объект(имя:значение, фамилия: значение, почта:значение))
let storage = JSON.parse(localStorage.getItem('users')) || {}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
            console.log("Карта USERS обновилась")
            setListeners()
        }
    })
})

observer.observe(users, {
    childList: true
})

btn.addEventListener('click', getData)
clear.addEventListener('click', clearLocalStorage)

function getData(e) {
    e.preventDefault()
    const data = {}

    for (let key in storage) {
        if (email.value !== storage[key]['email'] &&
        name.value === storage[key]['name'] && 
        secondName.value === storage[key]['secondName']) {
            const outer = document.querySelector(`[data-out="${key}"]`).closest('.user')
            delete storage[key]
            localStorage.setItem('users', JSON.stringify(storage))
            outer.remove()
        }
    }
    
    data.name = name.value || ''
    data.secondName = secondName.value || ''
    data.email = email.value || ''
    data.age = age.value || ''
    data.job = job.value || ''

    const key = data.email
    storage[key] = data

    localStorage.setItem('users', JSON.stringify(storage))

    rerenderCard(JSON.parse(localStorage.getItem('users')))

    return data
}

function createCard({ name, secondName, email, age, job }) {
    return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p>Имя: ${name}</p>
                <p>Фамилия: ${secondName}</p>
                <p>Email: ${email}</p>
                <p>Возраст: ${age}</p>
                <p>Место работы: ${job}</p>
            </div>
            <div class="menu">
                <button data-delete=${email} class="delete">Удалить</button>
                <button data-change=${email} class="change">Применить</button>
            </div>
        </divd>
    `
}

function rerenderCard(storage) {
    users.innerHTML = ''

    /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

    /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

    Object.entries(storage).forEach(user => {
        // user = ['email1', {name: '', secondName: '', email: ''}]
        const [email, userData] = user

        const div = document.createElement('div')
        div.className = 'user'
        div.innerHTML = createCard(userData)
        users.append(div)
    })
}

function setListeners() {
    const del = document.querySelectorAll('.delete')
    const change = document.querySelectorAll('.change')
    let clicked

    del.forEach(n => {
        n.addEventListener('click', () => {
            clicked = n.getAttribute('data-delete')
            const outer = document.querySelector(`[data-out="${clicked}"]`).closest('.user')
            delete storage[`${clicked}`]
            localStorage.setItem('users', JSON.stringify(storage))
            outer.remove()
        })
    })

    change.forEach(n => {
        n.addEventListener('click', () => {
            clicked = n.getAttribute('data-change')
            name.value = storage[`${clicked}`]['name']
            secondName.value = storage[`${clicked}`]['secondName']
            email.value = storage[`${clicked}`]['email']
            job.value = storage[`${clicked}`]['job']
            age.value = storage[`${clicked}`]['age']
        })
    })
}

function clearLocalStorage() {
    window.location.reload()
    localStorage.removeItem('users')
}

function show(el) {
    el.style.display = 'block'
}

function hide(el) {
    el.style.display = 'none'
}

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')))

console.log(storage);
for (let key in storage) {
   console.log(storage[key]['secondName'])
}