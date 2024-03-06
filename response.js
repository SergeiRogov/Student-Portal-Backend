class Response {
    constructor(status, data, message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }

    // TODO: Add i18n localisation to response messages\
    static get unauthorized() {
        return new Response(this.NOT_AUTHORIZED, null, "Unauthorized");
    }

    static get internalServerError() {
        return new Response(this.FAIL, null, "Internal Server Error");
    }

    static get SUCCESS() {
        return 200;
    }

    static get FAIL() {
        return 500;
    }

    static get NOT_AUTHORIZED() {
        return 401;
    }
}

module.exports = Response;
