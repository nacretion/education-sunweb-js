/**
 * Базовая обертка для работы с API
 */
class Api {
    baseGetUrl;
    basePOSTUrl;

    /**
     * @param {string} baseGetUrl - Url для GET запросов
     * @param {string} basePOSTUrl - Url для POST запросов
     */
    constructor(baseGetUrl, basePOSTUrl) {
        this.baseGetUrl = baseGetUrl;
        this.basePOSTUrl = basePOSTUrl || baseGetUrl;
    }

    get(params) {
        const url = new URL(this.baseGetUrl);

        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        })

        return fetch(url)
            .then(response => response.json());
    }

    post(data) {
        const url = new URL(this.basePOSTUrl);

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json());
    }

    delete(query) {
        return fetch(this.basePOSTUrl + query, {
            method: "DELETE",
        });
    }
}

export default Api