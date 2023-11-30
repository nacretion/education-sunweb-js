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
const tableFields = [ 'id', 'name', 'skills', 'employment_at', 'gender', 'age', 'salary' ]

const showData = () => {
    if (!staffs.length || !tbody) {
        return
    }

    tbody.innerHTML = ''

    staffs.forEach((elem, index) => {
        const tableRow = tbody.insertRow(index)

        const cells = {}

        tableFields.forEach(tableName => {
            cells[tableName] = tableRow.insertCell()
            cells[tableName].innerHTML = elem[tableName]
        })
    })
}

document.addEventListener('click', ({target}) => {
    if (['close-modal', 'buttonAdd'].includes(target.id)) {
        modal.classList.toggle('show')
    }
    if (target.id === "save-modal") {
        handleSave()
    }
})

const handleSave = () => {
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries()) || {}

    const isDataValid = Object.values(data).every((elem) => elem.length)

    if (!isDataValid) {
        return
    }

    staffs.push({id: staffs.length + 1, ...data})
    showData()
    modal.classList.toggle('show')
}


showData()