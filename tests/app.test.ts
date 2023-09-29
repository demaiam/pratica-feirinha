import supertest from "supertest";
import app from "index";
import httpStatus from "http-status";

const server = supertest(app);

describe("POST /fruits", () => {
  it("should return 201 when inserting a fruit", async () => {
    const fruit = { name: "apple", price: 100 };

    const response = await server.post("/fruits").send(fruit);

    expect(response.status).toBe(httpStatus.CREATED);
  });

  it("should return 409 when inserting a fruit that is already registered", async () => {
    const fruit = { name: "apple", price: 100 };

    await server.post("/fruits").send(fruit);

    const response = await server.post("/fruits").send(fruit);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it("should return 422 when inserting a fruit with data missing", async () => {
    const response = await server.post("/fruits").send({});

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
});

describe("GET /fruits", () => {
  it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
    const response = await server.get("/fruits/1234");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 400 when id param is present but not valid", async () => {
    const response = await server.get("/fruits/abc");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return one fruit when given a valid and existing id", async () => {
    const fruit = { name: "apple", price: 100 };

    await server.post("/fruits").send(fruit);

    const response = await server.get("/fruits/1");

    expect(response.body).toEqual({ id: 1, name: "apple", price: 100 });
  });

  it("should return all fruits if no id is present", async () => {
    const response = await server.get("/fruits");

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number)
      })
    ]));
  });
});