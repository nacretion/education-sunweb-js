let staffs = []
const staffsProxy = new Proxy(staffs, {
    set: function (target, index, value) {
        target[index] = value;
        showData()
        return true;
    }
});

const baseGETURL = 'https://api.slingacademy.com/v1/sample-data'
const basePOSTURL = 'https://jsonplaceholder.typicode.com'

const getUsers = async (limit = 20, offset = 0) => {
    const url = baseGETURL + `/users?offset=${offset}&limit=${limit}`

    const data = await fetch(url)

    const response = await data.json()

    if (response.success) {
        return response.users
    }
}

const saveUser = async (user) => {
    const url = basePOSTURL + `/users`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    if (response.ok) {
        return response.body
    }
}

const tbody = document.getElementById('table-body')
const modal = document.getElementById('modal')
const form = document.getElementById('form')
const filter = document.getElementById('filter')
const notify = document.getElementsByClassName('toast')[0] || undefined
const notifyBody = document.getElementById('notifyBody')

const tableFields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'state', 'street']
const getFormatFunc = {
    default: (field) => field,
    gender: (field) => field.trim().toLowerCase() === 'male' ? 'Мужской' : 'Женский',
    date_of_birth: (field) => new Date(field).toLocaleDateString()
}

const showData = (data = staffs) => {
    if (!staffs.length || !tbody) {
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
        tableRow.ref = elem
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
    const filterQuery = filter.value.toLowerCase()

    const filteredData = staffs.filter((elem) =>
        Object.keys(elem).some((key) => {
            const formatField = getFormatFunc[key] || getFormatFunc.default

            const formattedField = formatField(elem[key])
            const fieldValue = formattedField.toString().toLowerCase()

            return fieldValue.includes(filterQuery)
        })
    )
    showData(filteredData)
}

const sortData = ({sort, order}) => {
    const sortedData = [...staffs].sort((fElem, sElem) => {

        return order === 'asc' ? fElem[sort] < sElem[sort] ? -1 : 1 : fElem[sort] > sElem[sort] ? -1 : 1
    })
    showData(sortedData)
}

const handleSave = async () => {
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries()) || {}

    const isDataValid = Object.values(data).every((elem) => elem.length)

    if (!isDataValid) {
        return
    }
    const user = {id: getStaffsMaxId() + 1, ...data}

    const response = await saveUser(user)

    if (response) {
        // Не учитывается уникальность id. Такую задачу решает БД
        staffsProxy.push(user)
        notify.classList.add('show')
        setTimeout(() => {
            notify.classList.remove('show')
        }, 3000)
        notifyBody.innerHTML = 'User created!'
    }
}

const getStaffsMaxId = () => {
    return Math.max(...staffs.map((elem) => elem.id))
}

document.addEventListener('click', async (ev) => {
    if (ev.target.id === 'buttonAdd') {
        modal.classList.toggle('show')
    }

    if (ev.target.className.includes('close-modal')) {
        modal.classList.toggle('show')
    }

    if (ev.target.dataset.sort) {
        ev.target.dataset.order = ev.target.dataset.order === 'asc' ? 'desc' : 'asc'
        sortData(ev.target.dataset)
    }

    if (ev.target.className === 'buttonDelete') {
        const index = staffs.indexOf(ev.target.parentElement.ref)
        staffs.splice(index, 1);
        showData()
    }

    if (ev.target.id === "save-modal") {
        await handleSave()
        modal.classList.toggle('show')
    }
})

filter.addEventListener('input', debounce(() => filterData()))

getUsers().then(users => staffsProxy.push(...users))