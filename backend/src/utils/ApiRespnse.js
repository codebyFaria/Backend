class ApiResponse {

    constructor(message = "Success", data = null, statusCode = 200) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;