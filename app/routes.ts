import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/Landing.tsx"),
  route("signup", "routes/Signup.tsx"),
  route("login", "routes/Login.tsx"),

  layout("components/ProtectedLayout.tsx", [
    route("notes", "routes/Notes.tsx"),
    route("editor/:id?", "routes/Editor.tsx"),
  ]),
] satisfies RouteConfig;
