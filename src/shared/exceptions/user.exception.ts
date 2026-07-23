// src/common/exceptions/user.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UserNotFoundException extends BaseException {
    constructor(userId: number) {
        super(
            `User with ID ${userId} not found`,
            'USER_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { userId },
        );
    }
}

export class UserEmailAlreadyExistsException extends BaseException {
    constructor(email: string) {
        super(
            `User with email "${email}" already exists`,
            'USER_409_EMAIL_EXISTS',
            HttpStatus.CONFLICT,
            { email },
        );
    }
}

export class UserPhoneAlreadyExistsException extends BaseException {
    constructor(phone: string) {
        super(
            `User with phone "${phone}" already exists`,
            'USER_409_PHONE_EXISTS',
            HttpStatus.CONFLICT,
            { phone },
        );
    }
}

export class UserNotActiveException extends BaseException {
    constructor(userId: number) {
        super(
            `User ${userId} is not active`,
            'USER_403_INACTIVE',
            HttpStatus.FORBIDDEN,
            { userId },
        );
    }
}

export class UserNotVerifiedException extends BaseException {
    constructor(userId: number) {
        super(
            `User ${userId} is not verified`,
            'USER_403_UNVERIFIED',
            HttpStatus.FORBIDDEN,
            { userId },
        );
    }
}

export class UserInvalidCredentialsException extends BaseException {
    constructor() {
        super(
            'Invalid email or password',
            'USER_401_INVALID_CREDENTIALS',
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class UserAccountLockedException extends BaseException {
    constructor(userId: number, attempts: number) {
        super(
            `User account ${userId} is locked due to ${attempts} failed login attempts`,
            'USER_403_ACCOUNT_LOCKED',
            HttpStatus.FORBIDDEN,
            { userId, attempts },
        );
    }
}

export class UserPermissionDeniedException extends BaseException {
    constructor(userId: number, permission: string) {
        super(
            `User ${userId} does not have permission for: ${permission}`,
            'USER_403_PERMISSION_DENIED',
            HttpStatus.FORBIDDEN,
            { userId, permission },
        );
    }
}