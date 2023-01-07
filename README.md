# react-router-roots
typed routes for react-router

# API
```typescript
const routerRoutes = {
    contact: "contact",
    dashboard: "dashboard",
    login: "login",
    logout: "logout",

    users: {
        path: "users/:userId",
        children: {
            profile: "profile",
            settings: "settings",
        },
    },

    store: {
        path: "store",
        children: {
            item: "items/:itemId",
            items: "items/:category/:area",
        },
    },
} as const satisfies RoutesPredicate;
```

```typescript jsx
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path={routerRoutes.contact} element={<Contact />} />
      <Route path={routerRoutes.dashboard} element={<Dashboard />} />

      <Route element={<AuthLayout />}>
        <Route path={routerRoutes.login} element={<Login />} />
        <Route path={routerRoutes.logout} element={<Logout />} />
      </Route>

      <Route path={routerRoutes.users.path} element={<User />}>
        <Route path={routerRoutes.users.children.profile} element={<UserProfile />} />
        <Route path={routerRoutes.users.children.settings} element={<UserSettings />} />
      </Route>

      <Route path={routerRoutes.store.path} element={<Store />}>
        <Route path={routerRoutes.store.children.item} element={<Item />} />
        <Route path={routerRoutes.store.children.items} element={<Items />} />
      </Route>
    </Route>
  )
);
```

```typescript jsx
const routes = makeAbsolute(routerRoutes);

router.navigate(routes.logout);
router.navigate(applyPathParams(routes.users.profile, { userId: 4 }));
router.navigate(applyPathParams(routes.store.item, { itemId: 3 }));
router.navigate(applyPathParams(routes.store.items, { area: "US", category: "food" }));
```

![image](https://user-images.githubusercontent.com/16955580/211160430-09307e7e-28d0-479d-a73f-7dc734667d7e.png)
![image](https://user-images.githubusercontent.com/16955580/211160436-61d3142f-f82c-44ac-8616-2ac987ef3d43.png)
