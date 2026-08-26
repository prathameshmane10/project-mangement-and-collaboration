export class ApiResponse {
    static success(res, message = 'Success', data = {}, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data: data ?? {},
        });
    }

    static error(res, message = 'An error occurred', errors = [], statusCode = 400) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors: Array.isArray(errors) ? errors : [errors],
        });
    }
}