const staffs = [
    {
        id: 1,
        name: "John",
        age: 30,
        gender: "male",
        salary: 5000,
        married: false,
        skills: ["html", "css", "js"],
        employment_at: "2020-01-01"
    },
    {
        id: 2,
        name: "Jane",
        age: 25,
        gender: "female",
        salary: 4000,
        married: true,
        skills: ["html", "css", "js", "php"],
        employment_at: "2023-06-21"
    },
    {
        id: 3,
        name: "Bob",
        age: 35,
        gender: "male",
        salary: 6000,
        married: false,
        skills: ["html", "css", "js", "python"],
        employment_at: "2021-03-15"
    },
    {
        id: 4,
        name: "Alice",
        age: 28,
        gender: "female",
        salary: 4500,
        married: true,
        skills: ["html", "css"],
        employment_at: "2022-09-01"
    },
    {
        id: 5,
        name: "Charlie",
        age: 40,
        gender: "male",
        salary: 7000,
        married: true,
        skills: ["html", "css", "js", "python", "java"],
        employment_at: "2020-07-10"
    },
    {
        id: 6,
        name: "Emily",
        age: 32,
        gender: "female",
        salary: 5000,
        married: true,
        skills: ["js", "C++"],
        employment_at: "2023-02-28"
    },
    {
        id: 7,
        name: "David",
        age: 29,
        gender: "male",
        salary: 5500,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2021-11-05"
    },
    {
        id: 8,
        name: "Sophia",
        age: 27,
        gender: "female",
        salary: 4000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2022-08-15"
    }
]


const tbody = document.getElementById('table-body')
const modal = document.getElementById('modal')
const form = document.getElementById('form')
const filter = document.getElementById('filter')
const tableFields = [ 'id', 'name', 'skills', 'employment_at', 'gender', 'age', 'salary' ]

const getFormatFunc = {
    default: (field) => field,
    gender: (field) => field.trim().toLowerCase() === 'male' ? 'Мужской' : 'Женский',
    salary: (field) => field + ' ₽'
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

        return order === 'asc' ? fElem[sort] < sElem[sort]? -1 : 1 : fElem[sort] > sElem[sort]? -1 : 1
    })
    showData(sortedData)
}

const handleSave = () => {
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries()) || {}

    const isDataValid = Object.values(data).every((elem) => elem.length)

    if (!isDataValid) {
        return
    }

    // Не учитывается уникальность id. Такую задачу решает БД
    staffs.push({id: getStaffsMaxId() + 1, ...data})
    showData()
}

const getStaffsMaxId = () => {
    return Math.max(...staffs.map((elem) => elem.id))
}

document.addEventListener('click', (ev) => {
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
        handleSave()
        modal.classList.toggle('show')
    }
})

filter.addEventListener('input', debounce(() => filterData()))

showData()