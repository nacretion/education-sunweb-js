import Api from './Api'

class UsersApi extends Api {

    /**
     * Запросить пользователей
     * @param {object} params
     * @param {number} params.limit Количество запрашиваемых пользователей
     * @param {number} params.offset Смещение от начала
     * @param {string?} params.search Поисковая строка
     * @param {array?} params.fields Поля, которые нужно вернуть
     * @returns {Promise<array|Error>}
     */
    async getUsers(params = {limit: 15, offset: 0}) {
        const response = await this.get(params)

        if (response.success) {
            if (!params.fields) {
                return response.users
            }
            return response.users.map(user =>
                params.fields.reduce((acc, field) => {
                    acc[field] = user[field]
                    return acc
                }, {})
            )
        }

        return new Error('Не удалось получить пользователей')
    }

    /**
     * Сохранить пользователя
     * @param user
     * @returns {Promise<array|Error>}
     */
    async saveUser(user) {
        const response = await this.post(user)

        if (response.success) {
            return response.users
        }

        return new Error('Не удалось сохранить пользователя')
    }

    /**
     * Удалить пользователя
     * @param id id пользователя которого нужно удалить
     * @returns {Promise<boolean|Error>}
     */
    async deleteUser(id) {
        const response = await this.delete(`/${id}`)

        if (response.ok) {
            return true
        }

        return new Error('Не удалось удалить пользователя')
    }
}

export default UsersApi