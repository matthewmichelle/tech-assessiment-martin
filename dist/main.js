"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const fs = require("fs");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
    }));
    const rawData = fs.readFileSync('swagger.config.json', 'utf8');
    const configData = JSON.parse(rawData);
    const config = new swagger_1.DocumentBuilder()
        .setTitle(configData.title)
        .setDescription(configData.description)
        .setVersion(configData.version)
        .addBearerAuth({
        type: configData.auth_type,
        scheme: configData.auth_scheme,
        bearerFormat: configData.auth_scheme_format,
        name: 'Authorization',
        in: 'header',
    }, configData.auth_token)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map