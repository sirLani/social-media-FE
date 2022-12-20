import { rest } from "msw";
import { UserProps } from "../context";

export const handlers = [
  // Handles a POST /register user request
  rest.post("/register", (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        ok: true,
        name: "user",
        email: "user@mail.com",
      })
    );
  }),

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

  rest.post("/forgot-password", (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        success: "Congrats. Now you can login with your new password",
      })
    );
  }),

  rest.get("/current-user", (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        success: "Congrats. Now you can login with your new password",
      })
    );
  }),

  rest.get(`/news-feed/${1}`, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        comments: [
          {
            text: "juicy",
            postedBy: {},
            _id: "638b264373e08704f1a094fc",
            created: "2022-12-03T10:34:43.071Z",
          },
          {
            text: "another thing wey i know know",
            postedBy: {},
            _id: "638b27430ef93b5135833953",
            created: "2022-12-03T10:38:59.637Z",
          },
        ],
        content: "another basic post about wetin i won know",
        createdAt: "2022-11-27T21:30:38.731Z",
        image: {
          url: "https://res.cloudinary.com/dagzxzuv0/image/upload/v1669584635/cyxp2nnvpzyoqxr7f1vr.jpg",
          public_id: "cyxp2nnvpzyoqxr7f1vr",
        },
        likes: [],
        postedBy: { _id: "637d239cea80c7bd4067320a", name: "Aston Villa" },
        updatedAt: "2022-12-03T10:38:59.633Z",
        _id: "6383d6fe4b3a3e53a61a3f14",
      })
    );
  }),
  rest.post("/register", (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        ok: true,
        name: "user",
        email: "user@mail.com",
      })
    );
  }),
];
