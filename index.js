let total_users = 0

const paginationProxy = new Proxy(
    {
        limit: 20,
        offset: 0,
        staffs: [],
        search: ''
    },
    {
        set: function (target, key, value) {
            target[key] = value;

            if (key === 'search') {
                target['offset'] = 0
            }

            getUsers(target.limit, target.offset)
                .then(users => showData(users))

            return true;
        }
    });

const baseGETURL = 'https://api.slingacademy.com/v1/sample-data'
const basePOSTURL = 'https://jsonplaceholder.typicode.com'

const getUsers = async (
    limit = paginationProxy.limit,
    offset = paginationProxy.offset,
    search = paginationProxy.search
) => {
    loader.classList.add('loaderShow')
    const url = baseGETURL +
        `/users?offset=${offset}&limit=${limit}${search ? '&search=' + search : ''}`

    const data = await fetch(url)

    const response = await data.json()
    total_users = response.total_users
    if (response.success) {

        loader.classList.remove('loaderShow')
        return response.users
    }
}

const saveUser = async (user) => {
    loader.classList.add('loaderShow')
    const url = basePOSTURL + `/users`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    if (response.ok) {
        loader.classList.remove('loaderShow')
        return response.body
    }
}

const deleteUser = async (id) => {
    loader.classList.add('loaderShow')
    const url = basePOSTURL + `/users/${id}`

    const response = await fetch(url, {
        method: 'DELETE'
    })

    if (response.ok) {
        loader.classList.remove('loaderShow')
        return response.body
    }
}


const tbody = document.getElementById('table-body')
const modal = document.getElementById('modal')
const form = document.getElementById('form')
const filter = document.getElementById('filter')
const notify = document.getElementsByClassName('toast')[0] || undefined
const notifyBody = document.getElementById('notifyBody')
const loader = document.getElementById('loader')
const dropdown = document.getElementById('dropdown')
const dropdownMenu = document.getElementById('dropdownMenu')

const tableFields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'email', 'street']
const getFormatFunc = {
    default: (field) => field,
    gender: (field) => field.trim().toLowerCase() === 'male' ? 'Мужской' : 'Женский',
    date_of_birth: (field) => new Date(field).toLocaleDateString('en-US')
}

const validation = {
    default: /[a-zA-Z]{3,30}/,
    date_of_birth: /\d{1,2}\/\d{1,2}\/\d{2,4}/,
    gender: /Мужской|Женский/,
    street: /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/,
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
}

const showData = (data = paginationProxy.staffs) => {
    if (!data.length || !tbody) {
        return
    }

    tbody.innerHTML = ''

    data.forEach((elem, index) => {
        const tableRow = tbody.insertRow(index)

        const cells = {}

        tableFields.forEach(tableName => {
            const formatField = getFormatFunc[tableName] || getFormatFunc.default
            cells[tableName] = tableRow.insertCell()
            cells[tableName].innerHTML = formatField(elem[tableName])
        })
        tableRow.className = 'tableRow'
        tableRow.ref = elem.id
        cells['delete'] = tableRow.insertCell()
        cells['delete'].className = 'buttonDelete'
    })
}

const debounce = (callback, delay = 400) => {
    let prevTimeoutId;

    return (...args) => {
        clearTimeout(prevTimeoutId)
        prevTimeoutId = setTimeout(() => callback(...args), delay)
    }
}

const filterData = () => {
    paginationProxy.search = filter.value.toLowerCase()
}

const sortData = ({sort, order}) => {
    const sortedData = [...paginationProxy.staffs].sort((fElem, sElem) => {

        return order === 'asc' ? fElem[sort] < sElem[sort] ? -1 : 1 : fElem[sort] > sElem[sort] ? -1 : 1
    })
    showData(sortedData)
}

const validateData = (data = {}) => {
    let invalidFieldsCount = 0

    Object.keys(data).forEach(key => {
        const formatFunc = getFormatFunc[key] || getFormatFunc.default
        const regex = validation[key] || validation.default
        const formattedField = formatFunc(data[key])

        const isValid = regex.test(formattedField)

        const input = document.getElementsByName(key)[0]

        if (!isValid) {

            invalidFieldsCount++
            input.classList.add('is-invalid')
            return
        }
        input.classList.remove('is-invalid')
    })
    return invalidFieldsCount
}

const handleSave = async () => {
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries()) || {}

    const isDataValid = !validateData(data) && Object.keys(data).length !== 0

    if (!isDataValid) {
        return
    }

    const id = getStaffsMaxId() + 1
    const user = {...data, id}

    const response = await saveUser(user)

    if (response) {
        notify.classList.add('show')
        setTimeout(() => {
            notify.classList.remove('show')
        }, 3000)
        notifyBody.innerHTML = `User with id=${id} created!`
    }
    modal.classList.toggle('show')
}

const handleRemove = async (id) => {
    const response = await deleteUser(id)

    if (response) {
        notify.classList.add('show')
        setTimeout(() => {
            notify.classList.remove('show')
        }, 3000)
        notifyBody.innerHTML = `User with id=${id} removed!`
    }
}

const getStaffsMaxId = () => {
    return Math.max(...paginationProxy.staffs.map((elem) => elem.id))
}

const clickHandlerByClass = {
    default: () => {},
    'close-modal': () => {
        modal.classList.toggle('show')
    },
    'dropdown-item': (ev) => {
        paginationProxy.limit = +ev.target.innerHTML
        dropdown.children[0].innerHTML = ev.target.innerHTML
        dropdownMenu.classList.toggle('show')
    },
    'dropdown-toggle': () => {
        dropdownMenu.classList.toggle('show')
    },
    'buttonDelete': async(ev) => {
        await handleRemove(ev.target.parentElement.ref)
    }
}

const clickHandlerById = {
    default: () => {},
    'next': () => {
        if (paginationProxy.offset < total_users - paginationProxy.limit) {
            paginationProxy.offset += paginationProxy.limit
        }
    },
    'prev': () => {
        if (paginationProxy.offset - paginationProxy.limit >= 0) {
            paginationProxy.offset -= paginationProxy.limit
        }
    },
    'save-modal': async() => {
        await handleSave()
    },
    'buttonAdd': () => {
        modal.classList.toggle('show')
        form.reset()
    }
}

document.addEventListener('click', async (ev) => {
    ev.stopPropagation()

    if (ev.target.dataset.sort) {
        ev.target.dataset.order = ev.target.dataset.order === 'asc' ? 'desc' : 'asc'
        sortData(ev.target.dataset)
        return
    }

    if (ev.target.id === "save-modal") {
        await handleSave()
        return
    }

    const {id, classList} = ev.target

    const validClass = Object.values(classList).find(
        className => Object.keys(clickHandlerByClass).includes(className)
    )

    const classHandler = clickHandlerByClass[validClass] || clickHandlerByClass.default
    const idHandler = clickHandlerById[id] || clickHandlerById.default

    await classHandler(ev)
    await idHandler()

}, {})

filter.addEventListener('input', debounce(() => filterData()))

getUsers().then(users => paginationProxy.staffs = users)