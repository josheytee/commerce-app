export class ApiResponseDto<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: Date = new Date();

    constructor(success: boolean, message: string, data?: T) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
