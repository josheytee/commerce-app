import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiExtraModels,
    getSchemaPath,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
    ApiErrorResponseDto,
    ApiResponseDto,
    PaginatedResponseDto,
} from './api-response.dto';

export const ApiSuccessResponse = <TModel extends Type<any>>(model: TModel) =>
    applyDecorators(
        ApiExtraModels(ApiResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        properties: {
                            data: { $ref: getSchemaPath(model) },
                        },
                    },
                ],
            },
        }),
    );

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) =>
    applyDecorators(
        ApiExtraModels(ApiResponseDto, PaginatedResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        properties: {
                            data: {
                                allOf: [
                                    { $ref: getSchemaPath(PaginatedResponseDto) },
                                    {
                                        properties: {
                                            items: {
                                                type: 'array',
                                                items: { $ref: getSchemaPath(model) },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        }),
    );

export const ApiErrorResponse = () =>
    applyDecorators(
        ApiExtraModels(ApiErrorResponseDto),
        ApiBadRequestResponse({
            type: ApiErrorResponseDto,
        }),
    );
