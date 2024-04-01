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

    static notFoundError(message) {
        return new Response(this.NOT_FOUND, null, message);
    }

    static failure(message) {
        return new Response(this.FAIL, null, message);
    }

    static get SUCCESS() {
        return 200;
    }

    static get NO_CONTENT() {
        return 204;
    }

    static get NOT_AUTHORIZED() {
        return 401;
    }

    static get NOT_FOUND() {
        return 404;
    }

    static get FAIL() {
        return 500;
    }
}

module.exports = Response;
