const request = require("supertest");
const express = require("express");
const app = express();
const chai = require("chai");
const expect = chai.expect;

// Import your app's routes and middleware here

describe("Home Route", () => {
  it('should return "Welcome to my API"', async () => {
    const response = await request(app).get("/");
    expect(response.text).to.equal("Welcome to my API");
  });
});
