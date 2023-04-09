import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../app.module";
import { ValidationPipe } from "./../pipes/validation.pipe";

// На начало тестирования бд должна быть пустой

describe("tests", () => {
  let app: any;
  let httpServer: any;

  const authEndpoint = "/auth";
  const rolesEndpoint = "/roles";
  const usersEndpoint = "/users";
  const profilesEndpoint = "/profiles";

  let userToken: string;
  let userId: number;
  let profileId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("roles", () => {
    it("should create role ADMIN with correct input data", async () => {
      const role = {
        value: "ADMIN",
        description: "Администратор",
      };

      const response = await request(httpServer).post(rolesEndpoint).send(role);

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("value", role.value);
      expect(response.body).toHaveProperty("description", role.description);
    });

    it("should create role USER with correct input data", async () => {
      const role = {
        value: "USER",
        description: "Пользователь",
      };

      const response = await request(httpServer).post(rolesEndpoint).send(role);

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("value", role.value);
      expect(response.body).toHaveProperty("description", role.description);
    });

    it(`shouldn't create role with incorrect input data`, async () => {
      const role = {
        value: null,
        description: "Роль",
      };

      const response = await request(httpServer).post(rolesEndpoint).send(role);

      expect(response.status).toBe(400);
      expect(response.text).toBe('["value - Должно быть строкой"]');
    });

    it("should get role by correct value", async () => {
      const response = await request(httpServer).get(`${rolesEndpoint}/ADMIN`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("value", "ADMIN");
      expect(response.body).toHaveProperty("description", "Администратор");
    });
  });

  describe("registration", () => {
    it("should register a user", async () => {
      const registrationData = {
        email: "user@mail.ru",
        password: "12345678",
        surname: "Иванов",
        name: "Иван",
        phone: "89201234567",
      };

      const response = await request(httpServer)
        .post(`${profilesEndpoint}/registration`)
        .send(registrationData);

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("surname", registrationData.surname);
      expect(response.body).toHaveProperty("name", registrationData.name);
      expect(response.body).toHaveProperty("phone", registrationData.phone);
      expect(response.body).toHaveProperty("userId", expect.any(Number));

      profileId = response.body.id;
      userId = response.body.userId;
    });

    it(`registration shouldn't take place`, async () => {
      const registrationData = {
        email: "user",
        password: "12345678",
        surname: "Иванов",
        name: "Иван",
        phone: "89201234567",
      };

      const response = await request(httpServer)
        .post(`${profilesEndpoint}/registration`)
        .send(registrationData);

      expect(response.status).toBe(400);
      expect(response.text).toBe('["email - Некорректный email"]');
    });

    it(`shouldn't registrat with existing email`, async () => {
      const registrationData = {
        email: "user@mail.ru",
        password: "12345678",
        surname: "Иванов",
        name: "Иван",
        phone: "89201234567",
      };

      const response = await request(httpServer)
        .post(`${profilesEndpoint}/registration`)
        .send(registrationData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: "Пользователь с таким email существует",
      });
    });
  });

  describe("authorization", () => {
    it("should authorize user", async () => {
      const authorizationData = {
        email: "user@mail.ru",
        password: "12345678",
      };

      const response = await request(httpServer)
        .post(`${authEndpoint}/login`)
        .send(authorizationData);

      expect(response.status).toBe(201);

      userToken = response.body.token;
    });

    it(`shouldn't get data without auth`, async () => {
      const response = await request(httpServer).get(`${usersEndpoint}/1`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Пользователь не авторизован" });
    });
  });

  describe("users", () => {
    it("should get user by existing id", async () => {
      const response = await request(httpServer)
        .get(`${usersEndpoint}/${userId}`)
        .auth(userToken, { type: "bearer" });

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("id", userId);
      expect(response.body).toHaveProperty("email", "user@mail.ru");
    });

    it("should add role for user", async () => {
      const addRoleData = {
        value: "ADMIN",
        userId: userId,
      };

      const response = await request(httpServer)
        .post(`${usersEndpoint}/role`)
        .auth(userToken, { type: "bearer" })
        .send(addRoleData);

      expect(response.status).toBe(201);

      // Обнавляем токен
      const authorizationData = {
        email: "user@mail.ru",
        password: "12345678",
      };

      const responseAuth = await request(httpServer)
        .post(`${authEndpoint}/login`)
        .send(authorizationData);

      userToken = responseAuth.body.token;
    });
  });

  describe("profiles", () => {
    it("should get profile by user id", async () => {
      const response = await request(httpServer)
        .get(`${profilesEndpoint}/user/${userId}`)
        .auth(userToken, { type: "bearer" });

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("userId", userId);
    });

    it(`shouldn't update profile by non-existen id`, async () => {
      const profileData = {
        id: 9999,
        surname: "Иванов",
        name: "Иван",
        phone: "89201234567",
        userId: userId,
      };

      const response = await request(httpServer)
        .put(`${profilesEndpoint}/9999`)
        .auth(userToken, { type: "bearer" })
        .send(profileData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: "Профиль не найден",
      });
    });

    it(`should update profile`, async () => {
      const profileData = {
        id: profileId,
        surname: "Петров",
        name: "Пётр",
        phone: "89111",
        userId: userId,
      };

      const response = await request(httpServer)
        .put(`${profilesEndpoint}/${profileId}`)
        .auth(userToken, { type: "bearer" })
        .send(profileData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...profileData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it(`should delete profile`, async () => {
      const response = await request(httpServer)
        .delete(`${profilesEndpoint}/${profileId}`)
        .auth(userToken, { type: "bearer" });

      expect(response.status).toBe(200);

      const responseGet = await request(httpServer)
        .get(`${profilesEndpoint}/${profileId}`)
        .auth(userToken, { type: "bearer" });

      expect(responseGet.status).toBe(200);
      expect(responseGet.body).toEqual({});
    });
  });
});
