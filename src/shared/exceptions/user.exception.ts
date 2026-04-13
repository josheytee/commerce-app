import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
    constructor(userId: number) {
        super(
            {
                success: false,
                message: `User with ID ${userId} not found`,
                errorCode: 'USER_404',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class UserEmailAlreadyExistException extends HttpException {
    constructor(email: string) {
        super(
            {
                success: false,
                message: `User Email ${email} already exists, Kindly use another email`,
                errorCode: 'USER_404',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
