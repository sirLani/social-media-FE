import { rest } from "msw";
import { UserProps } from "../context";

export const handlers = [
  // Handles a POST /login request
  rest.post("/login", (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json<UserProps>({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M",
        user: {
          image: {
            url: "http://localhost",
            public_id: "bs8ucuhdsuisu",
          },
          _id: "nksnjssiouso",
          name: "user",
          email: "user@mail.com",
          following: [],
          followers: ["638658558d26ccffc6117ba7"],
          createdAt: new Date(),
          username: "avatar",
        },
      })
    );
  }),
];
