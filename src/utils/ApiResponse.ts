class ApiResponse {
    data: any;
    message: string;
    statusCode: number;
    success: boolean;
    constructor(data: any, message: string = "success", statusCode: number) {
        this.success = statusCode < 400
        this.data = data
        this.message = message
        this.statusCode = statusCode
    }
}

export default ApiResponse