import * as request from "supertest";
import {app} from "../../Server/ExpressApp";

// var request = supertest(app)

jest.setTimeout(30000);


it("Test de jest", function()
{
    expect(1).toBe(1);
})

it("Test de get /", async function(done)
{
    const res = await request(app).get("/");
    expect(res.status).toBe(200)
})